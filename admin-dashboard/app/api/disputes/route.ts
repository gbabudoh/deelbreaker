import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (!session.user.permissions?.resolveDisputes && session.user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        order: {
          select: {
            orderNumber: true,
            totalPrice: true,
            paymentStatus: true,
            deal: {
              select: {
                title: true,
              }
            }
          }
        }
      }
    })
    return NextResponse.json(disputes)
  } catch (error) {
    console.error('Error fetching disputes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (!session.user.permissions?.resolveDisputes && session.user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status, resolution } = body

    if (!id) {
      return NextResponse.json({ error: 'Dispute ID is required' }, { status: 400 })
    }

    const updatedDispute = await prisma.dispute.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution !== undefined && { resolution }),
      }
    })

    return NextResponse.json(updatedDispute)
  } catch (error) {
    console.error('Error updating dispute:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
