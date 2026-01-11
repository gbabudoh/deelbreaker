#!/bin/bash

echo "🚀 Setting up Deelbreaker database..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your database credentials before continuing."
    exit 1
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "📊 Pushing schema to database..."
npm run db:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "✅ Database setup complete!"
echo "🎉 You can now run 'npm run dev' to start the application."