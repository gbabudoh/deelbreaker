import { NextRequest, NextResponse } from 'next/server'
import { sendDealAlertEmail } from '@/lib/email'
import { z } from 'zod'

const sendDealAlertSchema = z.object({
  email: z.string().email(),
  userName: z.string(),
  dealTitle: z.string(),
  dealDescription: z.string(),
  discount: z.number().min(0).max(100),
  dealUrl: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sendDealAlertSchema.parse(body)

    const result = await sendDealAlertEmail(
      data.email,
      data.userName,
      data.dealTitle,
      data.dealDescription,
      data.discount,
      data.dealUrl
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId
    })
  } catch (error) {
    console.error('Error sending deal alert:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
