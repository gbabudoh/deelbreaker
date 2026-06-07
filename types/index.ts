// Global type definitions for Deelbreaker

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  address?: string
  avatar?: string
  level: string
  totalSavings: number
  joinedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface Merchant {
  id: string
  name: string
  email: string
  logo?: string
  description?: string
  website?: string
  businessType?: string
  taxId?: string
  address?: string
  phone?: string
  commissionRate: number
  tier: string
  verified: boolean
  totalRevenue: number
  totalCustomers: number
  avgRating: number
  createdAt: Date
  updatedAt: Date
}

export interface Deal {
  id: string
  title: string
  description: string
  category: string
  originalPrice: number
  currentPrice: number
  discount: number
  type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
  images: string[]
  features: string[]
  terms?: string
  startDate?: Date
  endDate?: Date
  duration?: number
  merchantId: string
  merchant?: Merchant
  verified: boolean
  featured: boolean
  trending: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user?: User
  dealId: string
  deal?: Deal
  merchantId: string
  merchant?: Merchant
  quantity: number
  unitPrice: number
  totalPrice: number
  discount: number
  status: 'PENDING' | 'PENDING_SHIPMENT' | 'PENDING_REDEMPTION' | 'SHIPPED' | 'SHIPPED_LATE' | 'DELIVERED' | 'REDEEMED' | 'CANCELLED' | 'REFUNDED' | 'CANCELLED_EXPIRED_REFUNDED'
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
  shippingAddress?: string
  trackingNumber?: string
  trackingCarrier?: string
  voucherCode?: string
  stripeSessionId?: string
  stripeChargeId?: string
  amountPaid: number
  deadlineDate?: Date
  shippedAt?: Date
  cashbackAmount?: number
  cashbackStatus: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'
  orderDate: Date
  shippedDate?: Date
  deliveredDate?: Date
  createdAt: Date
  updatedAt: Date
}

// GroupBuyParticipant removed

export interface Cashback {
  id: string
  userId: string
  user?: User
  amount: number
  source: string
  type: 'ORDER' | 'REFERRAL' | 'BONUS'
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'
  description?: string
  processedAt?: Date
  paidOut: boolean
  paidOutAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  userId: string
  user?: User
  dealId?: string
  deal?: Deal
  merchantId?: string
  merchant?: Merchant
  rating: number
  title?: string
  content: string
  verified: boolean
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface SavedDeal {
  id: string
  userId: string
  user?: User
  dealId: string
  deal?: Deal
  priceAlert: boolean
  savedAt: Date
}

export interface NotificationSettings {
  id: string
  userId: string
  deals: boolean
  payouts: boolean
  priceDrops: boolean
  marketing: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PrivacySettings {
  id: string
  userId: string
  profileVisible: boolean
  shareActivity: boolean
  dataCollection: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Filter and Search Types
export interface DealFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  type?: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
  status?: string
  featured?: boolean
  trending?: boolean
  search?: string
}

export interface OrderFilters {
  status?: string
  paymentStatus?: string
  dateFrom?: Date
  dateTo?: Date
}

// Analytics Types
export interface DealMetrics {
  dealId: string
  title: string
  views: number
  clicks: number
  saves: number
  purchases: number
  totalRevenue: number
  avgRating: number
  reviewCount: number
  conversionRate: number
}

export interface UserAnalytics {
  userId: string
  name?: string
  email: string
  totalOrders: number
  totalSpent: number
  totalCashback: number
  savedDeals: number
  reviewsSubmitted: number
  level: string
  totalSavings: number
  joinedAt: Date
}

export interface PlatformAnalytics {
  totalUsers: number
  totalMerchants: number
  totalDeals: number
  totalOrders: number
  totalRevenue: number
  totalCashbackIssued: number
  totalCashbackPaid: number
  avgOrderValue: number
}

// Payment Types
export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
  orderId: string
  amount: number
  currency: string
}

export interface RefundRequest {
  orderId: string
  amount?: number
  reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
}

// WebSocket Event Types
export interface WebSocketEvents {
  'deal-updated': Deal
  'price-updated': {
    dealId: string
    oldPrice: number
    newPrice: number
  }
  'notification': {
    id: string
    type: string
    title: string
    message: string
    data?: any
  }
}

// Form Types
export interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  userType: 'user' | 'merchant'
  businessName?: string
  businessType?: string
  website?: string
}

export interface SignInFormData {
  email: string
  password: string
  userType: 'user' | 'merchant'
}

export interface DealFormData {
  title: string
  description: string
  category: string
  originalPrice: number
  currentPrice: number
  discount: number
  type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
  images: string[]
  features: string[]
  terms?: string
  startDate?: Date
  endDate?: Date
  duration?: number
}

// Utility Types
export type UserType = 'user' | 'merchant' | 'admin'
export type DealType = 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
export type DealStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'
export type OrderStatus = 'PENDING' | 'PENDING_SHIPMENT' | 'PENDING_REDEMPTION' | 'SHIPPED' | 'SHIPPED_LATE' | 'DELIVERED' | 'REDEEMED' | 'CANCELLED' | 'REFUNDED' | 'CANCELLED_EXPIRED_REFUNDED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'
export type CashbackStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'
export type CashbackType = 'ORDER' | 'REFERRAL' | 'BONUS'