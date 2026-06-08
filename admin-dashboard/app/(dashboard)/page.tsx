'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  Tag,
  ShoppingCart,
  DollarSign,
  ShieldAlert,
  AlertOctagon,
  TrendingUp
} from 'lucide-react'

interface Stats {
  totalUsers: number
  activeDeals: number
  totalOrders: number
  totalRevenue: number
  pendingDeals: number
  activeDisputes: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  totalPrice: number
  status: string
  paymentStatus: string
  orderDate: string
  user: {
    name: string | null
    email: string
  }
  deal: {
    title: string
  }
}

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        if (data.stats) {
          setStats(data.stats)
          setRecentOrders(data.recentOrders || [])
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  const metricCards = [
    {
      name: 'Total Platform Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Registered buyers and sellers'
    },
    {
      name: 'Active Marketplace Deals',
      value: stats?.activeDeals ?? 0,
      icon: Tag,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      description: 'Currently live for purchase'
    },
    {
      name: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description: 'Completed orders checkouts'
    },
    {
      name: 'Total Platform Revenue',
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Processed transactions volume'
    },
    {
      name: 'Pending Moderation',
      value: stats?.pendingDeals ?? 0,
      icon: ShieldAlert,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      description: 'Deals waiting verification'
    },
    {
      name: 'Active Disputes',
      value: stats?.activeDisputes ?? 0,
      icon: AlertOctagon,
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      description: 'Open customer dispute tickets'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner Welcome */}
      <div className="rounded-3xl border border-zinc-800 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_50%)] bg-zinc-900/40 p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-xl">
          Welcome back to the Deelbreaker Control Center. Real-time platform analytics, moderation alerts, and administrative utilities.
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => (
          <div
            key={card.name}
            className="group rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-300">
                {card.name}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {card.value}
              </span>
              <p className="mt-2 text-xs text-zinc-500">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
              <p className="text-xs text-zinc-400">Latest completed or pending orders</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500">
                No orders found on the platform.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Deal</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-zinc-800/10">
                      <td className="py-3.5 font-medium text-emerald-400 font-mono">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-zinc-200">
                          {order.user.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-zinc-500">{order.user.email}</div>
                      </td>
                      <td className="py-3.5 max-w-[200px] truncate text-zinc-300">
                        {order.deal.title}
                      </td>
                      <td className="py-3.5 text-right font-semibold text-white">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Task Moderation List */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            Pending Action Queue
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Deals Moderation</p>
                <p className="text-xs text-zinc-500">Verify new merchant deals</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-xs">
                {stats?.pendingDeals ?? 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Disputes Queue</p>
                <p className="text-xs text-zinc-500">Resolve client disputes</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs">
                {stats?.activeDisputes ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
