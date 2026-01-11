# ⚡ Deelbreaker Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## 📦 Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd deelbreaker

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local

# 4. Update .env.local with your values
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - OAuth credentials
# - Email service credentials
```

---

## 🗄️ Database Setup

```bash
# Create database
npm run db:create

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Verify migration
npm run db:verify
```

---

## 🏃 Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### Access Points
- **Home**: http://localhost:3000
- **Sign In**: http://localhost:3000/auth/signin
- **Sign Up**: http://localhost:3000/auth/signup
- **Deals**: http://localhost:3000/deals
- **Dashboard**: http://localhost:3000/dashboard
- **Merchant**: http://localhost:3000/merchant
- **Admin**: http://localhost:3000/admin
- **Welcome**: http://localhost:3000/welcome

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e

# Check code quality
npm run lint
```

---

## 🏗️ Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Useful Commands

```bash
# Database commands
npm run db:create          # Create database
npm run db:generate        # Generate Prisma client
npm run db:push            # Push schema
npm run db:migrate         # Run migrations
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed database
npm run db:test            # Test connection
npm run db:verify          # Verify migration

# Environment commands
npm run env:validate       # Validate environment
npm run env:check          # Check environment

# Development commands
npm run dev                # Start dev server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run linter
npm test                   # Run tests

# Database setup (Windows)
npm run db:setup           # Run PowerShell setup script
```

---

## 📝 Environment Variables

### Required Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/deelbreaker_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# OAuth Providers
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
AZURE_AD_CLIENT_ID=<your-azure-client-id>
AZURE_AD_CLIENT_SECRET=<your-azure-client-secret>
AZURE_AD_TENANT_ID=<your-tenant-id>
APPLE_CLIENT_ID=<your-apple-client-id>
APPLE_CLIENT_SECRET=<your-apple-client-secret>

# Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@deelbreaker.com
```

### Optional Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Redis
REDIS_URL=redis://localhost:6379

# Analytics
SENTRY_DSN=https://...
```

---

## 🔑 Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🌐 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### Microsoft Azure AD
1. Go to [Azure Portal](https://portal.azure.com)
2. Register new application
3. Create client secret
4. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/azure-ad`
   - `https://yourdomain.com/api/auth/callback/azure-ad`

### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com)
2. Create App ID and Service ID
3. Generate client secret
4. Add redirect URIs

---

## 📊 Database Schema

### Key Tables
- `users` - Consumer accounts
- `merchants` - Business accounts
- `deals` - Product deals
- `orders` - Purchase records
- `group_buy_participants` - Group buy participation
- `reviews` - Community reviews
- `saved_deals` - User saved deals
- `cashbacks` - Reward tracking

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other variables
```

### Docker
```bash
# Build image
docker build -t deelbreaker:latest .

# Run container
docker run -p 3000:3000 deelbreaker:latest
```

### AWS
```bash
# Build
npm run build

# Deploy to EC2
# Use PM2 for process management
pm2 start npm --name "deelbreaker" -- start
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check connection
npm run db:test

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

### OAuth Not Working
- Verify client IDs and secrets
- Check redirect URIs match exactly
- Ensure NEXTAUTH_URL is correct

---

## 📚 Documentation

- **AUTHENTICATION_SETUP.md** - Auth system details
- **DATABASE_MIGRATION_COMPLETE.md** - Database setup
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **ADVANCED_FEATURES_COMPLETE.md** - Features documentation
- **PROJECT_COMPLETION_SUMMARY.md** - Project overview

---

## 🎯 Common Tasks

### Create Admin User
```bash
# Use Prisma Studio
npm run db:studio

# Or create via API
# POST /api/admin/users
```

### View Database
```bash
# Open Prisma Studio
npm run db:studio

# Or use PostgreSQL client
psql postgresql://user:password@host:5432/deelbreaker_db
```

### Check Logs
```bash
# Development logs
npm run dev

# Production logs
pm2 logs deelbreaker
```

### Reset Database
```bash
# WARNING: This deletes all data
npm run db:reset

# Then seed again
npm run db:seed
```

---

## 🔒 Security Checklist

- [ ] Change default passwords
- [ ] Enable HTTPS
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Review security headers

---

## 📞 Support

### Getting Help
1. Check documentation files
2. Review code comments
3. Check GitHub issues
4. Contact development team

### Reporting Issues
- Include error message
- Include steps to reproduce
- Include environment details
- Include relevant logs

---

## 🎓 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Studio](https://www.prisma.io/studio)

### NextAuth.js
- [NextAuth.js Documentation](https://next-auth.js.org)
- [OAuth Providers](https://next-auth.js.org/providers)

### PostgreSQL
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [PostgreSQL Tutorials](https://www.postgresql.org/docs/current/tutorial.html)

---

## ✨ Tips & Tricks

### Development
- Use Prisma Studio for database exploration
- Use browser DevTools for frontend debugging
- Use VS Code extensions for better DX
- Use Postman for API testing

### Performance
- Enable caching headers
- Use CDN for static assets
- Optimize database queries
- Monitor Core Web Vitals

### Productivity
- Use keyboard shortcuts
- Set up git hooks
- Use environment variables
- Automate repetitive tasks

---

## 🚀 Ready to Launch!

You're all set! Start with:
```bash
npm install
npm run db:create
npm run db:push
npm run db:seed
npm run dev
```

Then visit http://localhost:3000 and start exploring! 🎉

---

**Last Updated**: January 10, 2026
**Status**: ✅ Ready for Development
