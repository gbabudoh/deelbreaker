import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'
import { processRefund } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const refundSchema = z.object({
  orderId: z.string(),
  amount: z.number().min(0).optional(),
  reason: z.enum(['requested_by_customer', 'duplicate', 'fraudulent']).optional()
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()
    const { orderId, amount, reason } = refundSchema.parse(body)

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, deal: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check authorization - user can only refund their own orders
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if order can be refunded
    if (order.paymentStatus !== 'PAID') {
      return NextResponse.json(
        { error: 'Order cannot be refunded' },
        { status: 400 }
      )
    }

    // Process refund with Stripe
    const refundResult = await processRefund(
      order.id,
      amount || order.totalPrice,
      reason || 'requested_by_customer'
    )

    if (!refundResult.success) {
      return NextResponse.json(
        { error: refundResult.error },
        { status: 400 }
      )
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'REFUNDED',
        paymentStatus: amount && amount < order.totalPrice ? 'PARTIALLY_REFUNDED' : 'REFUNDED'
      }
    })

    // If cashback was issued, reverse it
    if (order.cashbackAmount && order.cashbackStatus === 'APPROVED') {
      await prisma.cashback.updateMany({
        where: {
          userId: order.userId,
          source: order.id,
          status: 'APPROVED'
        },
        data: {
          status: 'CANCELLED'
        }
      })
    }

    return NextResponse.json({
      success: true,
      refundId: refundResult.refundId,
      amount: refundResult.amount,
      status: refundResult.status
    })
  } catch (error) {
    console.error('Error processing refund:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
