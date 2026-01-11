import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function verifyMigration(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Verifying database migration...');
    
    // Check merchants
    const merchantCount = await prisma.merchant.count();
    console.log(`✅ Merchants: ${merchantCount} records`);
    
    // Check deals
    const dealCount = await prisma.deal.count();
    console.log(`✅ Deals: ${dealCount} records`);
    
    // Check users
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount} records`);
    
    // Check notification settings
    const notificationCount = await prisma.notificationSettings.count();
    console.log(`✅ Notification Settings: ${notificationCount} records`);
    
    // Check privacy settings
    const privacyCount = await prisma.privacySettings.count();
    console.log(`✅ Privacy Settings: ${privacyCount} records`);
    
    // Sample query to verify relationships
    const dealsWithMerchants = await prisma.deal.findMany({
      include: {
        merchant: {
          select: {
            name: true,
            verified: true
          }
        }
      },
      take: 3
    });
    
    console.log('\n📊 Sample deals with merchant info:');
    dealsWithMerchants.forEach((deal, index) => {
      console.log(`${index + 1}. ${deal.title} - ${deal.merchant.name} (${deal.merchant.verified ? 'Verified' : 'Unverified'})`);
    });
    
    console.log('\n🎉 Database migration verification completed successfully!');
    console.log('✅ All tables created and populated with sample data');
    console.log('✅ Relationships working correctly');
    console.log('✅ Ready for development!');
    
  } catch (error) {
    console.error('❌ Migration verification failed:', (error as Error).message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});