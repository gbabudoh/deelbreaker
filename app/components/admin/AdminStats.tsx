'use client'

import { motion } from 'framer-motion'
import { Users, ShoppingBag, TrendingUp, AlertCircle, DollarSign, Eye } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalUsers: number
    totalMerchants: number
    totalDeals: number
    activeDeals: number
    totalRevenue: number
    totalOrders: number
    pendingReviews: number
    flaggedDeals: number
  }
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Total Merchants',
      value: stats.totalMerchants,
      icon: ShoppingBag,
      color: 'from-purple-500 to-purple-600',
      change: '+8%'
    },
    {
      label: 'Active Deals',
      value: stats.activeDeals,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+24%'
    },
    {
      label: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      change: '+18%'
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-pink-500 to-pink-600',
      change: '+15%'
    },
    {
      label: 'Flagged Deals',
      value: stats.flaggedDeals,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: stats.flaggedDeals > 0 ? '⚠️ Review' : 'All Clear'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className={`text-sm font-semibold ${
                card.change.includes('⚠️') ? 'text-red-600' : 'text-green-600'
              }`}>
                {card.change}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
            Review Flagged Deals
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
            Manage Users
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
            Verify Merchants
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
            Export Reports
          </button>
        </div>
      </motion.div>
    </div>
  )
}
