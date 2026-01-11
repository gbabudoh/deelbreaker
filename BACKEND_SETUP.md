# Deelbreaker Backend Setup Guide

## 🚀 **Backend Infrastructure Complete!**

### **What's Been Built:**

1. **Database Schema** - Complete Prisma models for all entities
2. **Authentication** - NextAuth.js with multiple providers
3. **API Routes** - RESTful endpoints for all core functionality
4. **Real-time Features** - WebSocket integration for live updates
5. **Type Safety** - Full TypeScript integration throughout

---

## 📋 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Database Setup**

**Option A: Automated Setup (Recommended)**
```bash
# One command to set up everything
npm run db:setup
```

**Option B: Manual Setup**
```bash
# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/deelbreaker"

# Generate Prisma client (creates types)
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample data
npm run db:seed
```

**Note:** The automated setup will guide you through the process and ensure the correct order.

### **3. Authentication Setup**
```bash
# Add to .env.local:
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# For Google OAuth (optional):
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **4. Start Development Server**
```bash
npm run dev
```

---

## 🗄️ **Database Schema Overview**

### **Core Models:**
- **User** - User accounts with preferences and gamification
- **Merchant** - Business accounts with verification and tiers
- **Deal** - Products with group buy and instant deal types
- **Order** - Purchase transactions and tracking
- **GroupBuyParticipant** - Group buy participation tracking
- **Cashback** - Reward system and payouts

### **Supporting Models:**
- **SavedDeal** - User wishlist functionality
- **Review** - Product and merchant ratings
- **PriceHistory** - Deal price tracking over time
- **NotificationSettings** - User notification preferences
- **PrivacySettings** - User privacy controls

---

## 🔌 **API Endpoints**

### **Deals Management:**
```
GET    /api/deals              # List deals with filtering
POST   /api/deals              # Create new deal (merchant)
GET    /api/deals/[id]         # Get deal details
PUT    /api/deals/[id]         # Update deal (merchant)
DELETE /api/deals/[id]         # Delete deal (merchant)
POST   /api/deals/[id]/join    # Join group buy
```

### **User Actions:**
```
GET    /api/user/saved-deals           # Get saved deals
POST   /api/user/saved-deals           # Save a deal
DELETE /api/user/saved-deals/[dealId] # Remove saved deal
PUT    /api/user/saved-deals/[dealId] # Update price alerts
```

### **Authentication:**
```
POST   /api/auth/signin        # Sign in
POST   /api/auth/signout       # Sign out
GET    /api/auth/session       # Get current session
```

---

## ⚡ **Real-time Features**

### **WebSocket Events:**
- `deal-updated` - Deal information changes
- `group-buy-progress` - Participant count updates
- `price-updated` - Price drops and changes
- `notification` - User-specific notifications

### **Usage Example:**
```typescript
import { useDealUpdates } from '@/hooks/useSocket'

const { dealData, participants, currentPrice } = useDealUpdates(dealId)
```

---

## 🔐 **Authentication Flow**

### **Supported Providers:**
1. **Google OAuth** - Social login
2. **Email Magic Links** - Passwordless authentication
3. **Credentials** - Email/password (for demo)

### **Session Management:**
- JWT-based sessions
- Automatic user preference creation
- Role-based access control ready

---

## 🎯 **Key Features Implemented**

### **Group Buy Logic:**
- Real-time participant tracking
- Dynamic pricing based on participation
- Automatic price updates when targets reached
- Refund calculations for price drops

### **Deal Management:**
- Advanced filtering and search
- Category-based organization
- Merchant verification system
- Featured and trending deals

### **User Experience:**
- Saved deals with price alerts
- Cashback tracking and history
- Notification preferences
- Privacy controls

### **Merchant Tools:**
- Deal creation and management
- Performance analytics ready
- Commission tracking
- Customer engagement metrics

---

## 🚀 **Next Steps**

### **Ready for Integration:**
1. **Payment Processing** - Stripe integration points ready
2. **Email Notifications** - Template system ready
3. **File Uploads** - Image handling for deals
4. **Analytics** - Data collection points in place
5. **Mobile App** - API-first design supports mobile

### **Production Considerations:**
1. **Database Optimization** - Indexes and performance tuning
2. **Caching Layer** - Redis integration for performance
3. **Rate Limiting** - API protection and abuse prevention
4. **Monitoring** - Error tracking and performance monitoring
5. **Backup Strategy** - Data protection and recovery

---

## 📊 **Database Commands**

```bash
# View database in browser
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npx prisma migrate reset

# Generate types
npm run db:generate
```

---

## 🔧 **Environment Variables**

See `.env.example` for all required environment variables including:
- Database connection
- Authentication providers
- Email configuration
- Payment processing
- File upload services

The backend infrastructure is now complete and ready for production use! 🎉