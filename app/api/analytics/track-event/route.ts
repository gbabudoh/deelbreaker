import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics'
import { z } from 'zod'

const trackEventSchema = z.object({
  userId: z.string().optional(),
  eventType: z.string(),
  eventData: z.record(z.any()),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = trackEventSchema.parse(body)

    const result = await trackEvent({
      userId: data.userId,
      eventType: data.eventType,
      eventData: data.eventData,
      timestamp: new Date(),
      sessionId: data.sessionId,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
