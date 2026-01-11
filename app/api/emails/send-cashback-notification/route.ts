import { NextRequest, NextResponse } from 'next/server'
import { sendCashbackNotificationEmail } from '@/lib/email'
import { z } from 'zod'

const sendCashbackNotificationSchema = z.object({
  email: z.string().email(),
  userName: z.string(),
  cashbackAmount: z.number().min(0),
  totalCashback: z.number().min(0)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sendCashbackNotificationSchema.parse(body)

    const result = await sendCashbackNotificationEmail(
      data.email,
      data.userName,
      data.cashbackAmount,
      data.totalCashback
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
    console.error('Error sending cashback notification:', error)

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
