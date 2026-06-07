'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Clock, ShoppingCart, Check, AlertCircle, Loader2 } from 'lucide-react'
import { getMerchantAnalytics } from '@/app/actions/merchant-actions'

interface MerchantStatsProps {
  merchantData: {
    id: string
    name: string
    isBillingActive: boolean
  }
}

export default function MerchantStats({ merchantData }: MerchantStatsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getMerchantAnalytics(merchantData.id)
        if (res.success) {
          setAnalytics(res.analytics)
        } else {
          setError(res.error || 'Failed to fetch analytics')
        }
      } catch (err: any) {
        setError(err.message || 'Error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [merchantData.id])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#F3AF7B] animate-spin" />
      </div>
    )
  }

  const checklistItems = [
    { title: 'Set up Bank Wallet (Stripe Connect)', completed: merchantData.isBillingActive },
    { title: 'Create your first Flash Sale Deal', completed: (analytics?.totalOrders || 0) > 0 || (analytics?.grossVolume || 0) > 0 },
    { title: 'Upload Business verification details', completed: true },
  ]

  const completedCount = checklistItems.filter(item => item.completed).length

  return (
    <div className="space-y-8">
      {/* Setup Checklist */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#F3AF7B]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Setup Checklist</h3>
          <span className="text-sm font-medium text-gray-500">
            {completedCount} of {checklistItems.length} completed
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {checklistItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                }`}
              >
                {item.completed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-xs font-semibold ${
                  item.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-1">${analytics?.grossVolume.toFixed(2)}</h3>
          <p className="text-green-100 text-sm">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{analytics?.totalOrders}</h3>
          <p className="text-orange-100 text-sm">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{analytics?.conversionRate.toFixed(1)}%</h3>
          <p className="text-indigo-100 text-sm">Conversion Rate</p>
        </div>
      </div>

      {/* Recent Activity Logs */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-50">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Store Orders</h3>
        <div className="space-y-4">
          {analytics?.recentActivity.map((activity: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{activity.description}</h4>
                  <span className="font-bold text-gray-800 text-sm">{activity.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {(!analytics?.recentActivity || analytics.recentActivity.length === 0) && (
            <div className="text-center py-8 text-gray-500 text-sm">No recent orders recorded.</div>
          )}
        </div>
      </div>
    </div>
  )
}