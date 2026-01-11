import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { z } from 'zod'

const sendOrderConfirmationSchema = z.object({
  email: z.string().email(),
  userName: z.string(),
  orderNumber: z.string(),
  dealTitle: z.string(),
  quantity: z.number().min(1),
  totalPrice: z.number().min(0),
  discount: z.number().min(0)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sendOrderConfirmationSchema.parse(body)

    const result = await sendOrderConfirmationEmail(
      data.email,
      data.userName,
      data.orderNumber,
      data.dealTitle,
      data.quantity,
      data.totalPrice,
      data.discount
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
    console.error('Error sending order confirmation:', error)

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
