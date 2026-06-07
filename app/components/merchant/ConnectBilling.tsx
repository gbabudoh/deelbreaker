'use client'

import React, { useState } from 'react'
import { CreditCard, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react'

interface ConnectBillingProps {
  merchantId: string
  isStripeLinked: boolean
}

export default function ConnectBilling({ merchantId, isStripeLinked }: ConnectBillingProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/merchant/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId })
      })

      const data = await response.json()

      if (data.url) {
        // Redirect the merchant directly to Stripe's hosted secure form
        window.location.href = data.url
      } else {
        alert('Failed to initiate setup. Please contact support.')
      }
    } catch (err) {
      console.error(err)
      alert('Network communication error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Payout Wallet Configuration</h3>
          <p className="text-xs text-gray-500">Configure how you receive funds from your Deelbreaker sales.</p>
        </div>
      </div>

      {isStripeLinked ? (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-4 rounded-xl flex items-start gap-3 mt-4">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold">Stripe Connect Linked Successfully</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Your store is authorized to accept credit card payments. Your 90% payout splits transfer directly to your bank account upon order completion.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            Deelbreaker uses Stripe to securely handle transaction payouts. Complete your account registration steps to unlock full catalog listing permissions.
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Link Payment Wallet
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
