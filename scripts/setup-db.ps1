Write-Host "🚀 Setting up Deelbreaker database..." -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "📋 Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "⚠️  Please edit .env.local with your database credentials before continuing." -ForegroundColor Red
    Write-Host "📖 See ENVIRONMENT_SETUP.md for detailed configuration instructions." -ForegroundColor Blue
    exit 1
}

# Validate environment variables
Write-Host "🔍 Validating environment configuration..." -ForegroundColor Blue
npm run env:validate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Environment validation failed. Please check your .env.local file." -ForegroundColor Red
    Write-Host "📖 See ENVIRONMENT_SETUP.md for configuration help." -ForegroundColor Blue
    exit 1
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client." -ForegroundColor Red
    exit 1
}

# Push schema to database
Write-Host "📊 Pushing schema to database..." -ForegroundColor Blue
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema. Check your DATABASE_URL." -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "🎉 You can now run 'npm run dev' to start the application." -ForegroundColor Green
Write-Host "🔧 Run 'npm run env:validate' anytime to check your configuration." -ForegroundColor Blue