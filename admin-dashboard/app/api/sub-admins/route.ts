import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subAdmins = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      include: { permissions: true }
    })
    return NextResponse.json(subAdmins)
  } catch (error) {
    console.error('Error fetching sub-admins:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { email, name, password, role, permissions } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Admin user with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newAdmin = await prisma.adminUser.create({
      data: {
        email,
        name,
        passwordHash,
        role: role || 'SUB_ADMIN',
        permissions: {
          create: {
            manageDeals: permissions?.manageDeals ?? false,
            manageUsers: permissions?.manageUsers ?? false,
            manageBanners: permissions?.manageBanners ?? false,
            resolveDisputes: permissions?.resolveDisputes ?? false,
            manageAdmins: permissions?.manageAdmins ?? false,
          }
        }
      },
      include: { permissions: true }
    })

    return NextResponse.json(newAdmin)
  } catch (error) {
    console.error('Error creating sub-admin:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, name, role, permissions } = body

    if (!id) {
      return NextResponse.json({ error: 'Sub-Admin ID is required' }, { status: 400 })
    }

    // Check if permissions exists for this user, if not create them
    const adminUser = await prisma.adminUser.findUnique({
      where: { id },
      include: { permissions: true }
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Sub-Admin not found' }, { status: 404 })
    }

    let permissionsUpdate: any;
    if (permissions) {
      if (adminUser.permissions) {
        permissionsUpdate = {
          update: {
            manageDeals: permissions.manageDeals,
            manageUsers: permissions.manageUsers,
            manageBanners: permissions.manageBanners,
            resolveDisputes: permissions.resolveDisputes,
            manageAdmins: permissions.manageAdmins,
          }
        }
      } else {
        permissionsUpdate = {
          create: {
            manageDeals: permissions.manageDeals ?? false,
            manageUsers: permissions.manageUsers ?? false,
            manageBanners: permissions.manageBanners ?? false,
            resolveDisputes: permissions.resolveDisputes ?? false,
            manageAdmins: permissions.manageAdmins ?? false,
          }
        }
      }
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        permissions: permissionsUpdate
      },
      include: { permissions: true }
    })

    return NextResponse.json(updatedAdmin)
  } catch (error) {
    console.error('Error updating sub-admin:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Sub-Admin ID is required' }, { status: 400 })
  }

  // Prevent self deletion
  const selfAdmin = await prisma.adminUser.findUnique({
    where: { email: session.user.email! }
  })
  if (selfAdmin?.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 })
  }

  try {
    await prisma.adminUser.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sub-admin:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
