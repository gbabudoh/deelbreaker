import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'admin_token'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'deelbreaker-admin-secret'
)

export interface AdminPayload {
  id: string
  email: string
  name: string | null
  role: string
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret)
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as AdminPayload
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}
