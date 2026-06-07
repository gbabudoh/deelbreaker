# 🔧 Deelbreaker Environment Setup Guide

This guide will help you configure all the necessary environment variables for Deelbreaker.

## 📋 Quick Start Checklist

- [ ] PostgreSQL Database
- [ ] NextAuth Secret
- [ ] Google OAuth (optional)
- [ ] Stripe Payment Processing
- [ ] MinIO File Storage
- [ ] Redis Cache
- [ ] Email Service

## 🗄️ Database Setup (PostgreSQL)

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL (Windows)
# Download from: https://www.postgresql.org/download/windows/

# Create database and user
psql -U postgres
CREATE DATABASE deelbreaker_db;
CREATE USER deelbreaker_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE deelbreaker_db TO deelbreaker_user;
\q
```

### Option 2: Cloud Database (Recommended for Production)
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **Railway**: https://railway.app (Simple deployment)
- **AWS RDS**: https://aws.amazon.com/rds/

**Update .env.local:**
```env
DATABASE_URL="postgresql://deelbreaker_user:your_secure_password@localhost:5432/deelbreaker_db"
```

## 🔐 NextAuth Configuration

### Generate NextAuth Secret
```bash
# Generate a secure secret (32+ characters)
openssl rand -base64 32
```

**Update .env.local:**
```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

**Update .env.local:**
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 💳 Stripe Payment Setup

1. Create account at [Stripe](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhooks at Dashboard → Developers → Webhooks
4. Add endpoint: `http://localhost:3000/api/webhooks/stripe`

**Update .env.local:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

## 📁 MinIO File Storage Setup

### Option 1: Local MinIO Server
```bash
# Download MinIO for Windows
# https://min.io/download

# Start MinIO server
minio.exe server C:\minio-data --console-address ":9001"

# Access console at: http://localhost:9001
# Default credentials: minioadmin / minioadmin
```

### Option 2: MinIO Cloud
- Sign up at [MinIO Cloud](https://min.io/cloud)
- Create a bucket named `deelbreaker-uploads`

**Update .env.local:**
```env
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_BUCKET_NAME="deelbreaker-uploads"
```

## 🚀 Redis Cache Setup

### Option 1: Local Redis (Windows)
```bash
# Install Redis using WSL or Docker
docker run -d -p 6379:6379 redis:alpine
```

### Option 2: Cloud Redis
- **Upstash**: https://upstash.com (Serverless Redis)
- **Redis Cloud**: https://redis.com/cloud/
- **AWS ElastiCache**: https://aws.amazon.com/elasticache/

**Update .env.local:**
```env
REDIS_URL="redis://localhost:6379"
```

## 📧 Email Service Setup

### Option 1: Gmail SMTP
1. Enable 2-factor authentication on Gmail
2. Generate App Password: Account → Security → App passwords
3. Use the generated password (not your Gmail password)

**Update .env.local:**
```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@deelbreaker.com"
```

### Option 2: SendGrid (Recommended for Production)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create API key with Mail Send permissions
3. Verify sender identity

**Update .env.local:**
```env
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
```

## 🤖 Optional Services

### OpenAI (for AI features)
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)

```env
OPENAI_API_KEY="sk-your-openai-api-key"
```

### Google Maps (for location features)
1. Enable Maps JavaScript API in Google Cloud Console
2. Create API key with Maps restrictions

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

## 🔧 Development vs Production

### Development (.env.local)
```env
NODE_ENV="development"
DEBUG=true
TEST_MODE=true
NEXTAUTH_URL="http://localhost:3000"
```

### Production (.env.production)
```env
NODE_ENV="production"
DEBUG=false
TEST_MODE=false
NEXTAUTH_URL="https://yourdomain.com"
```

## 🚀 Quick Setup Commands

After configuring your .env.local file:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Set up database
npm run db:push

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

## 🔒 Security Best Practices

1. **Never commit .env.local** to version control
2. **Use strong passwords** for all services
3. **Rotate secrets regularly** in production
4. **Use different credentials** for development/production
5. **Enable 2FA** on all service accounts
6. **Monitor API usage** and set up alerts

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -U deelbreaker_user -d deelbreaker_db
```

### Prisma Issues
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### MinIO Connection Issues
```bash
# Test MinIO connection
curl http://localhost:9000/minio/health/live
```

## 📞 Support

If you encounter issues:
1. Check the [troubleshooting section](#troubleshooting)
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check the application logs for specific error messages

---

**Next Steps:** Once your environment is configured, run `npm run db:setup` to initialize the database and start developing! 🎉