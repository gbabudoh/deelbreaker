import { NextRequest, NextResponse } from 'next/server'
import { stripe, verifyWebhookSignature, handleWebhookEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendCashbackNotificationEmail } from '@/lib/email'
import Stripe from 'stripe'

interface WebhookLog {
  eventId: string
  eventType: string
  status: 'success' | 'failed' | 'pending'
  error?: string
  timestamp: Date
  retryCount: number
}

const webhookLogs: Map<string, WebhookLog> = new Map()

async function logWebhookEvent(
  eventId: string,
  eventType: string,
  status: 'success' | 'failed' | 'pending',
  error?: string
) {
  const log: WebhookLog = {
    eventId,
    eventType,
    status,
    error,
    timestamp: new Date(),
    retryCount: webhookLogs.get(eventId)?.retryCount || 0
  }

  webhookLogs.set(eventId, log)
  console.log(`[Webhook] ${eventType} - ${status}`, log)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, dealId, quantity, discount } = paymentIntent.metadata || {}

    if (!userId || !dealId) {
      throw new Error('Missing metadata: userId or dealId')
    }

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        userId,
        dealId,
        paymentStatus: 'PENDING'
      },
      include: { user: true, deal: true }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    })

    // Create cashback record if applicable
    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    })

    if (deal?.cashbackAmount) {
      const cashback = await prisma.cashback.create({
        data: {
          userId,
          amount: deal.cashbackAmount,
          source: order.id,
          type: 'ORDER',
          status: 'APPROVED'
        }
      })

      // Update order with cashback
      await prisma.order.update({
        where: { id: order.id },
        data: {
          cashbackAmount: deal.cashbackAmount,
          cashbackStatus: 'APPROVED'
        }
      })

      // Send cashback notification
      await sendCashbackNotificationEmail(
        order.user.email!,
        order.user.name || 'Customer',
        deal.cashbackAmount,
        deal.cashbackAmount
      )
    }

    // Send order confirmation email
    await sendOrderConfirmationEmail(
      order.user.email!,
      order.user.name || 'Customer',
      order.orderNumber,
      deal?.title || 'Deal',
      order.quantity,
      order.totalPrice,
      order.discount
    )

    return { processed: true }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
    throw error
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { userId, dealId } = paymentIntent.metadata || {}

    if (!userId || !dealId) {
      throw new Error('Missing metadata: userId or dealId')
    }

    // Find and update order
    const order = await prisma.order.findFirst({
      where: {
        userId,
        dealId,
        paymentStatus: 'PENDING'
      }
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED'
        }
      })
    }

    return { processed: true }
  } catch (error) {
    console.error('Error handling payment failed:', error)
    throw error
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    // Find order by charge ID
    const order = await prisma.order.findFirst({
      where: {
        id: charge.payment_intent as string
      }
    })

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'REFUNDED',
          paymentStatus: 'REFUNDED'
        }
      })

      // Cancel associated cashback
      if (order.cashbackStatus === 'APPROVED') {
        await prisma.cashback.updateMany({
          where: {
            userId: order.userId,
            source: order.id
          },
          data: {
            status: 'CANCELLED'
          }
        })
      }
    }

    return { processed: true }
  } catch (error) {
    console.error('Error handling charge refunded:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse event
    const event = JSON.parse(body) as Stripe.Event

    // Check if event was already processed
    if (webhookLogs.has(event.id)) {
      const log = webhookLogs.get(event.id)!
      if (log.status === 'success') {
        return NextResponse.json({ received: true })
      }
    }

    await logWebhookEvent(event.id, event.type, 'pending')

    // Handle specific events
    try {
      if (event.type === 'payment_intent.succeeded') {
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
      } else if (event.type === 'payment_intent.payment_failed') {
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
      } else if (event.type === 'charge.refunded') {
        await handleChargeRefunded(event.data.object as Stripe.Charge)
      } else {
        await handleWebhookEvent(event)
      }

      await logWebhookEvent(event.id, event.type, 'success')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      await logWebhookEvent(event.id, event.type, 'failed', errorMessage)
      throw error
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
