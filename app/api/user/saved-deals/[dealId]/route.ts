import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
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

    const savedDeal = await prisma.savedDeal.findUnique({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId: resolvedParams.dealId
        }
      }
    })

    if (!savedDeal) {
      return NextResponse.json(
        { error: 'Saved deal not found' },
        { status: 404 }
      )
    }

    await prisma.savedDeal.delete({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId: resolvedParams.dealId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing saved deal:', error)
    return NextResponse.json(
      { error: 'Failed to remove saved deal' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
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
    const { priceAlert } = body

    const savedDeal = await prisma.savedDeal.update({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId: resolvedParams.dealId
        }
      },
      data: {
        priceAlert: priceAlert ?? false
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

    return NextResponse.json(savedDeal)
  } catch (error) {
    console.error('Error updating saved deal:', error)
    return NextResponse.json(
      { error: 'Failed to update saved deal' },
      { status: 500 }
    )
  }
}