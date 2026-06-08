import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession()

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [
      totalUsers,
      totalMerchants,
      totalDeals,
      activeDeals,
      totalOrders,
      flaggedDeals,
      totalRevenue
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.deal.count(),
      prisma.deal.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.deal.count({ where: { status: 'DRAFT' } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true }
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalMerchants,
      totalDeals,
      activeDeals,
      totalOrders,
      flaggedDeals,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
