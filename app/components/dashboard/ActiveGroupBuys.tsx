'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Loader2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import OrderCard from './OrderCard'

export default function ActiveGroupBuys() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders?limit=20')
        if (!response.ok) {
          throw new Error('Failed to load orders')
        }
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-10 h-10 text-[#F3AF7B] animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Retrieving your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-2">Error: {error}</p>
        <button
          onClick={() => {
            setLoading(true)
            setError(null)
            // Reload
            window.location.reload()
          }}
          className="cursor-pointer text-sm font-bold text-[#F3AF7B] hover:underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Your Orders & Vouchers</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {orders.length} order{orders.length !== 1 && 's'}
        </span>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex"
          >
            <OrderCard order={order} />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-4 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No purchases yet</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Grab verified deals on physical items or digital services at unmatched markdown prices!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all touch-active"
          >
            Explore Marketplace
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
