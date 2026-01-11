'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Trash2, Eye, Flag } from 'lucide-react'

interface Deal {
  id: string
  title: string
  merchant: { name: string }
  status: string
  discount: number
  flagged: boolean
  createdAt: string
}

export default function DealModeration() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'flagged' | 'pending'>('all')

  useEffect(() => {
    fetchDeals()
  }, [filter])

  const fetchDeals = async () => {
    try {
      const response = await fetch(`/api/admin/deals?filter=${filter}`)
      const data = await response.json()
      setDeals(data.deals)
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveDeal = async (dealId: string) => {
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' })
      })
      await fetchDeals()
    } catch (error) {
      console.error('Error approving deal:', error)
    }
  }

  const handleRejectDeal = async (dealId: string) => {
    try {
      await fetch(`/api/admin/deals/${dealId}`, {
        method: 'DELETE'
      })
      await fetchDeals()
    } catch (error) {
      console.error('Error rejecting deal:', error)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        {(['all', 'flagged', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Deals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Merchant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deals.map((deal, index) => (
                <motion.tr
                  key={deal.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{deal.title}</p>
                      <p className="text-sm text-gray-500">{deal.id.slice(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{deal.merchant.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {deal.discount}% off
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {deal.flagged && (
                        <Flag className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${
                        deal.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {deal.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDeal(deal.id)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectDeal(deal.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Reject"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {deals.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No deals to moderate</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
