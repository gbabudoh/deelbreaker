'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Edit, 
  ToggleLeft, 
  ToggleRight, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  X,
  Megaphone
} from 'lucide-react'

interface Deal {
  id: string
  title: string
  merchant?: {
    name: string
  }
}

interface Campaign {
  id: string
  dealId: string | null
  deal: Deal | null
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  pricePaid: number
  isPaidPromotion: boolean
  isActive: boolean
  createdByAdmin: boolean
  createdAt: string
  updatedAt: string
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pricePaid, setPricePaid] = useState('')
  const [isPaidPromotion, setIsPaidPromotion] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [dealId, setDealId] = useState('')
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCampaigns()
    fetchDeals()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/promotions')
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data)
      } else {
        setError('Failed to fetch campaigns')
      }
    } catch (err) {
      console.error(err)
      setError('Network error fetching campaigns')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/admin/deals?filter=all')
      if (res.ok) {
        const data = await res.json()
        setDeals(data.deals || [])
      }
    } catch (err) {
      console.error('Error fetching deals:', err)
    }
  }

  const handleOpenCreate = () => {
    setEditingCampaign(null)
    setTitle('')
    setDescription('')
    setImageUrl('')
    setStartDate('')
    setEndDate('')
    setPricePaid('')
    setIsPaidPromotion(false)
    setIsActive(true)
    setDealId('')
    setError('')
    setSuccess('')
    setIsFormOpen(true)
  }

  const handleOpenEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setTitle(campaign.title)
    setDescription(campaign.description)
    setImageUrl(campaign.imageUrl)
    
    // Format dates to YYYY-MM-DDThh:mm for datetime-local input
    const startFormatted = new Date(campaign.startDate).toISOString().slice(0, 16)
    const endFormatted = new Date(campaign.endDate).toISOString().slice(0, 16)
    
    setStartDate(startFormatted)
    setEndDate(endFormatted)
    setPricePaid(campaign.pricePaid.toString())
    setIsPaidPromotion(campaign.isPaidPromotion)
    setIsActive(campaign.isActive)
    setDealId(campaign.dealId || '')
    setError('')
    setSuccess('')
    setIsFormOpen(true)
  }

  const handleToggleActive = async (campaign: Campaign) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: campaign.id,
          isActive: !campaign.isActive
        })
      })

      if (res.ok) {
        const updated = await res.json()
        setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c))
      } else {
        alert('Failed to update promotion status')
      }
    } catch (err) {
      console.error(err)
      alert('Error communicating with server')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion campaign?')) return

    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id))
      } else {
        alert('Failed to delete promotion campaign')
      }
    } catch (err) {
      console.error(err)
      alert('Error communicating with server')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    if (!title || !description || !imageUrl || !startDate || !endDate) {
      setError('Please fill in all required fields.')
      setSubmitting(false)
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date.')
      setSubmitting(false)
      return
    }

    const payload = {
      id: editingCampaign?.id,
      title,
      description,
      imageUrl,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      pricePaid: pricePaid ? parseFloat(pricePaid) : 0,
      isPaidPromotion,
      isActive,
      dealId: dealId || null
    }

    try {
      const url = '/api/admin/promotions'
      const method = editingCampaign ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const savedCampaign = await res.json()
        
        if (editingCampaign) {
          setCampaigns(prev => prev.map(c => c.id === savedCampaign.id ? savedCampaign : c))
          setSuccess('Campaign updated successfully!')
        } else {
          setCampaigns(prev => [savedCampaign, ...prev])
          setSuccess('Campaign scheduled successfully!')
        }

        setTimeout(() => {
          setIsFormOpen(false)
          setEditingCampaign(null)
        }, 1500)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save promotion campaign')
      }
    } catch (err) {
      console.error(err)
      setError('Network communication failure.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Homepage Promotions & Scheduled Ads</h2>
          <p className="text-gray-600 text-sm">Schedule and audit homepage banner hero promotions</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>New Promotion</span>
        </button>
      </div>

      {/* Campaigns list or Loading */}
      {isLoading ? (
        <div className="animate-pulse h-96 bg-gray-100 rounded-2xl"></div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Banner</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Audit Pricing</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {campaigns.map((campaign) => {
                  const now = new Date()
                  const start = new Date(campaign.startDate)
                  const end = new Date(campaign.endDate)
                  const isScheduled = now < start
                  const isExpired = now > end
                  const isCurrentlyActive = campaign.isActive && start <= now && now <= end

                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      {/* Image Preview */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
                          {campaign.imageUrl ? (
                            <img 
                              src={campaign.imageUrl} 
                              alt={campaign.title} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                // Fallback image if loading fails
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300'
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-semibold text-gray-950 text-sm leading-snug">{campaign.title}</p>
                          <p className="text-xs text-gray-600 truncate mt-0.5">{campaign.description}</p>
                          
                          {campaign.deal ? (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit font-medium">
                              <LinkIcon className="w-3.5 h-3.5" />
                              <span className="truncate">Linked: {campaign.deal.title}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md w-fit font-medium">
                              <Megaphone className="w-3.5 h-3.5" />
                              <span>Deelbreaker Platform Offer</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Start: {new Date(campaign.startDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>End: {new Date(campaign.endDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                          
                          {isScheduled && (
                            <span className="inline-block px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded mt-1">
                              Scheduled
                            </span>
                          )}
                          {isExpired && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded mt-1">
                              Expired
                            </span>
                          )}
                          {isCurrentlyActive && (
                            <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded mt-1">
                              Live Now
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Pricing Audit */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {campaign.pricePaid > 0 ? (
                            <div className="flex items-center text-green-700">
                              <DollarSign className="w-4 h-4 -mr-0.5" />
                              <span>{campaign.pricePaid.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs font-normal">Free / Internal</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-0.5">
                          {campaign.isPaidPromotion ? 'Merchant Ad Placement' : 'Platform Promotion'}
                        </p>
                      </td>

                      {/* Active Switch */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleActive(campaign)}
                          className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                        >
                          {campaign.isActive ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <ToggleRight className="w-9 h-9 text-[#F3AF7B]" />
                              <span className="text-[10px] font-semibold text-gray-600">Enabled</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-0.5">
                              <ToggleLeft className="w-9 h-9 text-gray-400" />
                              <span className="text-[10px] font-medium text-gray-600">Disabled</span>
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(campaign)}
                            className="cursor-pointer p-2 bg-gray-100 hover:bg-[#F3AF7B]/10 hover:text-[#F3AF7B] rounded-lg text-gray-600 transition-all"
                            title="Edit Promotion"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign.id)}
                            className="cursor-pointer p-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-600 transition-all"
                            title="Delete Promotion"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-semibold text-gray-800">No scheduled promotion campaigns found</p>
                      <p className="text-sm text-gray-600 mt-1">Click the button above to schedule your first campaign!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Slide-over Form Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100 flex flex-col"
            >
              {/* Form Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingCampaign ? 'Edit Promotion Campaign' : 'Schedule New Campaign'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {editingCampaign ? 'Modify scheduled campaign options' : 'Publish custom marketplace advertising placements'}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Campaign Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Campaign Promo Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Summer Tech Extravaganza"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Promo Copy/Description *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a compelling description for this campaign. Keep it clear, action-oriented, and engaging."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex justify-between">
                    <span>Banner Image URL *</span>
                    <button
                      type="button"
                      onClick={() => setImageUrl('/images/promo-banner.jpg')}
                      className="cursor-pointer text-xs text-[#F3AF7B] font-semibold hover:underline"
                    >
                      Use Premium Template Banner
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL to banner image (e.g. /images/promo-banner.jpg)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm"
                  />
                  {imageUrl && (
                    <div className="mt-2 relative w-full h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Linked Deal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Link to Marketplace Deal (Optional)</label>
                  <select
                    value={dealId}
                    onChange={(e) => setDealId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 bg-white transition-all text-sm"
                  >
                    <option value="">-- No Linked Deal (Custom Platform-Wide Promo) --</option>
                    {deals.map(deal => (
                      <option key={deal.id} value={deal.id}>
                        {deal.title} {deal.merchant ? `(${deal.merchant.name})` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-start gap-1.5 mt-1.5 text-xs text-gray-600">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>Linking a deal will dynamically display the deal's discount price, countdown clock, and buyer statistics on the home banner.</span>
                  </div>
                </div>

                {/* Scheduling Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Display Start *</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Display End *</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Options */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#F3AF7B]" />
                    <span>Auditing & Revenue Options</span>
                  </h4>
                  
                  {/* Paid placement checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPaidPromotion}
                      onChange={(e) => setIsPaidPromotion(e.target.checked)}
                      className="rounded border-gray-300 text-[#F3AF7B] focus:ring-[#F3AF7B]"
                    />
                    <span className="text-sm font-medium text-gray-600">This is a Paid Merchant Campaign</span>
                  </label>

                  {/* Price Paid field */}
                  {isPaidPromotion && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Audited Ad Placement Price Paid ($) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-medium">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required={isPaidPromotion}
                          value={pricePaid}
                          onChange={(e) => setPricePaid(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 transition-all text-sm"
                        />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">Record the payment details manually audited for this promotion placement.</p>
                    </div>
                  )}
                </div>

                {/* Active switch */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Status</h4>
                    <p className="text-xs text-gray-600 mt-0.5">Toggle this promotion active or inactive instantly.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
                  >
                    {isActive ? (
                      <ToggleRight className="w-10 h-10 text-[#F3AF7B]" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="cursor-pointer flex-1 py-3 px-4 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cursor-pointer flex-1 py-3 px-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all shadow-md text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : editingCampaign ? (
                      'Update Promotion'
                    ) : (
                      'Schedule Promotion'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
