// API-specific types and interfaces

// @ts-ignore - Module resolution issue
import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore - Module resolution issue
import { Session } from 'next-auth'

// Extended API request with session
export interface AuthenticatedApiRequest extends NextApiRequest {
  session?: Session
}

// Standard API response wrapper
export interface StandardApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// Paginated API response
export interface PaginatedApiResponse<T> extends StandardApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// API Error types
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp: string
}

// Request validation schemas
export interface CreateDealRequest {
  title: string
  description: string
  category: string
  originalPrice: number
  currentPrice: number
  discount: number
  type: 'GROUP_BUY' | 'INSTANT'
  targetParticipants?: number
  minParticipants?: number
  cashbackAmount?: number
  cashbackPercentage?: number
  images: string[]
  features: string[]
  terms?: string
  startDate?: string
  endDate?: string
  duration?: number
}

export interface UpdateDealRequest extends Partial<CreateDealRequest> {
  id: string
}

export interface CreateOrderRequest {
  dealId: string
  quantity: number
  shippingAddress?: string
}

export interface JoinGroupBuyRequest {
  dealId: string
  quantity: number
}

export interface CreateReviewRequest {
  dealId?: string
  merchantId?: string
  rating: number
  title?: string
  content: string
}

export interface UpdateUserProfileRequest {
  name?: string
  phone?: string
  address?: string
  avatar?: string
}

export interface UpdateNotificationSettingsRequest {
  deals?: boolean
  groupBuys?: boolean
  priceDrops?: boolean
  marketing?: boolean
}

export interface UpdatePrivacySettingsRequest {
  profileVisible?: boolean
  shareActivity?: boolean
  dataCollection?: boolean
}

// Payment-related types
export interface CreatePaymentIntentRequest {
  dealId: string
  quantity: number
  type: 'instant' | 'group_buy'
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
  orderId: string
  amount: number
  currency: string
}

export interface ProcessRefundRequest {
  orderId: string
  amount?: number
  reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
}

export interface ProcessRefundResponse {
  success: boolean
  refundId: string
  amount: number
  status: string
}

// Analytics request/response types
export interface AnalyticsEventRequest {
  userId?: string
  eventType: string
  eventData: Record<string, any>
  sessionId?: string
  userAgent?: string
  ipAddress?: string
}

export interface DealMetricsResponse {
  dealId: string
  title: string
  views: number
  clicks: number
  saves: number
  purchases: number
  totalRevenue: number
  avgRating: number
  reviewCount: number
  groupBuyParticipants: number
  conversionRate: number
}

export interface UserAnalyticsResponse {
  userId: string
  name?: string
  email: string
  totalOrders: number
  totalSpent: number
  totalCashback: number
  savedDeals: number
  groupBuysJoined: number
  reviewsSubmitted: number
  level: string
  totalSavings: number
  joinedAt: Date
}

// Email request types
export interface SendDealAlertRequest {
  email: string
  userName: string
  dealTitle: string
  dealDescription: string
  discount: number
  dealUrl: string
}

export interface SendOrderConfirmationRequest {
  email: string
  userName: string
  orderNumber: string
  dealTitle: string
  quantity: number
  totalPrice: number
  discount: number
}

export interface SendCashbackNotificationRequest {
  email: string
  userName: string
  cashbackAmount: number
  totalCashback: number
}

export interface SendGroupBuyUpdateRequest {
  email: string
  userName: string
  dealTitle: string
  currentParticipants: number
  targetParticipants: number
  currentPrice: number
  originalPrice: number
}

export interface SendPasswordResetRequest {
  email: string
  resetLink: string
}

// Admin-specific types
export interface AdminStatsResponse {
  totalUsers: number
  totalMerchants: number
  totalDeals: number
  totalRevenue: number
  totalOrders: number
  flaggedDeals: number
}

export interface ModerateDealRequest {
  dealId: string
  action: 'approve' | 'reject' | 'flag'
  reason?: string
}

export interface ManageUserRequest {
  userId: string
  action: 'suspend' | 'ban' | 'restore'
  reason?: string
}

// WebSocket message types
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

export interface JoinRoomMessage {
  type: 'join-deal' | 'join-user'
  roomId: string
}

export interface LeaveRoomMessage {
  type: 'leave-deal'
  roomId: string
}

// File upload types
export interface FileUploadRequest {
  file: File
  type: 'avatar' | 'deal-image' | 'merchant-logo'
}

export interface FileUploadResponse {
  success: boolean
  url: string
  filename: string
  size: number
}

// Search and filter types
export interface SearchDealsRequest {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minDiscount?: number
  type?: 'GROUP_BUY' | 'INSTANT'
  status?: string
  featured?: boolean
  trending?: boolean
  page?: number
  limit?: number
  sortBy?: 'price' | 'discount' | 'rating' | 'popularity' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchDealsResponse extends PaginatedApiResponse<any> {
  filters: {
    categories: string[]
    priceRange: { min: number; max: number }
    discountRange: { min: number; max: number }
  }
}