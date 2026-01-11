import { prisma } from './prisma'

interface UserPreferences {
  favoriteCategories: string[]
  priceRange: { min: number; max: number }
  brands: string[]
  discountThreshold: number
}

interface RecommendationScore {
  dealId: string
  score: number
  reasons: string[]
}

/**
 * Calculate user preferences based on their activity
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences> {
  const userOrders = await prisma.order.findMany({
    where: { userId },
    include: { deal: true },
    take: 50
  })

  const userSavedDeals = await prisma.savedDeal.findMany({
    where: { userId },
    include: { deal: true },
    take: 50
  })

  const allDeals = [
    ...userOrders.map((o: any) => o.deal),
    ...userSavedDeals.map((s: any) => s.deal)
  ]

  // Extract categories
  const categories = allDeals.map((d: any) => d.category)
  const categoryFreq = categories.reduce((acc: Record<string, number>, cat: string) => {
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const favoriteCategories = Object.entries(categoryFreq)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([cat]) => cat)

  // Calculate average price range
  const prices = allDeals.map((d: any) => d.currentPrice).filter((p: number) => p > 0)
  const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b) / prices.length : 50
  const priceRange = {
    min: Math.max(0, avgPrice * 0.5),
    max: avgPrice * 2
  }

  // Calculate average discount threshold
  const discounts = allDeals.map((d: any) => d.discount).filter((d: number) => d > 0)
  const discountThreshold = discounts.length > 0 
    ? discounts.reduce((a: number, b: number) => a + b) / discounts.length 
    : 15

  return {
    favoriteCategories: favoriteCategories.length > 0 ? favoriteCategories : ['Electronics', 'Fashion'],
    priceRange,
    brands: [],
    discountThreshold
  }
}

/**
 * Get personalized deal recommendations for a user
 */
export async function getPersonalizedRecommendations(
  userId: string,
  limit: number = 10
): Promise<RecommendationScore[]> {
  const preferences = await getUserPreferences(userId)

  // Get all active deals
  const deals = await prisma.deal.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gt: new Date()
      }
    },
    include: {
      merchant: true,
      _count: {
        select: {
          reviews: true,
          groupBuys: true
        }
      }
    }
  })

  // Score each deal
  const scoredDeals: RecommendationScore[] = deals
    .map((deal: any) => {
      let score = 0
      const reasons: string[] = []

      // Category match (40 points max)
      if (preferences.favoriteCategories.includes(deal.category)) {
        score += 40
        reasons.push(`Matches your favorite category: ${deal.category}`)
      }

      // Price range match (30 points max)
      if (deal.currentPrice >= preferences.priceRange.min && 
          deal.currentPrice <= preferences.priceRange.max) {
        score += 30
        reasons.push(`Within your preferred price range`)
      }

      // Discount threshold (20 points max)
      if (deal.discount >= preferences.discountThreshold) {
        score += 20
        reasons.push(`Great discount: ${deal.discount}% off`)
      }

      // Popularity (10 points max)
      const popularity = (deal._count.reviews + deal._count.groupBuys) / 10
      score += Math.min(10, popularity)
      if (deal._count.reviews > 0) {
        reasons.push(`Popular with ${deal._count.reviews} reviews`)
      }

      // Merchant rating (5 points max)
      if (deal.merchant.avgRating >= 4.5) {
        score += 5
        reasons.push(`Trusted merchant (${deal.merchant.avgRating}★)`)
      }

      return {
        dealId: deal.id,
        score,
        reasons
      }
    })
    .sort((a: RecommendationScore, b: RecommendationScore) => b.score - a.score)
    .slice(0, limit)

  return scoredDeals
}

/**
 * Get trending deals based on recent activity
 */
export async function getTrendingDeals(limit: number = 10) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const deals = await prisma.deal.findMany({
    where: {
      status: 'ACTIVE',
      createdAt: {
        gte: sevenDaysAgo
      }
    },
    include: {
      merchant: true,
      _count: {
        select: {
          groupBuys: true,
          orders: true,
          savedBy: true
        }
      }
    },
    orderBy: {
      currentParticipants: 'desc'
    },
    take: limit
  })

  return deals.map((deal: any) => ({
    ...deal,
    trendScore: deal._count.groupBuys + deal._count.orders + deal._count.savedBy
  }))
}

/**
 * Get deals similar to a specific deal
 */
export async function getSimilarDeals(dealId: string, limit: number = 5) {
  const targetDeal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { merchant: true }
  })

  if (!targetDeal) return []

  const similarDeals = await prisma.deal.findMany({
    where: {
      AND: [
        { id: { not: dealId } },
        { category: targetDeal.category },
        { status: 'ACTIVE' },
        { endDate: { gt: new Date() } }
      ]
    },
    include: { merchant: true },
    take: limit
  })

  return similarDeals
}

/**
 * Get deals based on user's search history and browsing patterns
 */
export async function getContextualRecommendations(
  userId: string,
  recentSearches: string[] = [],
  limit: number = 10
) {
  const deals = await prisma.deal.findMany({
    where: {
      status: 'ACTIVE',
      endDate: { gt: new Date() },
      OR: recentSearches.length > 0 ? recentSearches.map(search => ({
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      })) : undefined
    },
    include: { merchant: true },
    take: limit
  })

  return deals
}

/**
 * Get deals expiring soon (urgency-based recommendations)
 */
export async function getExpiringDeals(hoursUntilExpiry: number = 24, limit: number = 10) {
  const now = new Date()
  const expiryTime = new Date(now.getTime() + hoursUntilExpiry * 60 * 60 * 1000)

  const deals = await prisma.deal.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gte: now,
        lte: expiryTime
      }
    },
    include: { merchant: true },
    orderBy: { endDate: 'asc' },
    take: limit
  })

  return deals.map((deal: any) => ({
    ...deal,
    hoursRemaining: Math.ceil((deal.endDate!.getTime() - now.getTime()) / (60 * 60 * 1000))
  }))
}
