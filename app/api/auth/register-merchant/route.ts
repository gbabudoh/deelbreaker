import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerMerchantSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  businessType: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerMerchantSchema.parse(body)
    
    // Check if merchant already exists
    const existingMerchant = await prisma.merchant.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingMerchant) {
      return NextResponse.json(
        { message: 'Merchant with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create merchant
    const merchant = await prisma.merchant.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        businessType: validatedData.businessType,
        website: validatedData.website || null,
        description: validatedData.description,
        // Default merchant settings
        tier: 'Standard',
        commissionRate: 10.0,
        verified: false, // Merchants need to be verified by admin
      }
    })
    
    // Return success (don't include sensitive data)
    return NextResponse.json({
      message: 'Merchant account created successfully',
      merchant: {
        id: merchant.id,
        name: merchant.name,
        email: merchant.email,
        tier: merchant.tier,
        verified: merchant.verified,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Merchant registration error:', error)
    
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