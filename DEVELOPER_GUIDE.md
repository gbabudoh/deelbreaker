# Deelbreaker Developer Guide

Quick reference for developers working on the Deelbreaker platform.

## Project Structure

```
deelbreaker/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── deals/             # Deal management
│   │   ├── payments/          # Payment processing
│   │   ├── emails/            # Email sending
│   │   ├── analytics/         # Analytics tracking
│   │   ├── orders/            # Order management
│   │   └── admin/             # Admin endpoints
│   ├── components/            # React components
│   │   ├── payments/          # Payment UI
│   │   ├── deals/             # Deal components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── merchant/          # Merchant components
│   │   └── admin/             # Admin components
│   ├── auth/                  # Auth pages
│   ├── dashboard/             # User dashboard
│   ├── deals/                 # Deal discovery
│   ├── merchant/              # Merchant portal
│   ├── admin/                 # Admin dashboard
│   ├── group-buy/             # Group buy pages
│   ├── welcome/               # Onboarding
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── auth-helpers.ts        # Auth utilities
│   ├── stripe.ts              # Stripe integration
│   ├── email.ts               # Email templates
│   ├── analytics.ts           # Analytics tracking
│   ├── prisma.ts              # Prisma client
│   ├── websocket.ts           # WebSocket setup
│   └── ai-recommendations.ts  # AI recommendations
├── hooks/
│   └── useSocket.ts           # WebSocket hook
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── scripts/
│   ├── create-database.ts     # Database creation
│   ├── test-db-connection.ts  # Connection testing
│   ├── verify-migration.ts    # Migration verification
│   ├── setup-db.ps1           # Database setup script
│   └── validate-env.js        # Environment validation
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions workflow
├── .env.local                 # Environment variables
├── .env.example               # Example env file
├── vercel.json                # Vercel configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
└── README.md                  # Project documentation
```

## Getting Started

### 1. Setup

```bash
# Clone repository
git clone https://github.com/yourusername/deelbreaker.git
cd deelbreaker

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### 2. Development

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### 3. Database

```bash
# Create database
npm run db:create

# Test connection
npm run db:test

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Verify migration
npm run db:verify
```

## Key Technologies

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Email**: Nodemailer
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide Icons
- **Validation**: Zod
- **Storage**: MinIO

## Common Tasks

### Adding a New API Endpoint

```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, createUnauthorizedResponse } from '@/lib/auth-helpers'
import { z } from 'zod'

const schema = z.object({
  // Define your schema
})

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return createUnauthorizedResponse()

    const body = await request.json()
    const data = schema.parse(body)

    // Your logic here

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### Adding a New Database Model

```prisma
// prisma/schema.prisma
model YourModel {
  id        String   @id @default(cuid())
  name      String
  
  // Relations
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("your_models")
}
```

Then run:
```bash
npm run db:migrate
npm run db:push
```

### Adding a New Component

```typescript
// app/components/YourComponent.tsx
'use client'

import { motion } from 'framer-motion'

interface YourComponentProps {
  title: string
  // Add your props
}

export function YourComponent({ title }: YourComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="your-classes"
    >
      {title}
    </motion.div>
  )
}
```

### Sending an Email

```typescript
import { sendOrderConfirmationEmail } from '@/lib/email'

await sendOrderConfirmationEmail(
  'user@example.com',
  'John Doe',
  'ORD-123456',
  'Deal Title',
  1,
  99.99,
  10.00
)
```

### Tracking Analytics

```typescript
import { trackDealPurchase } from '@/lib/analytics'

await trackDealPurchase(userId, dealId, amount)
```

### Processing Payment

```typescript
import { createPaymentIntent } from '@/lib/stripe'

const result = await createPaymentIntent(
  99.99,
  'usd',
  { dealId, userId, quantity: '1' }
)

if (result.success) {
  // Use result.clientSecret for frontend
}
```

## Authentication

### Getting Current User

```typescript
import { getAuthenticatedUser } from '@/lib/auth-helpers'

const user = await getAuthenticatedUser()
if (!user) {
  return createUnauthorizedResponse()
}
```

### Protecting Routes

```typescript
// middleware.ts handles route protection
// Protected routes: /dashboard, /merchant, /admin, /api/*
```

### OAuth Providers

Configured in `lib/auth.ts`:
- Google
- Microsoft Azure AD
- Apple
- Email/Password

## Database Queries

### Using Prisma

```typescript
import { prisma } from '@/lib/prisma'

// Create
const user = await prisma.user.create({
  data: { email, name }
})

// Read
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// Update
await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' }
})

// Delete
await prisma.user.delete({
  where: { id: userId }
})

// List with filtering
const deals = await prisma.deal.findMany({
  where: { status: 'ACTIVE' },
  include: { merchant: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
})
```

## Error Handling

### API Errors

```typescript
// Validation error
if (error instanceof z.ZodError) {
  return NextResponse.json(
    { error: error.errors[0].message },
    { status: 400 }
  )
}

// Not found
return NextResponse.json(
  { error: 'Resource not found' },
  { status: 404 }
)

// Unauthorized
return NextResponse.json(
  { error: 'Unauthorized' },
  { status: 403 }
)

// Server error
return NextResponse.json(
  { error: 'Internal server error' },
  { status: 500 }
)
```

## Environment Variables

### Required for Development

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
```

### Optional

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost
MINIO_ACCESS_KEY=...
MINIO_SECRET_KEY=...
```

## Testing

### Manual Testing

1. **Payment Flow**
   - Use Stripe test cards
   - Check webhook logs
   - Verify order creation

2. **Email Delivery**
   - Check email service logs
   - Verify email templates
   - Test with different providers

3. **Authentication**
   - Test OAuth providers
   - Test email/password login
   - Test session persistence

### Automated Testing

```bash
# Run tests (when configured)
npm test

# Run tests in watch mode
npm test -- --watch
```

## Deployment

### Vercel

```bash
# Deploy to Vercel
vercel deploy

# Deploy to production
vercel deploy --prod
```

### AWS

See `DEPLOYMENT_COMPLETE.md` for detailed AWS deployment instructions.

## Performance Tips

1. **Database Queries**
   - Use `include` for relations
   - Use `select` to limit fields
   - Add indexes for frequently queried fields

2. **Caching**
   - Use Redis for session caching
   - Cache deal listings
   - Cache user preferences

3. **Images**
   - Use Next.js Image component
   - Optimize with Cloudinary
   - Use WebP format

4. **API Optimization**
   - Implement pagination
   - Use compression
   - Add rate limiting

## Security Checklist

- [ ] Never commit `.env.local`
- [ ] Use strong secrets
- [ ] Validate all inputs
- [ ] Check authorization on all endpoints
- [ ] Use HTTPS in production
- [ ] Enable CORS properly
- [ ] Sanitize user input
- [ ] Log security events
- [ ] Monitor for suspicious activity

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## Getting Help

1. Check existing documentation
2. Search GitHub issues
3. Check error logs
4. Ask in team chat
5. Create GitHub issue with details

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Add comments for complex logic
- Use meaningful variable names
- Keep functions small and focused

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request
# Wait for review and merge
```

## Troubleshooting

### Build Errors

```bash
# Clear cache
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
```

### Payment Issues

```bash
# Check Stripe keys
echo $STRIPE_SECRET_KEY

# Test webhook locally
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### Email Issues

```bash
# Check email configuration
# Verify SMTP credentials
# Check spam folder
# Enable less secure apps (Gmail)
```

## Contact

- **Email**: support@deelbreaker.com
- **Documentation**: https://docs.deelbreaker.com
- **GitHub**: https://github.com/yourusername/deelbreaker
