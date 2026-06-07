'use server'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

interface FulfillmentInput {
  orderId: string
  merchantId: string
  trackingNumber: string
  trackingCarrier: string
}

export async function fulfillPhysicalOrder(input: FulfillmentInput) {
  const { orderId, merchantId, trackingNumber, trackingCarrier } = input

  try {
    // 1. Fetch order and verify merchant relationship
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { deal: true }
    })

    if (!order) {
      return { success: false, error: 'Order not found.' }
    }

    if (order.merchantId !== merchantId) {
      return { success: false, error: 'Unauthorized action for this merchant.' }
    }

    if (order.status !== 'PENDING_SHIPMENT') {
      return { success: false, error: 'Order is already shipped or redeemed.' }
    }

    // 2. Check if the shipment is late
    const now = new Date()
    const isLate = order.deadlineDate ? now > order.deadlineDate : false

    // 3. Retrieve merchant's Stripe Connect credentials
    const merchantAccount = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { stripeConnectId: true, commissionRate: true }
    })

    if (!merchantAccount || !merchantAccount.stripeConnectId) {
      return { success: false, error: 'Merchant Stripe Connect account not linked.' }
    }

    // 4. Update database order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: isLate ? 'SHIPPED_LATE' : 'SHIPPED',
        trackingNumber,
        trackingCarrier,
        shippedAt: now,
        shippedDate: now
      }
    })

    // 5. Transfer split payout (90% merchant, 10% platform commission)
    const baseRate = merchantAccount.commissionRate || 10.0
    const platformFeePercent = baseRate / 100
    const totalCents = Math.round(order.amountPaid * 100)
    const platformCutCents = Math.round(totalCents * platformFeePercent)
    const merchantPayoutCents = totalCents - platformCutCents

    const transfer = await stripe.transfers.create({
      amount: merchantPayoutCents,
      currency: 'usd',
      destination: merchantAccount.stripeConnectId,
      transfer_group: `ORDER_${orderId}`,
      metadata: {
        orderId,
        isLateFulfillment: isLate ? 'true' : 'false'
      }
    })

    return {
      success: true,
      status: updatedOrder.status,
      transferId: transfer.id,
      message: isLate
        ? 'Order marked as shipped late. Payout processed successfully.'
        : 'Order successfully shipped on time. Payout processed.'
    }
  } catch (error: any) {
    console.error('Fulfillment error:', error)
    return { success: false, error: error.message || 'Internal Server Error.' }
  }
}

export async function redeemServiceVoucher(voucherCode: string, merchantId: string) {
  try {
    const cleanVoucher = voucherCode.trim().toUpperCase()

    // 1. Fetch order
    const order = await prisma.order.findUnique({
      where: { voucherCode: cleanVoucher },
      include: { deal: true }
    })

    if (!order) {
      return { success: false, error: 'Voucher not found.' }
    }

    if (order.merchantId !== merchantId) {
      return { success: false, error: 'Voucher does not belong to this merchant.' }
    }

    if (order.status !== 'PENDING_REDEMPTION') {
      return { success: false, error: 'Voucher has already been redeemed or cancelled.' }
    }

    // 2. Retrieve merchant's Stripe Connect credentials
    const merchantAccount = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { stripeConnectId: true, commissionRate: true }
    })

    if (!merchantAccount || !merchantAccount.stripeConnectId) {
      return { success: false, error: 'Merchant Stripe Connect account not linked.' }
    }

    const now = new Date()

    // 3. Mark the voucher order as REDEEMED
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'REDEEMED',
        deliveredDate: now
      }
    })

    // 4. Transfer split payout (90% merchant, 10% platform commission)
    const baseRate = merchantAccount.commissionRate || 10.0
    const platformFeePercent = baseRate / 100
    const totalCents = Math.round(order.amountPaid * 100)
    const platformCutCents = Math.round(totalCents * platformFeePercent)
    const merchantPayoutCents = totalCents - platformCutCents

    const transfer = await stripe.transfers.create({
      amount: merchantPayoutCents,
      currency: 'usd',
      destination: merchantAccount.stripeConnectId,
      transfer_group: `ORDER_${order.id}`,
      metadata: {
        orderId: order.id,
        voucherCode: cleanVoucher
      }
    })

    return {
      success: true,
      status: updatedOrder.status,
      transferId: transfer.id,
      message: 'Voucher successfully redeemed. Payout split processed.'
    }
  } catch (error: any) {
    console.error('Voucher redemption error:', error)
    return { success: false, error: error.message || 'Internal Server Error.' }
  }
}

export async function trackDealView(dealId: string, ip: string | null, countryCode?: string | null) {
  try {
    await prisma.dealView.create({
      data: {
        dealId,
        ipAddress: ip
      }
    })

    await prisma.analyticsEvent.create({
      data: {
        dealId,
        eventType: 'VIEW',
        ipAddress: ip,
        country: countryCode || 'Global'
      }
    })

    return { success: true }
  } catch (err) {
    console.error('View log failed silently to protect user experience:', err)
    return { success: false }
  }
}

export async function getMerchantAnalytics(merchantId: string) {
  try {
    // Run parallel high-speed aggregations
    const [salesAggregate, totalOrders, totalViews, dealsList] = await Promise.all([
      // 1. Gross Revenue
      prisma.order.aggregate({
        where: {
          merchantId,
          status: { in: ['SHIPPED', 'SHIPPED_LATE', 'DELIVERED', 'REDEEMED'] }
        },
        _sum: { amountPaid: true }
      }),
      // 2. Total Orders
      prisma.order.count({
        where: { merchantId }
      }),
      // 3. Total Views (from DealView index)
      prisma.dealView.count({
        where: { deal: { merchantId } }
      }),
      // 4. Deals list to show on chart / categories
      prisma.deal.findMany({
        where: { merchantId },
        select: {
          id: true,
          title: true,
          category: true,
          orders: {
            select: { amountPaid: true, status: true }
          },
          _count: {
            select: { views: true, orders: true }
          }
        }
      })
    ])

    const grossVolume = salesAggregate._sum.amountPaid || 0
    const viewsCount = totalViews || 0
    const conversionRate = viewsCount > 0 ? (totalOrders / viewsCount) * 100 : 0

    // Compute top categories performance dynamically
    const categoryPerformance: Record<string, { revenue: number; orders: number }> = {}
    dealsList.forEach(deal => {
      const category = deal.category || 'Other'
      const dealRevenue = deal.orders
        .filter(o => ['SHIPPED', 'SHIPPED_LATE', 'DELIVERED', 'REDEEMED'].includes(o.status))
        .reduce((sum, o) => sum + o.amountPaid, 0)

      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { revenue: 0, orders: 0 }
      }
      categoryPerformance[category].revenue += dealRevenue
      categoryPerformance[category].orders += deal._count.orders
    })

    const topCategories = Object.entries(categoryPerformance).map(([name, stats]) => {
      const percentage = grossVolume > 0 ? Math.round((stats.revenue / grossVolume) * 100) : 0
      return {
        name,
        revenue: stats.revenue,
        percentage
      }
    }).sort((a, b) => b.revenue - a.revenue)

    // Fetch 5 recent orders / redemptions to show
    const recentActivityOrders = await prisma.order.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { deal: true, user: true }
    })

    const recentActivity = recentActivityOrders.map(order => {
      let type = 'sale'
      let description = `${order.user.name || 'A customer'} purchased "${order.deal.title}"`
      let amount = `+$${order.amountPaid.toFixed(2)}`

      if (order.status === 'REDEEMED') {
        type = 'complete'
        description = `Voucher redeemed for "${order.deal.title}"`
      } else if (order.status === 'SHIPPED' || order.status === 'SHIPPED_LATE') {
        type = 'shipped'
        description = `Order shipped: "${order.deal.title}"`
      }

      return {
        type,
        description,
        amount,
        time: getRelativeTimeString(order.createdAt)
      }
    })

    return {
      success: true,
      analytics: {
        grossVolume,
        totalOrders,
        totalViews: viewsCount,
        conversionRate,
        topCategories,
        recentActivity
      }
    }
  } catch (error: any) {
    console.error('Analytics extraction failed:', error)
    return { success: false, error: error.message || 'Failed to retrieve analytics.' }
  }
}

export async function trackAnalyticsEvent(
  dealId: string,
  eventType: string,
  userId?: string | null,
  country?: string | null,
  ipAddress?: string | null
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        dealId,
        eventType: eventType.toUpperCase(),
        userId: userId || null,
        country: country || null,
        ipAddress: ipAddress || null
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Error logging analytics event:', error)
    return { success: false }
  }
}

export async function getDemandBoxData(merchantId: string) {
  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get merchant's deals
    const merchantDeals = await prisma.deal.findMany({
      where: { merchantId },
      select: {
        id: true,
        title: true,
        category: true,
        type: true
      }
    })

    const dealIds = merchantDeals.map(d => d.id)

    // Gather events
    const events = await prisma.analyticsEvent.findMany({
      where: {
        dealId: { in: dealIds },
        createdAt: { gte: sevenDaysAgo }
      }
    })

    // Compute metrics per deal
    const dealMetrics = merchantDeals.map(deal => {
      const dealEvents = events.filter(e => e.dealId === deal.id)
      
      const views = dealEvents.filter(e => e.eventType === 'VIEW').length
      const saves = dealEvents.filter(e => e.eventType === 'SAVE').length
      const checkouts = dealEvents.filter(e => e.eventType === 'CHECKOUT_START').length
      const purchases = dealEvents.filter(e => e.eventType === 'PURCHASE').length

      // Demand Velocity Index formula:
      // Demand Index = (Views * 1) + (Saves * 3) + (Checkouts * 5) + (Purchases * 10)
      const demandIndex = (views * 1) + (saves * 3) + (checkouts * 5) + (purchases * 10)

      // Supply restocking advice
      let recommendation = 'Low activity. Consider running a flash promo.'
      if (demandIndex > 75) {
        recommendation = 'Critical Velocity! Restock/expand capacity immediately to prevent stockouts.'
      } else if (demandIndex > 30) {
        recommendation = 'Healthy Demand. Maintain regular stock levels.'
      } else if (deal.type === 'LOCAL_SERVICE') {
        recommendation = 'Moderate service demand. Ensure booking availability is open.'
      }

      return {
        id: deal.id,
        title: deal.title,
        category: deal.category,
        type: deal.type,
        views,
        saves,
        checkouts,
        purchases,
        demandIndex,
        recommendation
      }
    })

    // Compute Overall Traffic Geography breakdown
    const geoBreakdown: Record<string, number> = {}
    let totalGeoEvents = 0
    events.forEach(e => {
      if (e.eventType === 'VIEW') {
        const country = e.country || 'Global'
        geoBreakdown[country] = (geoBreakdown[country] || 0) + 1
        totalGeoEvents++
      }
    })

    const trafficGeography = Object.entries(geoBreakdown).map(([country, count]) => ({
      country,
      count,
      percentage: totalGeoEvents > 0 ? Math.round((count / totalGeoEvents) * 100) : 0
    })).sort((a, b) => b.count - a.count)

    // Compute Overall Conversion Funnel
    const totalViews = events.filter(e => e.eventType === 'VIEW').length
    const totalSaves = events.filter(e => e.eventType === 'SAVE').length
    const totalCheckouts = events.filter(e => e.eventType === 'CHECKOUT_START').length
    const totalPurchases = events.filter(e => e.eventType === 'PURCHASE').length

    const conversionFunnel = {
      views: totalViews,
      saves: totalSaves,
      checkouts: totalCheckouts,
      purchases: totalPurchases,
      rates: {
        checkoutRate: totalViews > 0 ? parseFloat(((totalCheckouts / totalViews) * 100).toFixed(1)) : 0,
        purchaseRate: totalViews > 0 ? parseFloat(((totalPurchases / totalViews) * 100).toFixed(1)) : 0,
        saveRate: totalViews > 0 ? parseFloat(((totalSaves / totalViews) * 100).toFixed(1)) : 0
      }
    }

    // Calculate aggregated merchant demand score
    const totalDemandIndex = dealMetrics.reduce((sum, d) => sum + d.demandIndex, 0)

    return {
      success: true,
      demandBox: {
        totalDemandIndex,
        dealMetrics,
        trafficGeography,
        conversionFunnel
      }
    }
  } catch (error: any) {
    console.error('Error computing demandBOX details:', error)
    return { success: false, error: error.message || 'Failed to compute demand analytics.' }
  }
}

function getRelativeTimeString(date: Date): string {
  const delta = Math.round((new Date().getTime() - date.getTime()) / 1000)
  const minute = 60
  const hour = 3600
  const day = 86400

  if (delta < 30) {
    return 'Just now'
  } else if (delta < minute) {
    return `${delta} seconds ago`
  } else if (delta < 2 * minute) {
    return 'a minute ago'
  } else if (delta < hour) {
    return `${Math.floor(delta / minute)} minutes ago`
  } else if (delta < 2 * hour) {
    return 'an hour ago'
  } else if (delta < day) {
    return `${Math.floor(delta / hour)} hours ago`
  } else {
    return `${Math.floor(delta / day)} days ago`
  }
}
