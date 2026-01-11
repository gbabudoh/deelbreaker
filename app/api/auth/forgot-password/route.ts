import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const { email } = forgotPasswordSchema.parse(body)
    
    // Check if user exists (check both users and merchants)
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    const merchant = await prisma.merchant.findUnique({
      where: { email }
    })
    
    if (!user && !merchant) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.'
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now
    
    // Store reset token in database
    // Note: In a real application, you'd have a password reset tokens table
    // For now, we'll just simulate the process
    
    // In production, you would:
    // 1. Store the reset token in a secure table with expiry
    // 2. Send an email with the reset link
    // 3. Handle the reset token validation in a separate endpoint
    
    console.log(`Password reset requested for: ${email}`)
    console.log(`Reset token: ${resetToken}`)
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`)
    
    // Simulate email sending
    // In production, use a service like SendGrid, Resend, or Nodemailer
    
    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}