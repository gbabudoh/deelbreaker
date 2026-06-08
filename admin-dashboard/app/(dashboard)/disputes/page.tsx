'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle, HelpCircle, XCircle, Check } from 'lucide-react'

interface Dispute {
  id: string
  orderId: string
  reason: string
  details: string
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED'
  resolution: string | null
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  order: {
    orderNumber: string
    totalPrice: number
    paymentStatus: string
    deal: {
      title: string
    }
  }
}

export default function DisputeResolutionPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [resolutionText, setResolutionText] = useState('')
  const [statusVal, setStatusVal] = useState<'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'REJECTED'>('PENDING')

  const fetchDisputes = async () => {
    setError(null)
    try {
      const res = await fetch('/api/disputes')
      if (!res.ok) throw new Error('Failed to fetch disputes')
      const data = await res.json()
      setDisputes(data)
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading disputes.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDispute) return

    try {
      const res = await fetch('/api/disputes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDispute.id,
          status: statusVal,
          resolution: resolutionText
        }),
      })

      if (!res.ok) throw new Error('Failed to update dispute status')
      
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === selectedDispute.id ? { ...d, status: statusVal, resolution: resolutionText } : d
        )
      )
      setSelectedDispute(null)
      setResolutionText('')
    } catch (err: any) {
      alert(err.message)
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">Disputes Resolution Centre</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Handle transactions disputes, investigate claims, and award refunds or reject requests.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true)
            fetchDisputes()
          }}
          disabled={refreshing}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Main Dispute Board layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* DISPUTES LIST */}
        <div className="lg:col-span-2 space-y-4">
          {disputes.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 py-16 text-center text-zinc-500">
              No open disputes found on the platform.
            </div>
          ) : (
            disputes.map((dispute) => {
              const statusColors = {
                PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
                INVESTIGATING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                RESOLVED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                REJECTED: 'bg-red-500/10 text-red-400 border border-red-500/20',
              }

              const statusIcons = {
                PENDING: HelpCircle,
                INVESTIGATING: AlertTriangle,
                RESOLVED: CheckCircle,
                REJECTED: XCircle,
              }

              const IconComponent = statusIcons[dispute.status]

              return (
                <div
                  key={dispute.id}
                  onClick={() => {
                    setSelectedDispute(dispute)
                    setResolutionText(dispute.resolution || '')
                    setStatusVal(dispute.status)
                  }}
                  className={`flex flex-col border p-5 rounded-2xl gap-4 hover:bg-zinc-900/50 transition-all cursor-pointer ${
                    selectedDispute?.id === dispute.id
                      ? 'border-emerald-500/50 bg-zinc-900/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                      : 'border-zinc-800 bg-zinc-900/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800/50 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[dispute.status]}`}>
                        <IconComponent className="h-3.5 w-3.5" />
                        {dispute.status}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">ID: {dispute.order.orderNumber}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{new Date(dispute.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Reason: {dispute.reason}</div>
                      <p className="text-sm text-zinc-300">{dispute.details}</p>
                      {dispute.resolution && (
                        <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
                          <span className="font-bold text-emerald-400">Resolution:</span> {dispute.resolution}
                        </div>
                      )}
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-3 text-xs space-y-2 shrink-0">
                      <div>
                        <div className="text-zinc-550 font-bold uppercase tracking-wider text-zinc-400">User Details</div>
                        <div className="text-zinc-200 mt-0.5">{dispute.user.name || 'Anonymous'}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{dispute.user.email}</div>
                      </div>
                      <div>
                        <div className="text-zinc-550 font-bold uppercase tracking-wider text-zinc-400">Order Deal</div>
                        <div className="text-zinc-200 mt-0.5 truncate">{dispute.order.deal.title}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">${dispute.order.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* RESOLUTION CONTROLLER FORM */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 self-start space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            Resolution Console
          </h3>

          {selectedDispute ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Ticket</div>
                <div className="text-sm font-semibold text-white mt-1">{selectedDispute.reason}</div>
                <div className="text-xs text-zinc-400 mt-0.5 truncate">{selectedDispute.order.deal.title}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Update Status
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as any)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Resolution Notes
                </label>
                <textarea
                  required
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors h-32 resize-none"
                  placeholder="Record formal resolution details..."
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer font-sans"
              >
                <Check className="h-4 w-4" />
                Submit Resolution
              </button>
            </form>
          ) : (
            <div className="py-8 text-center text-sm text-zinc-500 font-sans">
              Select a dispute ticket from the list to begin investigation and resolution.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
