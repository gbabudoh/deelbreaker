import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaigns = await (prisma as any).promotedCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            merchant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching admin promotions:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      pricePaid,
      isPaidPromotion,
      isActive,
      dealId
    } = body

    if (!title || !description || !imageUrl || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const campaign = await (prisma as any).promotedCampaign.create({
      data: {
        title,
        description,
        imageUrl,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pricePaid: pricePaid ? parseFloat(pricePaid) : 0.0,
        isPaidPromotion: !!isPaidPromotion,
        isActive: isActive !== undefined ? !!isActive : true,
        createdByAdmin: true,
        dealId: dealId || null
      },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            merchant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error creating promotion campaign:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      pricePaid,
      isPaidPromotion,
      isActive,
      dealId
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing campaign ID' }, { status: 400 })
    }

    const updated = await (prisma as any).promotedCampaign.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        pricePaid: pricePaid !== undefined ? parseFloat(pricePaid) : undefined,
        isPaidPromotion: isPaidPromotion !== undefined ? !!isPaidPromotion : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
        dealId: dealId === undefined ? undefined : (dealId || null)
      },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            merchant: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating promotion campaign:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing campaign ID' }, { status: 400 })
    }

    await (prisma as any).promotedCampaign.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotion campaign:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
