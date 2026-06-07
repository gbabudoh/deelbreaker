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
        },
        cashbacks: {
          select: {
            amount: true,
            status: true
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
    
    // Sum up approved/paid cashback balance
    const cashbackBalance = dbUser.cashbacks
      .filter(c => c.status === 'APPROVED' || c.status === 'PAID')
      .reduce((sum, c) => sum + c.amount, 0)

    // Calculate level progress
    // Bronze: 0-5 orders, Silver: 6-15 orders, Gold: 16-30 orders, Platinum: 30+ orders
    let level = dbUser.level || 'Bronze'
    let progress = 0
    
    if (dealsJoined <= 5) {
      level = 'Bronze Member'
      progress = Math.min(Math.round((dealsJoined / 5) * 100), 100)
    } else if (dealsJoined <= 15) {
      level = 'Silver Member'
      progress = Math.min(Math.round(((dealsJoined - 5) / 10) * 100), 100)
    } else if (dealsJoined <= 30) {
      level = 'Gold Member'
      progress = Math.min(Math.round(((dealsJoined - 15) / 15) * 100), 100)
    } else {
      level = 'Platinum Member'
      progress = 100
    }

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
        cashbackBalance,
        dealsJoined,
        groupBuysCompleted,
        level,
        nextLevelProgress: progress
      }
    })
  } catch (error) {
    console.error('Error fetching user profile stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
