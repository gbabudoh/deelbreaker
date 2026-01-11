# Deelbreaker - The Future of Smart Shopping

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

A revolutionary e-commerce platform that combines AI-powered deal discovery, group buying power, and instant cashback rewards. Built with Next.js 15, TypeScript, and a mobile-first approach.

## 🌟 Features

### For Consumers
- **Group Buy Power** - Unite with others to unlock deeper discounts (up to 70% off)
- **Instant Cashback** - Get immediate rewards on purchases
- **AI-Powered Discovery** - Personalized deal recommendations
- **Real-time Price Tracking** - Alerts when prices drop on saved items
- **Gamified Experience** - Earn XP and unlock exclusive deals

### For Merchants
- **Deal Management** - Create and manage group buys and instant deals
- **Analytics Dashboard** - Track revenue, views, and conversion rates
- **Inventory Management** - Smart demand forecasting
- **Customer Insights** - Understand your audience

### Platform Features
- **Mobile-First Design** - Optimized for all devices
- **Real-time Updates** - WebSocket integration for live data
- **Secure Payments** - Stripe integration
- **Authentication** - NextAuth with multiple providers (Google, Apple, Microsoft)

## 🎨 Design System

Built with a carefully crafted color palette:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#F3AF7B` | CTAs, highlights |
| Secondary | `#DEDEDE` | Backgrounds |
| Accent | `#E2FBEE` | Success states |
| Neutral | `#AEB1AF` | Text, borders |
| Highlight | `#F4C2B8` | Gradients |

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Real-time**: Socket.io

## 📁 Project Structure

```
deelbreaker/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── deals/       # Deal CRUD operations
│   │   ├── orders/      # Order management
│   │   ├── payments/    # Stripe integration
│   │   └── analytics/   # Analytics endpoints
│   ├── auth/            # Auth pages (signin, signup)
│   ├── components/      # React components
│   │   ├── admin/       # Admin components
│   │   ├── dashboard/   # User dashboard components
│   │   ├── deals/       # Deal-related components
│   │   ├── group-buy/   # Group buy components
│   │   ├── merchant/    # Merchant portal components
│   │   └── payments/    # Payment components
│   ├── dashboard/       # User dashboard page
│   ├── deals/           # Deals discovery page
│   ├── group-buy/       # Group buy details
│   ├── merchant/        # Merchant portal
│   └── welcome/         # Onboarding flow
├── lib/                 # Utility libraries
│   ├── auth.ts          # Auth configuration
│   ├── prisma.ts        # Database client
│   ├── stripe.ts        # Payment processing
│   └── analytics.ts     # Analytics helpers
├── prisma/
│   └── schema.prisma    # Database schema
├── types/               # TypeScript definitions
└── scripts/             # Database & setup scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gbabudoh/deelbreaker.git
   cd deelbreaker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following in `.env.local`:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/deelbreaker_db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero banner |
| `/deals` | Browse all deals |
| `/group-buy/[id]` | Group buy details |
| `/dashboard` | User dashboard |
| `/merchant` | Merchant portal |
| `/admin` | Admin dashboard |
| `/auth/signin` | Sign in page |
| `/auth/signup` | Registration page |

## 🔐 Authentication

Supports multiple authentication methods:
- Email/Password
- Google OAuth
- Apple OAuth
- Microsoft (Azure AD)

## 💳 Payment Integration

Stripe integration for:
- One-time payments
- Group buy deposits
- Refunds (automatic on price drops)
- Webhook handling

## 📊 API Endpoints

### Deals
- `GET /api/deals` - List all deals
- `POST /api/deals` - Create a deal
- `GET /api/deals/[id]` - Get deal details
- `POST /api/deals/[id]/join` - Join a group buy

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create an order
- `GET /api/orders/[id]` - Get order details

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Push database changes
npx prisma db push
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Docker

```bash
docker build -t deelbreaker .
docker run -p 3000:3000 deelbreaker
```

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the repository owner for contribution guidelines.

## 📞 Support

For support, please contact the development team.

---

<p align="center">
  Built with ❤️ by the Deelbreaker Team
</p>
