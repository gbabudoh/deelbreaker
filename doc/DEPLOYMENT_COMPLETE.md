# Deelbreaker Deployment Guide

Complete guide for deploying Deelbreaker to production environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Payment Processing](#payment-processing)
7. [Email Configuration](#email-configuration)
8. [Monitoring & Logging](#monitoring--logging)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Stripe account set up and keys obtained
- [ ] Email service configured (Gmail, SendGrid, etc.)
- [ ] OAuth providers configured (Google, Microsoft, Apple)
- [ ] SSL certificate obtained
- [ ] CDN configured (optional)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up
- [ ] Security audit completed

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Environment Variables

In Vercel project settings, add all environment variables from `.env.local`:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
AZURE_AD_CLIENT_ID=...
AZURE_AD_CLIENT_SECRET=...
AZURE_AD_TENANT_ID=...
REDIS_URL=redis://...
MINIO_ENDPOINT=...
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment at your domain

### Step 4: Configure Custom Domain

1. Go to project settings → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

### Step 5: Set Up Webhooks

1. In Stripe Dashboard, go to Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## AWS Deployment

### Option 1: AWS Amplify

#### Step 1: Connect Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Select GitHub and authorize
4. Select your repository and branch

#### Step 2: Configure Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 3: Add Environment Variables

In Amplify console, add all environment variables from `.env.local`

#### Step 4: Deploy

Click "Save and deploy" to start deployment

### Option 2: AWS EC2 + RDS

#### Step 1: Launch EC2 Instance

```bash
# Launch Ubuntu 22.04 LTS instance
# Instance type: t3.medium or larger
# Security group: Allow ports 80, 443, 3000
```

#### Step 2: Install Dependencies

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL client
sudo apt install -y postgresql-client
```

#### Step 3: Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/yourusername/deelbreaker.git
cd deelbreaker
npm install
```

#### Step 4: Configure Environment

```bash
# Create .env.local
nano .env.local

# Add all environment variables
# Save and exit (Ctrl+X, Y, Enter)
```

#### Step 5: Build Application

```bash
npm run build
```

#### Step 6: Start Application with PM2

```bash
# Start application
pm2 start npm --name "deelbreaker" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

#### Step 7: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/deelbreaker

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/deelbreaker /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 8: Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

#### Step 9: Set Up RDS Database

1. Go to AWS RDS Console
2. Create PostgreSQL database
3. Configure security group to allow EC2 access
4. Update `DATABASE_URL` in `.env.local`
5. Run migrations: `npm run db:push`

## Environment Configuration

### Production Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@rds-endpoint:5432/deelbreaker_prod"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-secure-random-string"

# Stripe (Live Keys)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-specific-password"
EMAIL_FROM="noreply@deelbreaker.com"

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AZURE_AD_CLIENT_ID="..."
AZURE_AD_CLIENT_SECRET="..."
AZURE_AD_TENANT_ID="..."

# Redis
REDIS_URL="redis://your-redis-endpoint:6379"

# MinIO
MINIO_ENDPOINT="your-minio-endpoint"
MINIO_ACCESS_KEY="..."
MINIO_SECRET_KEY="..."

# Node Environment
NODE_ENV="production"
```

## Database Setup

### PostgreSQL on AWS RDS

1. Create RDS instance with PostgreSQL 15
2. Configure security group
3. Update `DATABASE_URL`
4. Run migrations:

```bash
npm run db:push
npm run db:seed
```

### Database Backups

```bash
# Automated backups (AWS RDS)
# - Backup retention: 30 days
# - Backup window: 03:00-04:00 UTC
# - Multi-AZ: Enabled for production

# Manual backup
pg_dump -h your-rds-endpoint -U postgres deelbreaker_prod > backup.sql

# Restore from backup
psql -h your-rds-endpoint -U postgres deelbreaker_prod < backup.sql
```

## Payment Processing

### Stripe Setup

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Configure webhook endpoint: `https://yourdomain.com/api/payments/webhook`
4. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`

### Testing Payments

```bash
# Use Stripe test cards
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
# 3D Secure: 4000 0025 0000 3155

# Test webhook locally
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Email Configuration

### Gmail Setup

1. Enable 2-factor authentication
2. Generate app-specific password
3. Add to environment variables:
   - `EMAIL_SERVER_USER`: your-email@gmail.com
   - `EMAIL_SERVER_PASSWORD`: app-specific-password

### SendGrid Setup

1. Create SendGrid account
2. Get API key
3. Add to environment variables:
   - `SENDGRID_API_KEY`

### Resend Setup

1. Create Resend account
2. Get API key
3. Add to environment variables:
   - `RESEND_API_KEY`

## Monitoring & Logging

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs deelbreaker

# Real-time logs
pm2 logs deelbreaker --lines 100 --follow
```

### Error Tracking (Sentry)

1. Create Sentry account
2. Create project for Next.js
3. Add to environment variables:
   - `SENTRY_DSN`

### Analytics (PostHog)

1. Create PostHog account
2. Get API key
3. Add to environment variables:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`

## Security Best Practices

### HTTPS/SSL

- Always use HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Enable HSTS headers

### Environment Variables

- Never commit `.env.local` to version control
- Use strong, random secrets
- Rotate secrets regularly
- Use AWS Secrets Manager or similar

### Database Security

- Use strong passwords
- Enable encryption at rest
- Enable encryption in transit
- Restrict network access
- Regular backups

### API Security

- Enable rate limiting
- Validate all inputs
- Use CORS properly
- Implement API authentication
- Monitor for suspicious activity

### Payment Security

- Never log sensitive payment data
- Use Stripe for PCI compliance
- Implement webhook signature verification
- Monitor for fraud

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npm run db:test

# Check environment variables
echo $DATABASE_URL

# Verify security group allows access
```

### Payment Processing Issues

```bash
# Check webhook logs
# Verify webhook secret
# Test with Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### Email Delivery Issues

```bash
# Check email configuration
# Verify SMTP credentials
# Check spam folder
# Enable less secure apps (Gmail)
```

### Performance Issues

```bash
# Check database query performance
# Enable query logging
# Use Redis for caching
# Optimize images
# Enable CDN
```

## Support

For deployment issues, contact:
- Email: support@deelbreaker.com
- Documentation: https://docs.deelbreaker.com
- GitHub Issues: https://github.com/yourusername/deelbreaker/issues
