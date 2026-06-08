import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@deelbreaker.com'
  const defaultPassword = 'AdminPassword123!'
  
  console.log('🌱 Seeding Admin database...')
  
  // Hash default password
  const passwordHash = await bcrypt.hash(defaultPassword, 10)
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email }
  })
  
  if (!existingAdmin) {
    console.log(`Creating default Super Admin: ${email}`)
    await prisma.adminUser.create({
      data: {
        email,
        name: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        permissions: {
          create: {
            manageDeals: true,
            manageUsers: true,
            manageBanners: true,
            resolveDisputes: true,
            manageAdmins: true
          }
        }
      }
    })
    console.log('✅ Default Super Admin created!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${defaultPassword}`)
  } else {
    console.log(`Super Admin ${email} already exists. Skipping creation.`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
