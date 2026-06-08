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

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
            deal: {
              select: {
                originalPrice: true,
                currentPrice: true
              }
            }
          }
        }
      }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Dynamic calculations
    const dealsJoined = dbUser.orders.length
    const groupBuysCompleted = dbUser.orders.filter(
      order => ['DELIVERED', 'REDEEMED', 'SHIPPED', 'SHIPPED_LATE'].includes(order.status)
    ).length
    


    const level = 'Consumer Account'
    const progress = 0

    // Format memberSince
    const memberSince = new Date(dbUser.joinedAt).toLocaleString('default', { month: 'long', year: 'numeric' })

    return NextResponse.json({
      success: true,
      profile: {
        name: dbUser.name || 'User',
        email: dbUser.email,
        avatar: dbUser.avatar || null,
        memberSince,
        totalSavings: dbUser.totalSavings,
        dealsJoined,
        groupBuysCompleted,
        level,
        nextLevelProgress: progress,
        onboardingComplete: (dbUser as any).onboardingComplete,
        role: (dbUser as any).role
      }
    })
  } catch (error) {
    console.error('Error fetching user profile stats:', error)
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
    const { onboardingComplete, role } = body

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(onboardingComplete !== undefined && { onboardingComplete }),
        ...(role !== undefined && { role })
      }
    })

    return NextResponse.json({
      success: true,
      profile: {
        onboardingComplete: (updatedUser as any).onboardingComplete,
        role: (updatedUser as any).role
      }
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
