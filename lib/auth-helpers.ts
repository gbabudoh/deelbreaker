// @ts-ignore - Module resolution issue
import { getServerSession } from 'next-auth'
// @ts-ignore - Module resolution issue  
import { authOptions } from './auth'
// @ts-ignore - Module resolution issue
import { NextResponse } from 'next/server'

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    userType: session.user.userType || 'user'
  }
}

export function createUnauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}