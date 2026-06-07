'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, AlertCircle, RefreshCw, Globe, ArrowRight, TrendingUp, ShoppingBag, Eye, Heart } from 'lucide-react'
import { getDemandBoxData } from '@/app/actions/merchant-actions'

interface DemandBoxProps {
  merchantId: string
}

export default function DemandBox({ merchantId }: DemandBoxProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadDemandData = async () => {
    try {
      setError(null)
      const res = await getDemandBoxData(merchantId)
      if (res.success && res.demandBox) {
        setData(res.demandBox)
      } else {
        setError(res.error || 'Failed to load predictive analytics')
      }
    } catch (err: any) {
      setError(err.message || 'Error loading demandBOX data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDemandData()
  }, [merchantId])

  const handleRefresh = () => {
    setRefreshing(true)
    loadDemandData()
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <RefreshCw className="w-10 h-10 text-[#F3AF7B] animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-semibold">Calculating predictive demand indices...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">demandBOX Offline</h3>
        <p className="text-gray-600 text-sm mb-4">{error || 'Data fetching error.'}</p>
        <button
          onClick={handleRefresh}
          className="cursor-pointer bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    )
  }

  const { totalDemandIndex, dealMetrics, trafficGeography, conversionFunnel } = data

  // Determine aggregate demand tier status
  let demandStatus = 'Low'
  let demandColor = 'text-gray-600 bg-gray-100 border-gray-200'
  let meterPercentage = Math.min((totalDemandIndex / 300) * 100, 100)

  if (totalDemandIndex > 150) {
    demandStatus = 'Critical Velocity'
    demandColor = 'text-red-700 bg-red-50 border-red-200'
  } else if (totalDemandIndex > 60) {
    demandStatus = 'High Velocity'
    demandColor = 'text-orange-700 bg-orange-50 border-orange-200'
  } else if (totalDemandIndex > 20) {
    demandStatus = 'Healthy Demand'
    demandColor = 'text-green-700 bg-green-50 border-green-200'
  }

  return (
    <div className="space-y-8">
      {/* demandBOX Header Block */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#F3AF7B] uppercase tracking-wider mb-4">
              <BarChart3 className="w-3.5 h-3.5" /> demandBOX v2.0 Live
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Marketplace Demand Intelligence</h2>
            <p className="text-gray-300 text-sm max-w-xl">
              Mathematical consumer-behavior tracking. Aggregating views, saves, checkouts, and redemptions over the past 7 days.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all inline-flex items-center gap-2 border border-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Signals
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Overall Demand Meter & Stocking Advice */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6 col-span-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Demand Velocity Index</h3>
            <p className="text-xs text-gray-500">Weighted velocity of client buyer actions.</p>
          </div>

          {/* Meter Widget */}
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="text-5xl font-black text-gray-900 mb-2">{totalDemandIndex}</div>
            <div className={`px-4 py-1 rounded-full text-xs font-bold border ${demandColor} mb-6`}>
              {demandStatus}
            </div>

            {/* Slider bar representation */}
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-yellow-400 via-[#F3AF7B] to-purple-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(meterPercentage, 5)}%` }}
              />
            </div>
            <div className="flex justify-between w-full text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wider">
              <span>Promo Status</span>
              <span>Critical Velocity</span>
            </div>
          </div>

          {/* Supply restock advice summary */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Fulfillment & Stocking Directives</h4>
            <div className="space-y-3">
              {dealMetrics.map((deal: any) => {
                let recColor = 'border-gray-200 bg-gray-50 text-gray-700'
                if (deal.demandIndex > 75) {
                  recColor = 'border-red-200 bg-red-50/50 text-red-800'
                } else if (deal.demandIndex > 30) {
                  recColor = 'border-orange-200 bg-orange-50/50 text-orange-800'
                }
                return (
                  <div key={deal.id} className={`p-4 rounded-xl border ${recColor} flex flex-col gap-1`}>
                    <span className="font-bold text-sm truncate">{deal.title}</span>
                    <span className="text-xs font-medium leading-relaxed">{deal.recommendation}</span>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-semibold">
                      <span>Category: {deal.category}</span>
                      <span>Index Score: {deal.demandIndex}</span>
                    </div>
                  </div>
                )
              })}
              {dealMetrics.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-400 font-medium">
                  No products launched. Re-evaluate your listings.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Funnel conversion details */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6 col-span-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Behavior Conversion Funnel</h3>
            <p className="text-xs text-gray-500">Visual mapping of client action drop-offs.</p>
          </div>

          {/* Graphical Funnel */}
          <div className="space-y-4 py-4">
            {/* Step 1: Views */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-blue-500" /> Views / Impressions</span>
                <span>{conversionFunnel.views}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full transition-all duration-700" style={{ width: '100%' }} />
                <span className="absolute left-3 top-2 text-[10px] font-bold text-white uppercase tracking-wider z-10">100% Reach</span>
              </div>
            </div>

            {/* Step 2: Saves */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-pink-500" /> Saves / Bookmarks</span>
                <span>{conversionFunnel.saves}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-full transition-all duration-700" style={{ width: `${conversionFunnel.rates.saveRate}%` }} />
                <span className="absolute left-3 top-2 text-[10px] font-bold text-gray-700 uppercase tracking-wider z-10">
                  {conversionFunnel.rates.saveRate}% Interest
                </span>
              </div>
            </div>

            {/* Step 3: Checkouts */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-amber-500" /> Checkout Starters</span>
                <span>{conversionFunnel.checkouts}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-700" style={{ width: `${conversionFunnel.rates.checkoutRate}%` }} />
                <span className="absolute left-3 top-2 text-[10px] font-bold text-gray-700 uppercase tracking-wider z-10">
                  {conversionFunnel.rates.checkoutRate}% Intent
                </span>
              </div>
            </div>

            {/* Step 4: Purchases */}
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-green-500" /> Confirmed Sales</span>
                <span>{conversionFunnel.purchases}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden relative">
                <div className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-700" style={{ width: `${conversionFunnel.rates.purchaseRate}%` }} />
                <span className="absolute left-3 top-2 text-[10px] font-bold text-white uppercase tracking-wider z-10">
                  {conversionFunnel.rates.purchaseRate}% Conversion
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 leading-relaxed font-medium">
              <strong>Funnel Insight:</strong> {conversionFunnel.rates.checkoutRate > 15 ? 'Your product details look extremely convincing! Solid checkout intent.' : 'Add cleaner deal images or clear refund terms to boost customer confidence.'}
            </div>
          </div>
        </div>

        {/* Right Column: Traffic Geography breakdown */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6 col-span-1">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Geographic Traffic Flow</h3>
            <p className="text-xs text-gray-500">Aggregate customer visits sorted by source country.</p>
          </div>

          {/* List layout */}
          <div className="space-y-4">
            {trafficGeography.map((item: any, index: number) => {
              const flags: Record<string, string> = {
                US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', JP: '🇯🇵', Global: '🌍'
              }
              const names: Record<string, string> = {
                US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
                DE: 'Germany', FR: 'France', ES: 'Spain', JP: 'Japan', Global: 'Global/Other'
              }

              return (
                <div key={item.country} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{flags[item.country] || '🌍'}</span>
                      <span>{names[item.country] || item.country}</span>
                    </span>
                    <span className="text-gray-500">{item.count} hits ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}

            {trafficGeography.length === 0 && (
              <div className="text-center py-12 text-gray-400 font-semibold flex flex-col items-center gap-2">
                <Globe className="w-10 h-10 text-gray-300" />
                <span className="text-sm">Waiting for incoming telemetry views...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
