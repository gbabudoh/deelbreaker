'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, ArrowLeft, Package, MapPin, Laptop, Loader2 } from 'lucide-react'
import DealCard from './DealCard'
import { FilterSidebar } from './index'

interface Deal {
  id: string
  title: string
  merchant: { name: string }
  originalPrice: number
  currentPrice: number
  discount: number
  type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
  images: string[]
  category: string
  rating?: number
  verified?: boolean
}

interface DealsDiscoveryProps {
  initialCategory?: string
}

export default function DealsDiscovery({ initialCategory }: DealsDiscoveryProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTypeTab, setActiveTypeTab] = useState<string>('all')
  
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')

  const AVAILABLE_COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  ]

  // Detect user's region via browser locale on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.language) {
      const parts = window.navigator.language.split('-')
      if (parts.length > 1) {
        const detected = parts[1].toUpperCase()
        const supported = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'ES', 'JP'].includes(detected)
        if (supported) {
          setSelectedCountry(detected)
        }
      }
    }
  }, [])

  const fetchDeals = async () => {
    setLoading(true)
    try {
      let url = `/api/deals?limit=30`
      if (initialCategory && initialCategory !== 'all') {
        url += `&category=${encodeURIComponent(initialCategory)}`
      }
      if (activeTypeTab !== 'all') {
        url += `&type=${activeTypeTab}`
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      if (selectedCountry) {
        url += `&country=${encodeURIComponent(selectedCountry)}`
      }

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error('Failed to fetch marketplace deals')
      }
      const data = await res.json()
      setDeals(data.deals || [])
    } catch (err: any) {
      setError(err.message || 'Error loading deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [initialCategory, activeTypeTab, selectedCountry])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchDeals()
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-[#F3AF7B] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Homepage</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Flash Deals</h1>
        <p className="text-gray-600">Browse verified discounts on local services and physical goods</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-50">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent text-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
            {/* Country Filter Selector */}
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full cursor-pointer pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent text-sm font-semibold bg-white text-gray-700 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25em 1.25em',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <option value="">🌍 Global / All Countries</option>
                {AVAILABLE_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#F3AF7B]' : 'text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#F3AF7B]' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              type="submit"
              className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#F3AF7B] text-white rounded-xl hover:bg-[#F3AF7B]/90 transition-colors text-sm font-semibold"
            >
              Apply Search
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Deals Grid/List */}
        <div className="flex-1">
          {/* Deal Type Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`cursor-pointer px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
                activeTypeTab === 'all'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Deals
            </button>

            <button
              onClick={() => setActiveTypeTab('PHYSICAL_PRODUCT')}
              className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
                activeTypeTab === 'PHYSICAL_PRODUCT'
                  ? 'bg-[#E2FBEE] text-emerald-800 border-[#b8e8cf]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Physical Products
            </button>

            <button
              onClick={() => setActiveTypeTab('LOCAL_SERVICE')}
              className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
                activeTypeTab === 'LOCAL_SERVICE'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Local Services
            </button>

            <button
              onClick={() => setActiveTypeTab('DIGITAL_SOFTWARE')}
              className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
                activeTypeTab === 'DIGITAL_SOFTWARE'
                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Laptop className="w-4 h-4" />
              Digital / Software
            </button>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-[#F3AF7B] animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Searching flash deals...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-semibold">{error}</div>
          ) : (
            <>
              {/* Deals Display */}
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {deals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DealCard deal={deal} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>

              {deals.length === 0 && (
                <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-6">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-gray-700">No active deals found</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Try altering your search keyword or selected deal type tab.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}