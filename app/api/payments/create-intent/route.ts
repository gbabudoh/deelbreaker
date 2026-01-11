import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'
import { createPaymentIntent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createIntentSchema = z.object({
  dealId: z.string(),
  quantity: z.number().min(1),
  type: z.enum(['instant', 'group_buy'])
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return createUnauthorizedResponse()
    }

    const body = await request.json()
    const { dealId, quantity, type } = createIntentSchema.parse(body)

    // Get deal details
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { merchant: true }
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    // Calculate total amount
    const totalAmount = deal.currentPrice * quantity
    const discount = deal.discount || 0
    const discountAmount = (totalAmount * discount) / 100
    const finalAmount = totalAmount - discountAmount

    // Create payment intent
    const paymentResult = await createPaymentIntent(
      finalAmount,
      'usd',
      {
        dealId,
        userId: user.id,
        merchantId: deal.merchant.id,
        quantity: quantity.toString(),
        type,
        discount: discount.toString()
      }
    )

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 400 }
      )
    }

    // Create pending order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: user.id,
        dealId,
        merchantId: deal.merchant.id,
        quantity,
        unitPrice: deal.currentPrice,
        totalPrice: finalAmount,
        discount: discountAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    })

    return NextResponse.json({
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      orderId: order.id,
      amount: finalAmount,
      currency: 'usd'
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
