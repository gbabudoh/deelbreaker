'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Download } from 'lucide-react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {(['week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-white px-6 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Revenue', value: '$45,231', change: '+12.5%' },
          { label: 'New Users', value: '1,234', change: '+8.2%' },
          { label: 'Deals Created', value: '456', change: '+15.3%' },
          { label: 'Avg Order Value', value: '$89.50', change: '+5.1%' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
            <p className="text-sm font-semibold text-green-600 mt-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              {metric.change}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64 bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8] rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Chart visualization would go here</p>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8] rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Chart visualization would go here</p>
          </div>
        </div>
      </motion.div>

      {/* Top Performing Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Deals</h3>
        <div className="space-y-4">
          {[
            { name: 'iPhone 15 Pro Max', views: 12500, conversions: 342 },
            { name: 'MacBook Air M3', views: 9800, conversions: 287 },
            { name: 'Samsung QLED TV', views: 8900, conversions: 256 },
            { name: 'Nike Air Max 270', views: 7600, conversions: 198 }
          ].map((deal, index) => (
            <div key={deal.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{deal.name}</p>
                <p className="text-sm text-gray-600">{deal.views} views • {deal.conversions} conversions</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {((deal.conversions / deal.views) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
