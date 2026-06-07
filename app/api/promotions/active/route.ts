import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')

    const campaigns = await (prisma as any).promotedCampaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            originalPrice: true,
            currentPrice: true,
            discount: true,
            type: true,
            endDate: true,
            category: true,
            targetCountries: true,
            merchant: {
              select: {
                name: true
              }
            },
            _count: {
              select: {
                orders: true
              }
            }
          }
        }
      }
    })

    let activeCampaign = campaigns[0] || null;

    if (country && campaigns.length > 0) {
      activeCampaign = campaigns.find((c: any) => {
        if (!c.deal) return true; // platform-wide
        if (!c.deal.targetCountries || c.deal.targetCountries.length === 0) return true; // global
        return c.deal.targetCountries.includes(country);
      }) || null;
    }

    return NextResponse.json({ success: true, campaign: activeCampaign })
  } catch (error) {
    console.error('Error fetching active promotion:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
