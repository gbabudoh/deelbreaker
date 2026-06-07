import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function GET(request: Request) {
  // CRON SECURITY VERIFICATION HOOK (Ensure Vercel Cron or script authorization matches)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized access call' }, { status: 401 })
  }

  try {
    const now = new Date()

    // 1. Fetch overdue physical orders that haven't been shipped
    const overdueOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING_SHIPMENT',
        deadlineDate: { lt: now }
      },
      include: {
        user: true,
        deal: true
      }
    })

    if (overdueOrders.length === 0) {
      return NextResponse.json({ message: 'No overdue unfulfilled orders detected.' })
    }

    const processLog = []

    // 2. Loop and issue automated refunds via Stripe Connect separate charges / platform ledger
    for (const order of overdueOrders) {
      try {
        const refundParams: any = {
          reason: 'requested_by_customer', // standard code flag for service-level agreement breach
          metadata: {
            reason: 'Deelbreaker 3-5 Day Fulfillment Breach Rule execution',
            orderId: order.id
          }
        }

        if (order.stripeChargeId) {
          refundParams.charge = order.stripeChargeId
        } else if (order.stripeSessionId) {
          // Fallback to refunding the session's PaymentIntent directly
          const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
          if (session.payment_intent) {
            refundParams.payment_intent = session.payment_intent as string
          } else {
            throw new Error('No PaymentIntent found on Checkout Session')
          }
        } else {
          throw new Error('No valid stripeChargeId or stripeSessionId associated with order')
        }

        // Issue card return
        const refund = await stripe.refunds.create(refundParams)

        // 3. Set database order state to CANCELLED_EXPIRED_REFUNDED
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELLED_EXPIRED_REFUNDED',
            paymentStatus: 'REFUNDED'
          }
        })

        processLog.push({ orderId: order.id, status: 'REFUNDED', refundId: refund.id })
      } catch (stripeError: any) {
        console.error(`Failed to cancel and refund order ${order.id}:`, stripeError)
        processLog.push({ orderId: order.id, status: 'FAILED', error: stripeError.message })
      }
    }

    return NextResponse.json({
      message: 'Automated cancellation evaluation complete.',
      processedCount: overdueOrders.length,
      results: processLog
    })
  } catch (globalError: any) {
    console.error('Global cron checks deadline script failed:', globalError)
    return NextResponse.json(
      { error: globalError.message || 'Internal automation framework collapse' },
      { status: 500 }
    )
  }
}
