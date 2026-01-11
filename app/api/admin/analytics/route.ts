import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || 'month'

    let startDate = new Date()
    if (range === 'week') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (range === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    } else if (range === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1)
    }

    const [
      totalRevenue,
      newUsers,
      newDeals,
      totalOrders
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { createdAt: { gte: startDate } }
      }),
      prisma.user.count({
        where: { joinedAt: { gte: startDate } }
      }),
      prisma.deal.count({
        where: { createdAt: { gte: startDate } }
      }),
      prisma.order.count({
        where: { createdAt: { gte: startDate } }
      })
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      newUsers,
      newDeals: newDeals,
      totalOrders,
      range
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
