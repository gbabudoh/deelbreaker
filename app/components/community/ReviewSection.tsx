'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, MessageCircle, Share2, AlertCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  verified: boolean
  helpful: number
  createdAt: Date
  user: {
    id: string
    name: string
    avatar?: string
  }
}

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ReviewSectionProps {
  dealId: string
}

export default function ReviewSection({ dealId }: ReviewSectionProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [dealId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/deals/${dealId}/reviews`)
      const data = await response.json()
      setReviews(data.reviews)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/deals/${dealId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      setFormData({ rating: 5, title: '', content: '' })
      setShowReviewForm(false)
      await fetchReviews()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
  }

  return (
    <div className="space-y-8">
      {/* Review Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8] rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rating Summary */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(stats.averageRating)
                          ? 'fill-[#F3AF7B] text-[#F3AF7B]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.totalReviews} reviews
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F3AF7B] transition-all"
                        style={{
                          width: `${
                            stats.totalReviews > 0
                              ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] /
                                  stats.totalReviews) *
                                100
                              : 0
                          }%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button */}
            {session && (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Review Form */}
      {showReviewForm && session && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmitReview}
          className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.rating
                        ? 'fill-[#F3AF7B] text-[#F3AF7B]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3AF7B] outline-none"
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F3AF7B] outline-none resize-none"
              placeholder="Share your detailed experience..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.user.name}</p>
                    {review.verified && (
                      <p className="text-xs text-green-600">✓ Verified Purchase</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-[#F3AF7B] text-[#F3AF7B]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-600 mb-4">{review.content}</p>

              <div className="flex gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-[#F3AF7B] transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1 hover:text-[#F3AF7B] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-1 hover:text-[#F3AF7B] transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
