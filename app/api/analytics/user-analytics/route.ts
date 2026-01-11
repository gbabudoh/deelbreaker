import { NextRequest, NextResponse } from 'next/server'
import { getUserAnalytics } from '@/lib/analytics'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return createUnauthorizedResponse()
    }

    const analytics = await getUserAnalytics(user.id)

    if (!analytics) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error getting user analytics:', error)
    return NextResponse.json(
      { error: 'Failed to get user analytics' },
      { status: 500 }
    )
  }
}
