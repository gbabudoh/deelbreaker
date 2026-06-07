'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Store, TrendingUp, DollarSign, Plus, Settings, Bell, ArrowLeft, BarChart3, CreditCard, Loader2 } from 'lucide-react'
import MerchantStats from './MerchantStats'
import DealManagement from './DealManagement'
import CreateDeal from './CreateDeal'
import Analytics from './Analytics'
import MerchantOnboarding from './MerchantOnboarding'
import ConnectBilling from './ConnectBilling'

export default function MerchantPortal() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [merchant, setMerchant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'deals', label: 'Manage Deals', icon: Store },
    { id: 'create', label: 'Create Deal', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing & Wallet', icon: CreditCard }
  ]

  const fetchMerchantProfile = async () => {
    try {
      const response = await fetch('/api/merchant/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.merchant) {
          setMerchant(data.merchant)
        }
      }
    } catch (error) {
      console.error('Failed to load merchant profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMerchantProfile()
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/merchant')
    }
  }, [status])

  const handleOnboardingComplete = async (onboardingData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/merchant/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData)
      })

      if (response.ok) {
        const data = await response.json()
        setMerchant(data.merchant)
      } else {
        alert('Onboarding failed. Please try again.')
      }
    } catch (error) {
      console.error('Onboarding submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#F3AF7B] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading merchant details...</p>
        </div>
      </div>
    )
  }

  // If authenticated but merchant profile does not exist yet
  if (!merchant) {
    return <MerchantOnboarding onComplete={handleOnboardingComplete} />
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{merchant.name}</h1>
            <p className="text-gray-600">
              {merchant.tier} Partner • {merchant.businessType || 'Retailer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors" onClick={() => setActiveTab('billing')}>
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className="cursor-pointer bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Create New Deal
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#F3AF7B] border-b-2 border-[#F3AF7B]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && <MerchantStats merchantData={merchant} />}
        {activeTab === 'deals' && <DealManagement merchantId={merchant.id} />}
        {activeTab === 'create' && <CreateDeal merchantId={merchant.id} />}
        {activeTab === 'analytics' && <Analytics merchantId={merchant.id} />}
        {activeTab === 'billing' && <ConnectBilling merchantId={merchant.id} isStripeLinked={merchant.isBillingActive} />}
      </motion.div>
    </div>
  )
}