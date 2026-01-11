import { NextRequest, NextResponse } from 'next/server'
import { getDealMetrics } from '@/lib/analytics'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return createUnauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    if (!dealId) {
      return NextResponse.json(
        { error: 'dealId is required' },
        { status: 400 }
      )
    }

    const metrics = await getDealMetrics(dealId)

    if (!metrics) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error getting deal metrics:', error)
    return NextResponse.json(
      { error: 'Failed to get deal metrics' },
      { status: 500 }
    )
  }
}
