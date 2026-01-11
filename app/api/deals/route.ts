import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DealType, DealStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const type = searchParams.get('type') as DealType | null
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDiscount = searchParams.get('minDiscount')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: DealStatus.ACTIVE,
      startDate: { lte: new Date() },
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { merchant: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (minPrice || maxPrice) {
      where.currentPrice = {}
      if (minPrice) where.currentPrice.gte = parseFloat(minPrice)
      if (maxPrice) where.currentPrice.lte = parseFloat(maxPrice)
    }

    if (minDiscount) {
      where.discount = { gte: parseFloat(minDiscount) }
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'price':
        orderBy = { currentPrice: sortOrder }
        break
      case 'discount':
        orderBy = { discount: sortOrder }
        break
      case 'ending':
        orderBy = { endDate: 'asc' }
        break
      default:
        orderBy = { [sortBy]: sortOrder }
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        include: {
          merchant: {
            select: {
              id: true,
              name: true,
              logo: true,
              verified: true,
              avgRating: true
            }
          },
          _count: {
            select: {
              groupBuys: true,
              reviews: true,
              savedBy: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.deal.count({ where })
    ])

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      originalPrice,
      currentPrice,
      type,
      targetParticipants,
      cashbackAmount,
      cashbackPercentage,
      images,
      features,
      terms,
      duration,
      merchantId
    } = body

    // Validate required fields
    if (!title || !description || !category || !originalPrice || !currentPrice || !type || !merchantId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate discount
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)

    // Set end date based on duration
    const endDate = duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : null

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        category,
        originalPrice: parseFloat(originalPrice),
        currentPrice: parseFloat(currentPrice),
        discount,
        type: type as DealType,
        targetParticipants: type === 'GROUP_BUY' ? parseInt(targetParticipants) : null,
        cashbackAmount: type === 'INSTANT' ? parseFloat(cashbackAmount || '0') : null,
        cashbackPercentage: type === 'INSTANT' ? parseFloat(cashbackPercentage || '0') : null,
        images: images || [],
        features: features || [],
        terms,
        endDate,
        merchantId,
        status: DealStatus.DRAFT
      },
      include: {
        merchant: true
      }
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}