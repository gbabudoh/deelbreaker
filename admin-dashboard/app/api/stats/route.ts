import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalUsers = await prisma.user.count()
    const activeDeals = await prisma.deal.count({ where: { status: 'ACTIVE' } })
    const totalOrders = await prisma.order.count()
    
    const revenueSum = await prisma.order.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        paymentStatus: 'PAID'
      }
    })

    const pendingDeals = await prisma.deal.count({
      where: {
        verified: false
      }
    })

    const activeDisputes = await prisma.dispute.count({
      where: {
        status: {
          in: ['PENDING', 'INVESTIGATING']
        }
      }
    })

    // Fetch the 5 most recent orders for dashboard feed
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        orderDate: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        deal: {
          select: {
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeDeals,
        totalOrders,
        totalRevenue: revenueSum._sum.totalPrice || 0,
        pendingDeals,
        activeDisputes
      },
      recentOrders
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
