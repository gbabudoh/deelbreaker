// @ts-ignore - Module resolution issue
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

/**
 * Create a payment intent for a deal order
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }
  }
}

/**
 * Retrieve payment intent status
 */
export async function getPaymentIntentStatus(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    }
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}

/**
 * Create a customer for recurring payments
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  metadata: Record<string, string> = {}
) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    })

    return {
      success: true,
      customerId: customer.id
    }
  } catch (error) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create customer'
    }
  }
}

/**
 * Create a subscription for group buy
 */
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata: Record<string, string> = {}
) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    })

    return {
      success: true,
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }
  }
}

/**
 * Process refund
 */
export async function processRefund(
  paymentIntentId: string,
  amount?: number,
  reason: string = 'requested_by_customer'
) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as any,
      metadata: {
        processedAt: new Date().toISOString()
      }
    })

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status
    }
  } catch (error) {
    console.error('Error processing refund:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process refund'
    }
  }
}

/**
 * Create a payout for merchant
 */
export async function createMerchantPayout(
  amount: number,
  currency: string = 'usd',
  description: string = 'Merchant payout'
) {
  try {
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100),
      currency,
      description,
      statement_descriptor: 'Deelbreaker Payout'
    })

    return {
      success: true,
      payoutId: payout.id,
      amount: payout.amount / 100,
      status: payout.status
    }
  } catch (error) {
    console.error('Error creating payout:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payout'
    }
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    stripe.webhooks.constructEvent(body, signature, secret)
    return true
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

/**
 * Handle webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)

    case 'payment_intent.payment_failed':
      return handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)

    case 'charge.refunded':
      return handleChargeRefunded(event.data.object as Stripe.Charge)

    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event.data.object as Stripe.Subscription)

    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object as Stripe.Subscription)

    default:
      console.log(`Unhandled event type: ${event.type}`)
      return null
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  // Update order status in database
  // Send confirmation email
  // Update user cashback
  return { processed: true }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  // Update order status
  // Send failure notification
  return { processed: true }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id)
  // Update order status
  // Send refund confirmation
  return { processed: true }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)
  // Update subscription status
  return { processed: true }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)
  // Update subscription status
  return { processed: true }
}
