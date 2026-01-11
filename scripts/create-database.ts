import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function createDatabase(): Promise<void> {
  // Connect to the default postgres database first
  const adminClient = new Client({
    host: '109.205.181.195',
    port: 5432,
    user: 'postgres',
    password: 'LetMeGetaces232823',
    database: 'postgres' // Connect to default postgres database
  });

  try {
    console.log('🔍 Connecting to PostgreSQL server...');
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL server!');
    
    // Check if database exists
    const checkDb = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'deelbreaker_db'"
    );
    
    if (checkDb.rows.length > 0) {
      console.log('✅ Database "deelbreaker_db" already exists!');
    } else {
      console.log('🏗️  Creating database "deelbreaker_db"...');
      await adminClient.query('CREATE DATABASE deelbreaker_db');
      console.log('✅ Database "deelbreaker_db" created successfully!');
    }
    
    await adminClient.end();
    
    // Now test connection to the new database
    console.log('🔍 Testing connection to deelbreaker_db...');
    const appClient = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await appClient.connect();
    console.log('✅ Successfully connected to deelbreaker_db!');
    
    const result = await appClient.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    await appClient.end();
    console.log('🎉 Database is ready for Prisma migration!');
    
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run the function
createDatabase().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});