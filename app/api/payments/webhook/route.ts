import { NextRequest, NextResponse } from 'next/server'
import { stripe, verifyWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'
import Stripe from 'stripe'
import crypto from 'crypto'

// Helper function to calculate 5 working days from now (skipping Sat/Sun)
function getFiveWorkingDaysDeadline(): Date {
  const date = new Date()
  let addedDays = 0
  while (addedDays < 5) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) { // Skip Sunday (0) and Saturday (6)
      addedDays++
    }
  }
  return date
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify signature
    const isValid = verifyWebhookSignature(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body) as Stripe.Event

    // 1. Handle successful checkout payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Pull metadata
      const dealId = session.metadata?.dealId
      const userId = session.metadata?.userId
      const quantityStr = session.metadata?.quantity || '1'
      const quantity = parseInt(quantityStr)

      if (!dealId || !userId) {
        return NextResponse.json({ error: 'Missing session metadata' }, { status: 400 })
      }

      // Fetch the deal
      const deal = await prisma.deal.findUnique({
        where: { id: dealId },
        include: { merchant: true }
      })

      if (!deal) {
        return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
      }

      // Fetch user details for confirmation email
      const userObj = await prisma.user.findUnique({
        where: { id: userId }
      })

      // Prepare fulfillment parameters based on DealType
      let initialStatus: 'PENDING_REDEMPTION' | 'PENDING_SHIPMENT' = 'PENDING_SHIPMENT'
      let voucherCode: string | null = null
      let deadlineDate: Date | null = null

      if (deal.type === 'LOCAL_SERVICE' || deal.type === 'DIGITAL_SOFTWARE') {
        initialStatus = 'PENDING_REDEMPTION'
        voucherCode = `DEEL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
      } else if (deal.type === 'PHYSICAL_PRODUCT') {
        initialStatus = 'PENDING_SHIPMENT'
        deadlineDate = getFiveWorkingDaysDeadline()
      }

      const orderNumber = `ORD-${Date.now()}`
      const amountPaid = session.amount_total ? session.amount_total / 100 : 0

      // Save Order to Database
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          dealId,
          merchantId: deal.merchantId,
          quantity,
          unitPrice: deal.currentPrice,
          totalPrice: amountPaid,
          amountPaid,
          discount: deal.originalPrice - deal.currentPrice,
          status: initialStatus,
          paymentStatus: 'PAID',
          voucherCode,
          deadlineDate,
          stripeSessionId: session.id,
          stripeChargeId: session.payment_intent as string || null
        }
      })

      // Log Analytics Event
      try {
        await prisma.analyticsEvent.create({
          data: {
            userId,
            dealId,
            eventType: 'PURCHASE',
            country: session.shipping_details?.address?.country || 'US'
          }
        })
      } catch (err) {
        console.error('Failed to log purchase event silently:', err)
      }

      // Send Email confirmation if user has email
      if (userObj?.email) {
        try {
          await sendOrderConfirmationEmail(
            userObj.email,
            userObj.name || 'Valued Customer',
            orderNumber,
            deal.title,
            quantity,
            amountPaid,
            deal.originalPrice - deal.currentPrice
          )
        } catch (emailError) {
          console.error('Webhook post-order email notification failed:', emailError)
        }
      }

      return NextResponse.json({ received: true, orderId: order.id })
    }

    // 2. Handle Stripe Connect wallet onboarding status updates
    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account

      // Check if payouts are fully activated
      if (account.payouts_enabled && account.details_submitted) {
        const merchantId = account.metadata?.merchantId

        if (merchantId) {
          await prisma.merchant.update({
            where: { id: merchantId },
            data: { isBillingActive: true }
          })
          console.log(`[Stripe Connect] Billing activated for merchant: ${merchantId}`)
        }
      }
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
