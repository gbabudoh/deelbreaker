'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Star,
  Shield,
  Share2,
  Heart,
  ArrowLeft,
  CheckCircle,
  Package,
  MapPin,
  Laptop,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
  ShoppingCart,
  ChevronRight,
  BadgeCheck
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { useCart } from '@/lib/cart-context'
import { trackDealView, trackAnalyticsEvent } from '@/app/actions/merchant-actions'

interface Review {
  id: string
  rating: number
  title?: string
  content: string
  createdAt: string
  user: {
    name: string | null
    avatar: string | null
  }
}

interface Deal {
  id: string
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
  startDate?: string
  endDate?: string
  merchantId: string
  merchant: {
    id: string
    name: string
    logo: string | null
    verified: boolean
    avgRating: number
    description: string | null
  }
  reviews: Review[]
}

interface DealDetailsClientProps {
  deal: Deal
}

export default function DealDetailsClient({ deal }: DealDetailsClientProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isSaved, setIsSaved] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)

  // Timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)

  // Track view on load
  useEffect(() => {
    let country = 'Global'
    if (typeof window !== 'undefined' && navigator.language) {
      const parts = navigator.language.split('-')
      if (parts.length > 1) {
        country = parts[1].toUpperCase()
      }
    }
    trackDealView(deal.id, 'client-ip-mock', country)
  }, [deal.id])

  // Countdown timer calculations
  useEffect(() => {
    if (!deal.endDate) return

    const calculateTimeLeft = () => {
      const difference = new Date(deal.endDate!).getTime() - new Date().getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [deal.endDate])

  const dealImages = deal.images.length > 0 ? deal.images : ['/api/placeholder/600/400']
  // Always show 5 thumbnail slots — cycles through available images if fewer than 5
  const thumbnailImages = Array.from({ length: 5 }, (_, i) => dealImages[i % dealImages.length])
  const discountAmount = deal.originalPrice - deal.currentPrice
  const averageRating = deal.merchant.avgRating || 4.5

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCheckout = () => {
    let country = 'Global'
    if (typeof window !== 'undefined' && navigator.language) {
      const parts = navigator.language.split('-')
      if (parts.length > 1) {
        country = parts[1].toUpperCase()
      }
    }
    trackAnalyticsEvent(deal.id, 'CHECKOUT_START', null, country, 'client-ip-mock')
    router.push(`/checkout/${deal.id}?quantity=${quantity}`)
  }

  const handleAddToCart = () => {
    addToCart({
      id: deal.id,
      title: deal.title,
      merchant: deal.merchant.name,
      currentPrice: deal.currentPrice,
      originalPrice: deal.originalPrice,
      discount: deal.discount,
      image: dealImages[0],
      type: deal.type,
    })
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 2000)
  }

  const getFulfillmentInfo = () => {
    switch (deal.type) {
      case 'PHYSICAL_PRODUCT':
        return {
          icon: <Package className="w-5 h-5 text-[#F3AF7B]" />,
          title: 'Physical Product Delivery',
          desc: 'Shipped within 3-5 working days. Returns automatically initiated if unfulfilled past the deadline.'
        }
      case 'LOCAL_SERVICE':
        return {
          icon: <MapPin className="w-5 h-5 text-emerald-500" />,
          title: 'Local Service Voucher',
          desc: 'Instant secure voucher and QR Code. Payout is held in escrow until redeemed at the merchant location.'
        }
      case 'DIGITAL_SOFTWARE':
        return {
          icon: <Laptop className="w-5 h-5 text-[#F3AF7B]" />,
          title: 'Instant Software Delivery',
          desc: 'Voucher and license credentials delivered instantly to your profile. Payout released upon purchase.'
        }
    }
  }

  const fulfillment = getFulfillmentInfo()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 lg:pt-20">
        <div className="container mx-auto max-w-7xl px-4 lg:px-6 py-6 lg:py-10">

          {/* Breadcrumb + actions bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-1.5 text-sm text-gray-400 min-w-0">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-semibold transition-colors group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <Link href="/" className="hover:text-gray-700 transition-colors shrink-0">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-gray-600 font-medium truncate max-w-40 lg:max-w-none">{deal.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 hidden sm:block" />
              <span className="text-gray-900 font-semibold truncate max-w-40 hidden sm:block">{deal.title}</span>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 relative flex items-center justify-center"
                title="Copy link to clipboard"
              >
                <Share2 className="w-4.5 h-4.5" />
                <AnimatePresence>
                  {copiedLink && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -44, scale: 1 }}
                      exit={{ opacity: 0, y: -54, scale: 0.8 }}
                      className="absolute bg-gray-950 text-white text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap shadow-lg"
                    >
                      Link copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => {
                  const nextState = !isSaved
                  setIsSaved(nextState)
                  if (nextState) {
                    let country = 'Global'
                    if (typeof window !== 'undefined' && navigator.language) {
                      const parts = navigator.language.split('-')
                      if (parts.length > 1) {
                        country = parts[1].toUpperCase()
                      }
                    }
                    trackAnalyticsEvent(deal.id, 'SAVE', null, country, 'client-ip-mock')
                  }
                }}
                className={`p-2.5 bg-white border rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  isSaved ? 'text-red-500 bg-red-50 border-red-100' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* ── Main product grid ── */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-start">

            {/* Left: Image gallery */}
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-28 flex gap-3">

                {/* Vertical thumbnail strip */}
                <div className="flex flex-col gap-2.5 w-[72px] shrink-0">
                  {thumbnailImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all bg-white shrink-0 ${
                        selectedImage === idx
                          ? 'border-[#F3AF7B] shadow-md ring-1 ring-[#F3AF7B]/30'
                          : 'border-gray-200 hover:border-[#F3AF7B]/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main image */}
                <div className="flex-1 relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm min-w-0">
                  <img
                    key={selectedImage}
                    src={thumbnailImages[selectedImage] ?? dealImages[0]}
                    alt={deal.title}
                    className="w-full h-full object-cover transition-opacity duration-200"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {deal.merchant.verified && (
                      <div className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Merchant
                      </div>
                    )}
                    <div className="bg-gray-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                      {deal.category}
                    </div>
                  </div>

                  {/* Discount badge */}
                  <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-extrabold shadow-md">
                    {deal.discount}% OFF
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Details panel */}
            <div className="lg:col-span-5 space-y-5">

              {/* Type + title */}
              <div>
                <span className="text-xs text-[#F3AF7B] font-bold uppercase tracking-widest">
                  {deal.type.replace(/_/g, ' ')}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1 mb-3 leading-tight">
                  {deal.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-[#F3AF7B] text-[#F3AF7B]' : 'text-gray-200'}`}
                      />
                    ))}
                    <span className="text-sm font-bold text-gray-800 ml-1">{averageRating}</span>
                  </div>
                  <span className="text-sm text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{deal.reviews.length} review{deal.reviews.length !== 1 ? 's' : ''}</span>
                  <span className="text-sm text-gray-400">·</span>
                  <span className="text-sm font-semibold text-gray-700">{deal.merchant.name}</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Price</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl font-extrabold text-gray-900">${deal.currentPrice.toFixed(2)}</span>
                      <span className="text-lg text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold block uppercase tracking-wider">You Save</span>
                    <span className="text-lg font-black">${discountAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              {deal.endDate && !isExpired && (
                <div className="bg-gray-950 text-white rounded-2xl p-5 relative overflow-hidden border border-white/5">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#F3AF7B]/8 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-[#F3AF7B] animate-pulse" />
                    <span className="text-xs uppercase tracking-widest font-extrabold text-[#F3AF7B]">Deal Ends In</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Days', val: timeLeft.days },
                      { label: 'Hrs', val: timeLeft.hours },
                      { label: 'Mins', val: timeLeft.minutes },
                      { label: 'Secs', val: timeLeft.seconds }
                    ].map((block) => (
                      <div key={block.label} className="text-center">
                        <div className="bg-white/8 rounded-xl py-3 font-mono text-2xl font-black tracking-tight">
                          {block.val.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1.5 block">
                          {block.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isExpired && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Deal Concluded</h4>
                    <p className="text-sm text-amber-700 mt-0.5">This deal has expired. Check out similar deals in discovery.</p>
                  </div>
                </div>
              )}

              {/* Fulfillment */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                  {fulfillment?.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{fulfillment?.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{fulfillment?.desc}</p>
                </div>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: Shield, label: 'Secure Checkout', color: 'text-emerald-500' },
                  { icon: Truck, label: 'Fast Delivery', color: 'text-[#F3AF7B]' },
                  { icon: RotateCcw, label: 'Easy Returns', color: 'text-blue-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 shadow-sm">
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                    <span className="text-[11px] text-gray-500 font-semibold leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Quantity + CTAs */}
              {!isExpired && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-[#F3AF7B] transition-colors font-bold text-gray-700 shadow-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900 text-base">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-[#F3AF7B] transition-colors font-bold text-gray-700 shadow-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-4 px-6 rounded-2xl font-black text-base hover:shadow-lg hover:shadow-[#F3AF7B]/25 transition-all duration-200 active:scale-[0.98]"
                  >
                    Buy Now — ${(deal.currentPrice * quantity).toFixed(2)}
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className={`w-full border py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      cartAdded
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#F3AF7B]/50 hover:bg-[#F3AF7B]/5'
                    }`}
                  >
                    {cartAdded ? (
                      <>
                        <CheckCircle className="w-4.5 h-4.5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4.5 h-4.5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom section: Details + Reviews / Merchant sidebar ── */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">

            {/* Left: Product details + reviews */}
            <div className="lg:col-span-2 space-y-6">

              {/* Description + Features + Terms */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-4">Product Details</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{deal.description}</p>

                {deal.features.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-800 text-sm mb-3">What's Included</h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {deal.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-[#F3AF7B] shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {deal.terms && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Terms & Conditions</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{deal.terms}</p>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Customer Reviews</h2>
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 fill-[#F3AF7B] text-[#F3AF7B]" />
                    <span className="font-black text-gray-900 text-sm">{averageRating}</span>
                    <span className="text-gray-400 text-sm">({deal.reviews.length})</span>
                  </div>
                </div>

                {deal.reviews.length === 0 ? (
                  <div className="text-center py-10">
                    <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-sm">No reviews yet for this deal.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {deal.reviews.map((review) => (
                      <div key={review.id} className="py-6 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] overflow-hidden flex items-center justify-center font-bold text-white text-sm shrink-0">
                              {review.user.avatar ? (
                                <img src={review.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                              ) : (
                                (review.user.name || 'C')[0]
                              )}
                            </div>
                            <div>
                              <h5 className="font-bold text-gray-900 text-sm">{review.user.name || 'Anonymous'}</h5>
                              <span className="text-[11px] text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#F3AF7B] text-[#F3AF7B]' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.title && (
                          <h6 className="font-bold text-gray-800 text-sm mb-1">{review.title}</h6>
                        )}
                        <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Merchant card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-5">Sold by</h3>

                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#F3AF7B]/15 to-[#F4C2B8]/15 border border-[#F3AF7B]/20 overflow-hidden flex items-center justify-center font-black text-xl text-[#F3AF7B] shrink-0">
                    {deal.merchant.logo ? (
                      <img src={deal.merchant.logo} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                      deal.merchant.name[0]
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 leading-snug">{deal.merchant.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-[#F3AF7B] text-[#F3AF7B]" />
                      <span className="text-xs font-bold text-gray-700">{averageRating}</span>
                      <span className="text-xs text-gray-400 ml-0.5">rating</span>
                    </div>
                  </div>
                </div>

                {deal.merchant.verified && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-4">
                    <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700">Verified Merchant</span>
                  </div>
                )}

                {deal.merchant.description && (
                  <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {deal.merchant.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
