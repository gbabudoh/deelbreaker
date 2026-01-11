import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email'
import { z } from 'zod'

const sendPasswordResetSchema = z.object({
  email: z.string().email(),
  resetLink: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = sendPasswordResetSchema.parse(body)

    const result = await sendPasswordResetEmail(
      data.email,
      data.resetLink
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
    console.error('Error sending password reset email:', error)

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
