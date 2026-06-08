import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (!session.user.permissions?.manageDeals && session.user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const verified = searchParams.get('verified')

  const where: any = {}
  if (status) where.status = status
  if (verified) where.verified = verified === 'true'

  try {
    const deals = await prisma.deal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        merchant: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (!session.user.permissions?.manageDeals && session.user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status, verified, featured, trending } = body

    if (!id) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 })
    }

    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(verified !== undefined && { verified }),
        ...(featured !== undefined && { featured }),
        ...(trending !== undefined && { trending }),
      }
    })

    return NextResponse.json(updatedDeal)
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
