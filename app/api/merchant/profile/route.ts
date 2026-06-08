import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const merchant = await prisma.merchant.findUnique({
      where: { email: session.user.email },
      include: {
        _count: {
          select: {
            deals: true,
            orders: true
          }
        }
      }
    })

    if (!merchant) {
      return NextResponse.json({ notFound: true }, { status: 200 })
    }

    return NextResponse.json({ success: true, merchant })
  } catch (error: any) {
    console.error('Error fetching merchant profile:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, businessType, description, website, taxId, address, phone } = body

    if (!name) {
      return NextResponse.json({ error: 'Business Name is required' }, { status: 400 })
    }

    // Create or update merchant profile
    const merchant = await prisma.merchant.upsert({
      where: { email: session.user.email },
      update: {
        name,
        businessType,
        description,
        website,
        taxId,
        address,
        phone,
        onboardingComplete: true
      },
      create: {
        name,
        email: session.user.email,
        businessType,
        description,
        website,
        taxId,
        address,
        phone,
        commissionRate: 10.0, // Default 10% marketplace commission
        onboardingComplete: true
      }
    })

    return NextResponse.json({ success: true, merchant })
  } catch (error: any) {
    console.error('Error creating merchant profile:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
