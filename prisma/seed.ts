// NOTE: Run 'npm run db:generate' before running this seed file
// This generates the Prisma client types that this file needs

async function main() {
  let prisma: any;
  
  try {
    // Use require instead of dynamic import for better compatibility
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  } catch (error) {
    console.error('❌ Prisma client not found. Please run "npm run db:generate" first.');
    console.error('Then run "npm run db:push" to create the database tables.');
    process.exit(1);
  }

  try {
    console.log('🌱 Seeding database...')

    // Create merchants
    const techWorld = await prisma.merchant.create({
      data: {
        name: 'TechWorld Electronics',
        email: 'merchant@techworld.com',
        description: 'Leading electronics retailer with cutting-edge technology',
        website: 'https://techworld.com',
        businessType: 'Electronics',
        verified: true,
        tier: 'Premium',
        commissionRate: 8.5,
        avgRating: 4.8
      }
    })

    const sportZone = await prisma.merchant.create({
      data: {
        name: 'SportZone',
        email: 'merchant@sportzone.com',
        description: 'Your one-stop shop for sports and fitness equipment',
        website: 'https://sportzone.com',
        businessType: 'Sports & Fitness',
        verified: true,
        tier: 'Standard',
        commissionRate: 10.0,
        avgRating: 4.6
      }
    })

    const fashionHub = await prisma.merchant.create({
      data: {
        name: 'FashionHub',
        email: 'merchant@fashionhub.com',
        description: 'Trendy fashion for the modern lifestyle',
        website: 'https://fashionhub.com',
        businessType: 'Fashion',
        verified: true,
        tier: 'Standard',
        commissionRate: 12.0,
        avgRating: 4.7
      }
    })

    // Create sample deals
    const deals = [
      {
        title: 'iPhone 15 Pro Max 256GB',
        description: 'Latest iPhone with advanced camera system, titanium design, and A17 Pro chip. Includes 1-year warranty and free shipping.',
        category: 'Electronics',
        originalPrice: 1199.00,
        currentPrice: 999.00,
        discount: 17,
        type: 'GROUP_BUY' as const,
        status: 'ACTIVE' as const,
        targetParticipants: 1000,
        currentParticipants: 847,
        images: ['/images/iphone-15-pro-max.jpg'],
        features: [
          'A17 Pro chip with 6-core GPU',
          'Pro camera system with 5x Telephoto',
          'Titanium design',
          'Action Button',
          'USB-C connector'
        ],
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        merchantId: techWorld.id,
        verified: true,
        featured: true
      },
      {
        title: 'Nike Air Max 270',
        description: 'Comfortable running shoes with Max Air cushioning and breathable mesh upper.',
        category: 'Fashion',
        originalPrice: 150.00,
        currentPrice: 89.00,
        discount: 41,
        type: 'INSTANT' as const,
        status: 'ACTIVE' as const,
        cashbackAmount: 15.00,
        cashbackPercentage: 10,
        images: ['/images/nike-air-max-270.jpg'],
        features: [
          'Max Air cushioning',
          'Breathable mesh upper',
          'Durable rubber outsole',
          'Comfortable fit'
        ],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        merchantId: sportZone.id,
        verified: true
      },
      {
        title: 'MacBook Air M3 13-inch',
        description: 'Supercharged by the M3 chip, featuring an 8-core CPU and up to 10-core GPU.',
        category: 'Electronics',
        originalPrice: 1299.00,
        currentPrice: 1099.00,
        discount: 15,
        type: 'GROUP_BUY' as const,
        status: 'ACTIVE' as const,
        targetParticipants: 500,
        currentParticipants: 234,
        images: ['/images/macbook-air-m3.jpg'],
        features: [
          'M3 chip with 8-core CPU',
          '13.6-inch Liquid Retina display',
          'Up to 18 hours battery life',
          '256GB SSD storage'
        ],
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        merchantId: techWorld.id,
        verified: true
      },
      {
        title: 'Samsung 65" QLED TV',
        description: '4K QLED Smart TV with Quantum HDR and built-in streaming apps.',
        category: 'Electronics',
        originalPrice: 1499.00,
        currentPrice: 899.00,
        discount: 40,
        type: 'INSTANT' as const,
        status: 'ACTIVE' as const,
        cashbackAmount: 50.00,
        cashbackPercentage: 5,
        images: ['/images/samsung-qled-tv.jpg'],
        features: [
          '65-inch QLED display',
          '4K Ultra HD resolution',
          'Quantum HDR technology',
          'Smart TV with Tizen OS'
        ],
        startDate: new Date(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        merchantId: techWorld.id,
        verified: true
      }
    ]

    for (const dealData of deals) {
      await prisma.deal.create({ data: dealData })
    }

    // Create sample users
    const users = [
      {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        level: 'Gold'
      },
      {
        email: 'mike@example.com',
        name: 'Mike Rodriguez',
        level: 'Silver'
      },
      {
        email: 'lisa@example.com',
        name: 'Lisa Kim',
        level: 'Bronze'
      }
    ]

    for (const userData of users) {
      const user = await prisma.user.create({ data: userData })
      
      // Create notification settings
      await prisma.notificationSettings.create({
        data: {
          userId: user.id,
          deals: true,
          groupBuys: true,
          priceDrops: true,
          marketing: false
        }
      })

      // Create privacy settings
      await prisma.privacySettings.create({
        data: {
          userId: user.id,
          profileVisible: true,
          shareActivity: false,
          dataCollection: true
        }
      })
    }

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })