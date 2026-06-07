import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Group buy feature is deprecated on Deelbreaker' },
    { status: 410 }
  )
}