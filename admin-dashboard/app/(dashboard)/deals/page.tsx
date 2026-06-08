'use client'

import { useEffect, useState } from 'react'
import { Check, X, ShieldAlert, Star, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'

interface Deal {
  id: string
  title: string
  description: string
  category: string
  originalPrice: number
  currentPrice: number
  discount: number
  type: string
  status: string
  verified: boolean
  featured: boolean
  trending: boolean
  createdAt: string
  merchant: {
    name: string
    email: string
  }
}

export default function DealsModerationPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDeals = async () => {
    setError(null)
    try {
      const res = await fetch('/api/deals')
      if (!res.ok) {
        throw new Error('Failed to fetch deals')
      }
      const data = await res.json()
      setDeals(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading deals.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const handleUpdate = async (id: string, updates: Partial<Deal>) => {
    try {
      const res = await fetch('/api/deals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!res.ok) {
        throw new Error('Failed to update deal')
      }

      setDeals((prev) =>
        prev.map((deal) => (deal.id === id ? { ...deal, ...updates } : deal))
      )
    } catch (err: any) {
      alert(err.message || 'Error updating deal.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">Deals Moderation</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Verify newly added deals from merchants, control visibility, and promote deals.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true)
            fetchDeals()
          }}
          disabled={refreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {deals.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              No deals submitted for moderation yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">Deal Details</th>
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4 text-center">Verification</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Promotions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-zinc-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{deal.title}</div>
                      <div className="mt-1 text-xs text-zinc-500">{deal.category} • {deal.type.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-200">{deal.merchant.name}</div>
                      <div className="text-xs text-zinc-500">{deal.merchant.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <div className="text-white font-semibold">${deal.currentPrice.toFixed(2)}</div>
                      <div className="text-xs text-zinc-500 line-through">${deal.originalPrice.toFixed(2)}</div>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/10">
                        {deal.discount}% OFF
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleUpdate(deal.id, { verified: !deal.verified })}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          deal.verified
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
                        }`}
                      >
                        {deal.verified ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Verified
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" /> Pending Approval
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={deal.status}
                        onChange={(e) => handleUpdate(deal.id, { status: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PAUSED">PAUSED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(deal.id, { featured: !deal.featured })}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            deal.featured
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                              : 'border-zinc-800 text-zinc-500 hover:text-amber-400 hover:border-amber-500/20'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleUpdate(deal.id, { trending: !deal.trending })}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            deal.trending
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.05)]'
                              : 'border-zinc-800 text-zinc-500 hover:text-blue-400 hover:border-blue-500/20'
                          }`}
                          title="Toggle Trending"
                        >
                          <TrendingUp className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
