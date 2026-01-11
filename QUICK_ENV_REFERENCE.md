# 🚀 Quick Environment Reference

## 🔥 Essential Variables (Required)

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/deelbreaker_db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-secret-key-here"

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

## ⚡ Quick Setup Commands

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Validate your configuration
npm run env:validate

# 3. Set up database (after configuring DATABASE_URL)
npm run db:setup

# 4. Start development
npm run dev
```

## 🔧 Service Quick Links

| Service | Purpose | Get Credentials |
|---------|---------|-----------------|
| **PostgreSQL** | Database | [Local Setup](https://www.postgresql.org/download/) or [Supabase](https://supabase.com) |
| **Stripe** | Payments | [Dashboard](https://dashboard.stripe.com/apikeys) |
| **Google OAuth** | Social Login | [Console](https://console.cloud.google.com/) |
| **MinIO** | File Storage | [Download](https://min.io/download) |
| **Redis** | Caching | [Docker](https://hub.docker.com/_/redis) or [Upstash](https://upstash.com) |

## 🎯 Development vs Production

### Development
```env
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
DEBUG=true
```

### Production
```env
NODE_ENV="production"
NEXTAUTH_URL="https://yourdomain.com"
DEBUG=false
```

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Database connection fails | Check `DATABASE_URL` format and credentials |
| Prisma client errors | Run `npm run db:generate` |
| NextAuth errors | Verify `NEXTAUTH_SECRET` is 32+ characters |
| Stripe webhook fails | Check `STRIPE_WEBHOOK_SECRET` |

## 📞 Need Help?

1. Run `npm run env:validate` to check your setup
2. See `ENVIRONMENT_SETUP.md` for detailed instructions
3. Check the troubleshooting section in the main README