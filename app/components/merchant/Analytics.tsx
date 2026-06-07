'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Eye, Loader2 } from 'lucide-react'
import { getMerchantAnalytics } from '@/app/actions/merchant-actions'
import DemandBox from './DemandBox'

interface AnalyticsProps {
  merchantId: string
}

export default function Analytics({ merchantId }: AnalyticsProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await getMerchantAnalytics(merchantId)
        if (res.success) {
          setData(res.analytics)
        } else {
          setError(res.error || 'Failed to retrieve analytics')
        }
      } catch (err: any) {
        setError(err.message || 'Error occurred while loading analytics')
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [merchantId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-10 h-10 text-[#F3AF7B] animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Aggregating sales metrics...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-2">Error: {error || 'No data available'}</p>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Gross Revenue',
      value: `$${data.grossVolume.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-400 to-green-500'
    },
    {
      title: 'Deal Hits / Views',
      value: data.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-blue-400 to-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-[#F3AF7B] to-[#F4C2B8]'
    },
    {
      title: 'Total Sales Orders',
      value: data.totalOrders.toLocaleString(),
      icon: Users,
      color: 'from-purple-400 to-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      {/* demandBOX predictive metrics panel */}
      <DemandBox merchantId={merchantId} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-50 col-span-1">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Sales by Category</h3>
          <div className="space-y-4">
            {data.topCategories.map((category: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    <span className="text-sm text-gray-600">${category.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
            {data.topCategories.length === 0 && (
              <p className="text-gray-500 text-sm">No sales categories recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-50 col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Sales & Redemption Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.map((activity: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'sale'
                      ? 'bg-green-100 text-green-600'
                      : activity.type === 'complete'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span className="text-sm font-semibold text-gray-800">{activity.amount}</span>
              </motion.div>
            ))}
            {data.recentActivity.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-6">No sales activity reported recently.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}