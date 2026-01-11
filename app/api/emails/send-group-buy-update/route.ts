import { NextRequest, NextResponse } from 'next/server'
import { sendGroupBuyUpdateEmail } from '@/lib/email'
import { z } from 'zod'

const sendGroupBuyUpdateSchema = z.object({
  email: z.string().email(),
  userName: z.string(),
  dealTitle: z.string(),
  currentParticipants: z.number().min(0),
  targetParticipants: z.number().min(1),
  currentPrice: z.number().min(0),
  originalPrice: z.number().min(0)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sendGroupBuyUpdateSchema.parse(body)

    const result = await sendGroupBuyUpdateEmail(
      data.email,
      data.userName,
      data.dealTitle,
      data.currentParticipants,
      data.targetParticipants,
      data.currentPrice,
      data.originalPrice
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
    console.error('Error sending group buy update:', error)

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
