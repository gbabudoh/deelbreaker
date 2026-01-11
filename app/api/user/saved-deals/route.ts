import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const savedDeals = await prisma.savedDeal.findMany({
      where: { userId: session.user.id },
      include: {
        deal: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
                verified: true
              }
            },
            _count: {
              select: {
                groupBuys: true,
                reviews: true
              }
            }
          }
        }
      },
      orderBy: { savedAt: 'desc' }
    })

    return NextResponse.json(savedDeals)
  } catch (error) {
    console.error('Error fetching saved deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dealId, priceAlert = false } = body

    if (!dealId) {
      return NextResponse.json(
        { error: 'Deal ID is required' },
        { status: 400 }
      )
    }

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Check if already saved
    const existingSave = await prisma.savedDeal.findUnique({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId
        }
      }
    })

    if (existingSave) {
      return NextResponse.json(
        { error: 'Deal already saved' },
        { status: 400 }
      )
    }

    const savedDeal = await prisma.savedDeal.create({
      data: {
        userId: session.user.id,
        dealId,
        priceAlert
      },
      include: {
        deal: {
          include: {
            merchant: {
              select: {
                id: true,
                name: true,
                logo: true,
                verified: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(savedDeal, { status: 201 })
  } catch (error) {
    console.error('Error saving deal:', error)
    return NextResponse.json(
      { error: 'Failed to save deal' },
      { status: 500 }
    )
  }
}