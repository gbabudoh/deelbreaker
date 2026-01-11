import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { DealType, GroupBuyStatus } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const user = await getAuthenticatedUser()
    
    if (!user) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()
    const { quantity = 1 } = body

    // Get deal details
    const deal = await prisma.deal.findUnique({
      where: { id: resolvedParams.id },
      include: {
        groupBuys: true
      }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    if (deal.type !== DealType.GROUP_BUY) {
      return NextResponse.json(
        { error: 'This is not a group buy deal' },
        { status: 400 }
      )
    }

    // Check if user already joined
    const existingParticipant = await prisma.groupBuyParticipant.findUnique({
      where: {
        userId_dealId: {
          userId: user.id,
          dealId: resolvedParams.id
        }
      }
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'You have already joined this group buy' },
        { status: 400 }
      )
    }

    // Check if group buy is still active
    if (deal.endDate && deal.endDate < new Date()) {
      return NextResponse.json(
        { error: 'This group buy has expired' },
        { status: 400 }
      )
    }

    // Create group buy participation
    const participant = await prisma.groupBuyParticipant.create({
      data: {
        userId: user.id,
        dealId: resolvedParams.id,
        quantity,
        priceAtJoin: deal.currentPrice,
        currentPrice: deal.currentPrice,
        status: GroupBuyStatus.ACTIVE
      }
    })

    // Update deal participant count
    await prisma.deal.update({
      where: { id: resolvedParams.id },
      data: {
        currentParticipants: {
          increment: 1
        }
      }
    })

    // Check if target reached and update pricing
    const updatedDeal = await prisma.deal.findUnique({
      where: { id: resolvedParams.id }
    })

    if (updatedDeal && updatedDeal.targetParticipants && 
        updatedDeal.currentParticipants >= updatedDeal.targetParticipants) {
      // Calculate new price (example: 20% additional discount when target reached)
      const newPrice = updatedDeal.currentPrice * 0.8
      
      await prisma.deal.update({
        where: { id: resolvedParams.id },
        data: {
          currentPrice: newPrice,
          discount: Math.round(((updatedDeal.originalPrice - newPrice) / updatedDeal.originalPrice) * 100)
        }
      })

      // Update all participants' current price
      await prisma.groupBuyParticipant.updateMany({
        where: { dealId: resolvedParams.id },
        data: { currentPrice: newPrice }
      })

      // Record price history
      await prisma.priceHistory.create({
        data: {
          dealId: resolvedParams.id,
          price: newPrice,
          participants: updatedDeal.currentParticipants
        }
      })
    }

    return NextResponse.json({
      participant,
      message: 'Successfully joined group buy!'
    })
  } catch (error) {
    console.error('Error joining group buy:', error)
    return NextResponse.json(
      { error: 'Failed to join group buy' },
      { status: 500 }
    )
  }
}