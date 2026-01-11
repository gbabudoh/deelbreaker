// Component-specific types and props

import { ReactNode } from 'react'
import { Deal, User, Merchant, Order, Review } from './index'

// Layout component props
export interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

// Header component props
export interface HeaderProps {
  user?: User | null
  onSignOut?: () => void
}

// Deal component props
export interface DealCardProps {
  deal: Deal
  onSave?: (dealId: string) => void
  onShare?: (dealId: string) => void
  onJoinGroupBuy?: (dealId: string) => void
  showActions?: boolean
  compact?: boolean
}

export interface DealListProps {
  deals: Deal[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  emptyMessage?: string
}

export interface DealFiltersProps {
  filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    minDiscount?: number
    type?: 'GROUP_BUY' | 'INSTANT'
    featured?: boolean
    trending?: boolean
  }
  onFiltersChange: (filters: any) => void
  categories: string[]
  priceRange: { min: number; max: number }
}

// Payment component props
export interface CheckoutFormProps {
  dealId: string
  dealTitle: string
  quantity: number
  unitPrice: number
  discount: number
  onSuccess?: (orderId: string) => void
  onError?: (error: string) => void
}

export interface PaymentStatusProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  amount: number
  orderNumber: string
  timestamp?: Date
}

// Dashboard component props
export interface DashboardStatsProps {
  stats: {
    totalOrders: number
    totalSpent: number
    totalSavings: number
    totalCashback: number
    level: string
  }
}

export interface OrderHistoryProps {
  orders: Order[]
  loading?: boolean
  onViewOrder?: (orderId: string) => void
  onReorder?: (orderId: string) => void
  onRequestRefund?: (orderId: string) => void
}

export interface SavedDealsProps {
  deals: Deal[]
  loading?: boolean
  onRemove?: (dealId: string) => void
  onViewDeal?: (dealId: string) => void
}

// Merchant component props
export interface MerchantDashboardProps {
  merchant: Merchant
  stats: {
    totalDeals: number
    activeDeals: number
    totalRevenue: number
    totalCustomers: number
    avgRating: number
  }
}

export interface DealManagementProps {
  deals: Deal[]
  onCreateDeal?: () => void
  onEditDeal?: (dealId: string) => void
  onDeleteDeal?: (dealId: string) => void
  onToggleStatus?: (dealId: string, status: string) => void
}

export interface CreateDealFormProps {
  onSubmit: (dealData: any) => void
  onCancel: () => void
  initialData?: Partial<Deal>
  loading?: boolean
}

// Admin component props
export interface AdminStatsProps {
  stats: {
    totalUsers: number
    totalMerchants: number
    totalDeals: number
    totalRevenue: number
    totalOrders: number
    flaggedDeals: number
  }
}

export interface DealModerationProps {
  deals: Deal[]
  onApprove?: (dealId: string) => void
  onReject?: (dealId: string, reason: string) => void
  onFlag?: (dealId: string, reason: string) => void
}

export interface UserManagementProps {
  users: User[]
  onSuspend?: (userId: string, reason: string) => void
  onBan?: (userId: string, reason: string) => void
  onRestore?: (userId: string) => void
}

// Review component props
export interface ReviewSectionProps {
  dealId?: string
  merchantId?: string
  reviews: Review[]
  canReview?: boolean
  onSubmitReview?: (reviewData: any) => void
  onHelpfulVote?: (reviewId: string) => void
}

export interface ReviewFormProps {
  dealId?: string
  merchantId?: string
  onSubmit: (reviewData: any) => void
  onCancel: () => void
  loading?: boolean
}

export interface ReviewCardProps {
  review: Review
  onHelpfulVote?: (reviewId: string) => void
  showDeal?: boolean
  showMerchant?: boolean
}

// Form component props
export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  error?: string
  value?: any
  onChange?: (value: any) => void
  options?: { label: string; value: any }[]
  disabled?: boolean
}

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
}

// Notification component props
export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  onClose?: () => void
}

export interface ToastProps extends NotificationProps {
  id: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

// Loading component props
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  count?: number
}

// Search component props
export interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  suggestions?: string[]
  loading?: boolean
}

export interface SearchResultsProps {
  query: string
  results: Deal[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

// Navigation component props
export interface BreadcrumbProps {
  items: { label: string; href?: string }[]
  separator?: ReactNode
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
}

// Chart component props (for analytics)
export interface ChartProps {
  data: any[]
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  title?: string
  height?: number
  options?: any
}

// Image component props
export interface ImageUploadProps {
  onUpload: (file: File) => void
  onRemove?: () => void
  currentImage?: string
  accept?: string
  maxSize?: number
  multiple?: boolean
  loading?: boolean
}

export interface ImageGalleryProps {
  images: string[]
  onImageClick?: (index: number) => void
  showThumbnails?: boolean
  autoPlay?: boolean
  interval?: number
}

// Social sharing props
export interface SocialShareProps {
  url: string
  title: string
  description?: string
  image?: string
  platforms?: ('facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email')[]
}

// Animation props
export interface AnimationProps {
  children: ReactNode
  type?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn'
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  delay?: number
  once?: boolean
}