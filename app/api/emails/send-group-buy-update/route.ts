import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Group buy feature has been removed. This endpoint is no longer active.' },
    { status: 410 }
  )
}

