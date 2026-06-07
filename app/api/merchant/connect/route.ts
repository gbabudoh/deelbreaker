import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { merchantId } = await request.json()

    if (!merchantId) {
      return NextResponse.json({ error: 'Merchant ID required' }, { status: 400 })
    }

    // 1. Fetch current merchant data
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    })

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant record not found' }, { status: 404 })
    }

    let stripeAccountId = merchant.stripeConnectId

    // 2. If no Stripe ID exists yet, provision a new Express account
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_type: 'individual', // Default to individual, can be customized
        metadata: { merchantId }
      })

      stripeAccountId = account.id

      // Persist the ID to database
      await prisma.merchant.update({
        where: { id: merchantId },
        data: { stripeConnectId: stripeAccountId }
      })
    }

    // 3. Generate secure onboarding URL hosted by Stripe
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/merchant?tab=billing&status=refresh`,
      return_url: `${baseUrl}/merchant?tab=billing&status=success`,
      type: 'account_onboarding'
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error: any) {
    console.error('Stripe Connect Initialization Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal onboarding link error' },
      { status: 500 }
    )
  }
}
