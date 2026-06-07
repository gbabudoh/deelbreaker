import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DealType, DealStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get('merchantId')

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 })
    }

    const deals = await prisma.deal.findMany({
      where: { merchantId },
      include: {
        _count: {
          select: {
            orders: true,
            views: true
          }
        },
        orders: {
          select: {
            amountPaid: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, deals })
  } catch (error: any) {
    console.error('Error fetching merchant deals:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      originalPrice,
      currentPrice,
      type,
      images,
      features,
      terms,
      duration,
      merchantId
    } = body

    if (!title || !description || !category || !originalPrice || !currentPrice || !type || !merchantId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    const endDate = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        category,
        originalPrice: parseFloat(originalPrice),
        currentPrice: parseFloat(currentPrice),
        discount,
        type: type as DealType,
        images: images || [],
        features: features || [],
        terms,
        endDate,
        merchantId,
        status: DealStatus.ACTIVE // Make deals active immediately for flash sales
      }
    })

    return NextResponse.json({ success: true, deal }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating merchant deal:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create deal' },
      { status: 500 }
    )
  }
}
