import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    // Fallback for mock deals to support prototyping
    if (id === '1' || id === '2' || id === '3') {
      const mockDeals: Record<string, any> = {
        '1': {
          id: '1',
          title: 'iPhone 15 Pro Max 256GB',
          category: 'Electronics',
          originalPrice: 1199.00,
          currentPrice: 999.00,
          type: 'PHYSICAL_PRODUCT',
          images: ['/api/placeholder/600/400'],
          merchant: { name: 'TechWorld Electronics' },
          targetCountries: ['US', 'CA']
        },
        '2': {
          id: '2',
          title: 'Nike Air Max 270',
          category: 'Fashion',
          originalPrice: 150.00,
          currentPrice: 89.00,
          type: 'PHYSICAL_PRODUCT',
          images: ['/api/placeholder/600/400'],
          merchant: { name: 'SportZone' },
          targetCountries: [] // Global
        },
        '3': {
          id: '3',
          title: 'Deep Tissue Massage Package',
          category: 'Beauty & Spa',
          originalPrice: 150.00,
          currentPrice: 90.00,
          type: 'LOCAL_SERVICE',
          images: ['/api/placeholder/600/400'],
          merchant: { name: 'SpaRetreat' },
          targetCountries: ['GB']
        }
      }
      return NextResponse.json(mockDeals[id])
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        merchant: {
          select: {
            id: true,
            name: true,
            logo: true,
            verified: true,
            avgRating: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        priceHistory: {
          orderBy: { timestamp: 'asc' }
        },
        _count: {
          select: {
            reviews: true,
            savedBy: true,
            orders: true
          }
        }
      }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, ...updateData } = body

    // Verify merchant ownership
    const existingDeal = await prisma.deal.findUnique({
      where: { id: resolvedParams.id },
      include: { merchant: true }
    })

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Update deal
    const deal = await prisma.deal.update({
      where: { id: resolvedParams.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        merchant: true
      }
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify merchant ownership
    const existingDeal = await prisma.deal.findUnique({
      where: { id: resolvedParams.id },
      include: { merchant: true }
    })

    if (!existingDeal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    await prisma.deal.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}