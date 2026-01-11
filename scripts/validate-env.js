#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Required environment variables
const requiredVars = {
  'Database': [
    'DATABASE_URL'
  ],
  'Authentication': [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ],
  'Payment Processing': [
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ]
};

// Optional but recommended variables
const recommendedVars = {
  'OAuth Providers': [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ],
  'Email Service': [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD'
  ],
  'File Storage': [
    'MINIO_ENDPOINT',
    'MINIO_ACCESS_KEY',
    'MINIO_SECRET_KEY'
  ],
  'Caching': [
    'REDIS_URL'
  ]
};

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ .env.local file not found!${colors.reset}`);
    console.log(`${colors.yellow}💡 Copy .env.example to .env.local and configure your values${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✅ .env.local file found${colors.reset}`);
  return true;
}

function loadEnvVars() {
  try {
    require('dotenv').config({ path: '.env.local' });
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Error loading .env.local: ${error.message}${colors.reset}`);
    return false;
  }
}

function validateRequired() {
  console.log(`\n${colors.bold}${colors.blue}🔍 Checking Required Variables:${colors.reset}`);
  
  let allValid = true;
  
  Object.entries(requiredVars).forEach(([category, vars]) => {
    console.log(`\n${colors.bold}${category}:${colors.reset}`);
    
    vars.forEach(varName => {
      const value = process.env[varName];
      if (value && value.trim() !== '') {
        console.log(`  ${colors.green}✅ ${varName}${colors.reset}`);
      } else {
        console.log(`  ${colors.red}❌ ${varName} - Missing or empty${colors.reset}`);
        allValid = false;
      }
    });
  });
  
  return allValid;
}

function validateRecommended() {
  console.log(`\n${colors.bold}${colors.blue}💡 Checking Recommended Variables:${colors.reset}`);
  
  let recommendedCount = 0;
  let totalRecommended = 0;
  
  Object.entries(recommendedVars).forEach(([category, vars]) => {
    console.log(`\n${colors.bold}${category}:${colors.reset}`);
    
    vars.forEach(varName => {
      totalRecommended++;
      const value = process.env[varName];
      if (value && value.trim() !== '') {
        console.log(`  ${colors.green}✅ ${varName}${colors.reset}`);
        recommendedCount++;
      } else {
        console.log(`  ${colors.yellow}⚠️  ${varName} - Not configured${colors.reset}`);
      }
    });
  });
  
  return { configured: recommendedCount, total: totalRecommended };
}

function validateSpecificFormats() {
  console.log(`\n${colors.bold}${colors.blue}🔧 Validating Formats:${colors.reset}`);
  
  const validations = [
    {
      name: 'DATABASE_URL',
      test: (value) => value && value.startsWith('postgresql://'),
      message: 'Should start with postgresql://'
    },
    {
      name: 'NEXTAUTH_SECRET',
      test: (value) => value && value.length >= 32,
      message: 'Should be at least 32 characters long'
    },
    {
      name: 'NEXTAUTH_URL',
      test: (value) => value && (value.startsWith('http://') || value.startsWith('https://')),
      message: 'Should be a valid URL (http:// or https://)'
    },
    {
      name: 'STRIPE_SECRET_KEY',
      test: (value) => value && (value.startsWith('sk_test_') || value.startsWith('sk_live_')),
      message: 'Should start with sk_test_ or sk_live_'
    },
    {
      name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      test: (value) => value && (value.startsWith('pk_test_') || value.startsWith('pk_live_')),
      message: 'Should start with pk_test_ or pk_live_'
    }
  ];
  
  validations.forEach(({ name, test, message }) => {
    const value = process.env[name];
    if (value) {
      if (test(value)) {
        console.log(`  ${colors.green}✅ ${name} format is valid${colors.reset}`);
      } else {
        console.log(`  ${colors.red}❌ ${name} format invalid - ${message}${colors.reset}`);
      }
    }
  });
}

function checkDatabaseConnection() {
  console.log(`\n${colors.bold}${colors.blue}🗄️  Testing Database Connection:${colors.reset}`);
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log(`  ${colors.red}❌ DATABASE_URL not configured${colors.reset}`);
    return;
  }
  
  try {
    const url = new URL(dbUrl);
    console.log(`  ${colors.green}✅ Database URL format is valid${colors.reset}`);
    console.log(`  ${colors.blue}ℹ️  Host: ${url.hostname}${colors.reset}`);
    console.log(`  ${colors.blue}ℹ️  Port: ${url.port || 5432}${colors.reset}`);
    console.log(`  ${colors.blue}ℹ️  Database: ${url.pathname.slice(1)}${colors.reset}`);
  } catch (error) {
    console.log(`  ${colors.red}❌ Invalid DATABASE_URL format${colors.reset}`);
  }
}

function generateReport(requiredValid, recommended) {
  console.log(`\n${colors.bold}${colors.blue}📊 Environment Validation Report:${colors.reset}`);
  console.log(`${colors.bold}================================${colors.reset}`);
  
  if (requiredValid) {
    console.log(`${colors.green}✅ All required variables are configured${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Some required variables are missing${colors.reset}`);
  }
  
  const percentage = Math.round((recommended.configured / recommended.total) * 100);
  console.log(`${colors.blue}📈 Recommended variables: ${recommended.configured}/${recommended.total} (${percentage}%)${colors.reset}`);
  
  if (requiredValid && percentage >= 70) {
    console.log(`\n${colors.green}🎉 Your environment is well configured!${colors.reset}`);
    console.log(`${colors.green}You can run: npm run db:setup${colors.reset}`);
  } else if (requiredValid) {
    console.log(`\n${colors.yellow}⚠️  Basic setup complete, but consider configuring more services${colors.reset}`);
    console.log(`${colors.yellow}You can run: npm run db:setup${colors.reset}`);
  } else {
    console.log(`\n${colors.red}🚫 Please configure the missing required variables before proceeding${colors.reset}`);
    console.log(`${colors.red}See ENVIRONMENT_SETUP.md for detailed instructions${colors.reset}`);
  }
}

function main() {
  console.log(`${colors.bold}${colors.blue}🔧 Deelbreaker Environment Validator${colors.reset}`);
  console.log(`${colors.bold}====================================${colors.reset}`);
  
  // Check if .env.local exists
  if (!checkEnvFile()) {
    process.exit(1);
  }
  
  // Load environment variables
  if (!loadEnvVars()) {
    process.exit(1);
  }
  
  // Validate required variables
  const requiredValid = validateRequired();
  
  // Validate recommended variables
  const recommended = validateRecommended();
  
  // Validate specific formats
  validateSpecificFormats();
  
  // Test database connection format
  checkDatabaseConnection();
  
  // Generate final report
  generateReport(requiredValid, recommended);
  
  // Exit with appropriate code
  process.exit(requiredValid ? 0 : 1);
}

// Run the validator
main();