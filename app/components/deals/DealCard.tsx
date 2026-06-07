'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, ShoppingCart, Package, MapPin, Laptop, Check } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

interface Deal {
  id: string | number
  title: string
  merchant: string | { name: string }
  originalPrice: number
  currentPrice: number
  discount: number
  type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
  image?: string
  images?: string[]
  category: string
  rating?: number
  verified?: boolean
}

interface DealCardProps {
  deal: Deal
  viewMode: 'grid' | 'list'
}

export default function DealCard({ deal, viewMode }: DealCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isSaved, setIsSaved] = useState(false)
  const [added, setAdded] = useState(false)

  const merchantName = typeof deal.merchant === 'object' ? deal.merchant.name : deal.merchant
  const dealImage = deal.image || (deal.images && deal.images[0]) || '/api/placeholder/400/300'
  const rating = deal.rating || 4.5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({
      id: deal.id,
      title: deal.title,
      merchant: merchantName,
      currentPrice: deal.currentPrice,
      originalPrice: deal.originalPrice,
      discount: deal.discount,
      image: dealImage,
      type: deal.type,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return
    router.push(`/deal/${deal.id}`)
  }

  const BadgeIcon = () => {
    if (deal.type === 'PHYSICAL_PRODUCT') return <Package className="w-3.5 h-3.5" />
    if (deal.type === 'LOCAL_SERVICE') return <MapPin className="w-3.5 h-3.5" />
    return <Laptop className="w-3.5 h-3.5" />
  }

  const BadgeLabel = () => {
    if (deal.type === 'PHYSICAL_PRODUCT') return 'Physical'
    if (deal.type === 'LOCAL_SERVICE') return 'Local Service'
    return 'Digital/Software'
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={handleCardClick}
        className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50"
      >
        <div className="flex">
          <div className="w-48 h-32 relative overflow-hidden flex-shrink-0 bg-gray-100">
            <img src={dealImage} alt={deal.title} className="w-full h-full object-cover" />
            {deal.verified && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                ✓ Verified
              </div>
            )}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{deal.title}</h3>
                <p className="text-sm text-gray-600">{merchantName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-600">{deal.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-gray-800">${deal.currentPrice}</span>
                  <span className="text-sm text-gray-400 line-through">${deal.originalPrice}</span>
                </div>
                <div className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase inline-block">
                  {deal.discount}% OFF
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <BadgeIcon />
                {BadgeLabel()}
              </span>
              <div className="flex-1" />
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className={`py-2 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white hover:shadow-md'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Added!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-xl border transition-colors ${
                  isSaved ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:border-[#F3AF7B] hover:text-[#F3AF7B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-50 flex flex-col justify-between"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={dealImage} alt={deal.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {deal.verified && (
            <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">✓ Verified</div>
          )}
          <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{deal.discount}% OFF</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setIsSaved(!isSaved) }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isSaved ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm border border-gray-100">
            <BadgeIcon />
            {BadgeLabel()}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-800 mb-1 line-clamp-2 h-10">{deal.title}</h3>
          <p className="text-xs text-gray-500">{merchantName}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 ml-1">{rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-600">{deal.category}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 border-t border-gray-50 pt-3">
          <div>
            <span className="text-lg font-extrabold text-gray-800">${deal.currentPrice}</span>
            <span className="text-xs text-gray-400 line-through ml-1.5">${deal.originalPrice}</span>
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white hover:shadow-md'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Added to Cart!
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}
