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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        level: true,
        totalSavings: true,
        joinedAt: true
      },
      orderBy: { joinedAt: 'desc' },
      take: 100
    })

    // Add status field (would come from a separate status table in production)
    const usersWithStatus = users.map(u => ({
      ...u,
      status: 'active' as const
    }))

    return NextResponse.json({ users: usersWithStatus })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
