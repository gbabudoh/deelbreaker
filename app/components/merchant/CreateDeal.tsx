'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Calendar, DollarSign, Tag, Info, Laptop, MapPin, Package } from 'lucide-react'

interface CreateDealProps {
  merchantId: string
}

export default function CreateDeal({ merchantId }: CreateDealProps) {
  const [dealType, setDealType] = useState<'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'>('PHYSICAL_PRODUCT')
  const [targetCountries, setTargetCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    originalPrice: '',
    currentPrice: '',
    duration: '168', // default 7 days in hours
    imageUrl: '',
    features: [''],
    terms: ''
  })

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty',
    'Books', 'Automotive', 'Health', 'Toys', 'Food & Beverage', 'Services',
    'Travel', 'Events & Activities', 'Pets'
  ]

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCountryToggle = (code: string) => {
    setTargetCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => (i === index ? value : feature))
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      merchantId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      originalPrice: parseFloat(formData.originalPrice),
      currentPrice: parseFloat(formData.currentPrice),
      type: dealType,
      images: formData.imageUrl ? [formData.imageUrl] : ['/api/placeholder/400/300'],
      features: formData.features.filter(f => f.trim() !== ''),
      terms: formData.terms,
      duration: parseInt(formData.duration),
      targetCountries
    }

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert('Deal published successfully on Deelbreaker!')
        setFormData({
          title: '',
          description: '',
          category: '',
          originalPrice: '',
          currentPrice: '',
          duration: '168',
          imageUrl: '',
          features: [''],
          terms: ''
        })
        setTargetCountries([])
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to create deal'}`)
      }
    } catch (err) {
      console.error(err)
      alert('Network communication failure.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Launch a New Flash Sale Deal</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Deal Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Deal Type</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setDealType('PHYSICAL_PRODUCT')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-colors text-left ${
                  dealType === 'PHYSICAL_PRODUCT'
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Physical Product</h3>
                </div>
                <p className="text-xs text-gray-600">
                  Shipped directly to the customer. Strictly enforced 3-5 day delivery SLA.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDealType('LOCAL_SERVICE')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-colors text-left ${
                  dealType === 'LOCAL_SERVICE'
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Local Service</h3>
                </div>
                <p className="text-xs text-gray-600">
                  Instant QR vouchers for in-person redemption (salons, gyms, events).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDealType('DIGITAL_SOFTWARE')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-colors text-left ${
                  dealType === 'DIGITAL_SOFTWARE'
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Digital/Software</h3>
                </div>
                <p className="text-xs text-gray-600">
                  Vouchers for direct online booking or instant software license keys.
                </p>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Deal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                placeholder="e.g., Premium Leather Wallet - 40% Off"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Detailed Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Detail shipping expectations or redemption policies clearly..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
              required
            />
          </div>

          {/* Image Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Product Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={e => handleInputChange('imageUrl', e.target.value)}
              placeholder="e.g., https://images.unsplash.com/photo-xxx"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
            />
          </div>

          {/* Target Countries & Shipping */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Target Countries & Shipping Boundaries
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select which countries you are willing to sell and ship to. If none are selected, this deal defaults to <strong>Global</strong> (accessible by everyone).
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setTargetCountries([])}
                className={`cursor-pointer px-4 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                  targetCountries.length === 0
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10 text-[#e09153]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                🌍 Global / Everywhere
              </button>
              {AVAILABLE_COUNTRIES.map(country => {
                const isSelected = targetCountries.includes(country.code)
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryToggle(country.code)}
                    className={`cursor-pointer px-4 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
                      isSelected
                        ? 'border-[#F3AF7B] bg-[#F3AF7B]/10 text-[#e09153]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Original Retail Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={e => handleInputChange('originalPrice', e.target.value)}
                  placeholder="100.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Sale Markdown Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-indigo-600" />
                <input
                  type="number"
                  value={formData.currentPrice}
                  onChange={e => handleInputChange('currentPrice', e.target.value)}
                  placeholder="59.99"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-indigo-200 bg-indigo-50/30 text-indigo-900 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Deal Duration (hours)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.duration}
                  onChange={e => handleInputChange('duration', e.target.value)}
                  placeholder="168"
                  min="1"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Key Features / Specifics</label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={e => updateFeature(index, e.target.value)}
                    placeholder="e.g., Shipped in organic cotton packaging"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="cursor-pointer px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="cursor-pointer text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium text-sm"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Terms & Conditions / Guidelines</label>
            <textarea
              value={formData.terms}
              onChange={e => handleInputChange('terms', e.target.value)}
              placeholder="Refund conditions, redemption booking instructions, etc..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Marketplace SLA Agreement</p>
                <p>
                  {dealType === 'PHYSICAL_PRODUCT'
                    ? 'Physical product orders must be dispatched and carrier tracking links uploaded within 48 hours. Delivery must occur within 3-5 working days.'
                    : 'Digital and local service voucher funds are held in escrow and released immediately upon redemption scans.'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer py-4 px-6 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? 'Publishing Deal...' : 'Publish Live Flash Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}