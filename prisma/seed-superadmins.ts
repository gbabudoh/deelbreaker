import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const superAdmins = [
  {
    email: 'superadmin01@deelbreaker.com',
    password: 'G1veSuperAmin01Pass1',
    name: 'Super Admin 01',
  },
  {
    email: 'superadmin02@deelbreaker.com',
    password: 'G1veSuperAmin02Pass2',
    name: 'Super Admin 02',
  },
]

async function main() {
  console.log('🌱 Seeding super admin accounts...')

  for (const admin of superAdmins) {
    const existing = await prisma.adminUser.findUnique({ where: { email: admin.email } })

    if (existing) {
      console.log(`⚠️  ${admin.email} already exists — skipping.`)
      continue
    }

    const passwordHash = await bcrypt.hash(admin.password, 12)

    await prisma.adminUser.create({
      data: {
        email: admin.email,
        name: admin.name,
        passwordHash,
        role: 'SUPER_ADMIN',
        permissions: {
          create: {
            manageDeals: true,
            manageUsers: true,
            manageBanners: true,
            resolveDisputes: true,
            manageAdmins: true,
          },
        },
      },
    })

    console.log(`✅ Created: ${admin.email}`)
  }

  console.log('Done.')
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
