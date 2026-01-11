import { prisma } from './prisma'

export interface AnalyticsEvent {
  userId?: string
  eventType: string
  eventData: Record<string, any>
  timestamp?: Date
  sessionId?: string
  userAgent?: string
  ipAddress?: string
}

/**
 * Track user behavior events
 */
export async function trackEvent(event: AnalyticsEvent) {
  try {
    // Store event in database or external service
    console.log('Event tracked:', {
      type: event.eventType,
      userId: event.userId,
      timestamp: event.timestamp || new Date()
    })

    // You can extend this to store in a separate analytics table
    // or send to external services like PostHog, Mixpanel, etc.
    return { success: true }
  } catch (error) {
    console.error('Error tracking event:', error)
    return { success: false, error }
  }
}

/**
 * Track deal view
 */
export async function trackDealView(userId: string | undefined, dealId: string) {
  return trackEvent({
    userId,
    eventType: 'deal_view',
    eventData: { dealId },
    timestamp: new Date()
  })
}

/**
 * Track deal click
 */
export async function trackDealClick(userId: string | undefined, dealId: string) {
  return trackEvent({
    userId,
    eventType: 'deal_click',
    eventData: { dealId },
    timestamp: new Date()
  })
}

/**
 * Track deal save
 */
export async function trackDealSave(userId: string, dealId: string) {
  return trackEvent({
    userId,
    eventType: 'deal_save',
    eventData: { dealId },
    timestamp: new Date()
  })
}

/**
 * Track deal purchase
 */
export async function trackDealPurchase(userId: string, dealId: string, amount: number) {
  return trackEvent({
    userId,
    eventType: 'deal_purchase',
    eventData: { dealId, amount },
    timestamp: new Date()
  })
}

/**
 * Track group buy join
 */
export async function trackGroupBuyJoin(userId: string, dealId: string) {
  return trackEvent({
    userId,
    eventType: 'group_buy_join',
    eventData: { dealId },
    timestamp: new Date()
  })
}

/**
 * Track search query
 */
export async function trackSearch(userId: string | undefined, query: string, resultsCount: number) {
  return trackEvent({
    userId,
    eventType: 'search',
    eventData: { query, resultsCount },
    timestamp: new Date()
  })
}

/**
 * Track filter usage
 */
export async function trackFilterUsage(userId: string | undefined, filters: Record<string, any>) {
  return trackEvent({
    userId,
    eventType: 'filter_usage',
    eventData: { filters },
    timestamp: new Date()
  })
}

/**
 * Track review submission
 */
export async function trackReviewSubmission(userId: string, dealId: string, rating: number) {
  return trackEvent({
    userId,
    eventType: 'review_submission',
    eventData: { dealId, rating },
    timestamp: new Date()
  })
}

/**
 * Track page view
 */
export async function trackPageView(userId: string | undefined, page: string) {
  return trackEvent({
    userId,
    eventType: 'page_view',
    eventData: { page },
    timestamp: new Date()
  })
}

/**
 * Get deal performance metrics
 */
export async function getDealMetrics(dealId: string) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        orders: true,
        reviews: true,
        savedBy: true,
        groupBuys: true
      }
    })

    if (!deal) {
      return null
    }

    const totalRevenue = deal.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)
    const avgRating = deal.reviews.length > 0
      ? deal.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / deal.reviews.length
      : 0

    return {
      dealId,
      title: deal.title,
      views: 0, // Would need separate tracking table
      clicks: 0,
      saves: deal.savedBy.length,
      purchases: deal.orders.length,
      totalRevenue,
      avgRating,
      reviewCount: deal.reviews.length,
      groupBuyParticipants: deal.groupBuys.length,
      conversionRate: deal.orders.length > 0 ? (deal.orders.length / (deal.savedBy.length || 1)) * 100 : 0
    }
  } catch (error) {
    console.error('Error getting deal metrics:', error)
    return null
  }
}

/**
 * Get user analytics
 */
export async function getUserAnalytics(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: true,
        savedDeals: true,
        groupBuys: true,
        cashbacks: true,
        reviews: true
      }
    })

    if (!user) {
      return null
    }

    const totalSpent = user.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)
    const totalCashback = user.cashbacks
      .filter((cb: any) => cb.status === 'PAID')
      .reduce((sum: number, cb: any) => sum + cb.amount, 0)

    return {
      userId,
      name: user.name,
      email: user.email,
      totalOrders: user.orders.length,
      totalSpent,
      totalCashback,
      savedDeals: user.savedDeals.length,
      groupBuysJoined: user.groupBuys.length,
      reviewsSubmitted: user.reviews.length,
      level: user.level,
      totalSavings: user.totalSavings,
      joinedAt: user.joinedAt
    }
  } catch (error) {
    console.error('Error getting user analytics:', error)
    return null
  }
}

/**
 * Get platform analytics
 */
export async function getPlatformAnalytics() {
  try {
    const [users, merchants, deals, orders, cashbacks] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.deal.count(),
      prisma.order.count(),
      prisma.cashback.aggregate({
        _sum: { amount: true }
      })
    ])

    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    })

    const totalCashbackPaid = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' }
    })

    return {
      totalUsers: users,
      totalMerchants: merchants,
      totalDeals: deals,
      totalOrders: orders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalCashbackIssued: cashbacks._sum.amount || 0,
      totalCashbackPaid: totalCashbackPaid._sum.amount || 0,
      avgOrderValue: orders > 0 ? (totalRevenue._sum.totalPrice || 0) / orders : 0
    }
  } catch (error) {
    console.error('Error getting platform analytics:', error)
    return null
  }
}
