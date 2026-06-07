'use client'

import React from 'react'
import { Truck, Clock, CheckCircle2 } from 'lucide-react'

interface OrderCardProps {
  order: {
    id: string
    amountPaid: number
    status: 'PENDING' | 'PENDING_SHIPMENT' | 'PENDING_REDEMPTION' | 'SHIPPED' | 'SHIPPED_LATE' | 'DELIVERED' | 'REDEEMED' | 'CANCELLED' | 'REFUNDED' | 'CANCELLED_EXPIRED_REFUNDED'
    trackingNumber?: string | null
    trackingCarrier?: string | null
    voucherCode?: string | null
    deadlineDate?: string | Date | null // ISO String or Date from backend
    deal: {
      title: string
      type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE'
      imageUrl?: string | null
      images?: string[]
    }
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  const { deal, status, trackingNumber, trackingCarrier, voucherCode, deadlineDate, amountPaid } = order

  // Helper to build real-world clickable tracking URLs instantly
  const getTrackingUrl = (carrier: string, trackingNum: string) => {
    const cleanCarrier = carrier.toLowerCase().trim()
    const cleanNum = trackingNum.trim()
    if (cleanCarrier.includes('fedex')) return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${cleanNum}`
    if (cleanCarrier.includes('ups')) return `https://www.ups.com/track?tracknum=${cleanNum}`
    if (cleanCarrier.includes('dhl')) return `https://www.dhl.com/en/express/tracking.html?AWB=${cleanNum}`
    // Default fallback to standard USPS tracking
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleanNum}`
  }

  const formattedDeadline = deadlineDate
    ? new Date(deadlineDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : ''

  const dealImage = deal.imageUrl || (deal.images && deal.images[0]) || '/api/placeholder/64/64'

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden max-w-md mx-auto w-full">
      {/* Deal Header Summary */}
      <div className="p-4 flex items-center gap-4 bg-gray-50 border-b border-gray-100">
        <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          <img src={dealImage} alt={deal.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">{deal.title}</h4>
          <p className="text-xs font-bold text-indigo-600 mt-0.5">${amountPaid.toFixed(2)} paid</p>
        </div>
      </div>

      {/* Dynamic Fulfillment Context Card Block */}
      <div className="p-5">
        {/* VIEW 1: PHYSICAL PRODUCT HANDLING */}
        {deal.type === 'PHYSICAL_PRODUCT' && (
          <div className="space-y-4">
            {['PENDING', 'PENDING_SHIPMENT'].includes(status) ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-amber-900">Merchant Packing Order</h5>
                  {formattedDeadline && (
                    <p className="text-xs text-amber-700 mt-0.5">
                      Estimated shipping by: <span className="font-semibold">{formattedDeadline}</span>
                    </p>
                  )}
                </div>
              </div>
            ) : status === 'CANCELLED_EXPIRED_REFUNDED' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-semibold text-red-900">Fulfillment Expired & Refunded</h5>
                  <p className="text-xs text-red-700 mt-0.5">
                    Merchant failed to ship this order within the 3-5 day window. A full refund has been credited.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-emerald-900">Your Package is Shipped!</h5>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Dispatched via {trackingCarrier || 'Mail Carrier'}
                    </p>
                  </div>
                </div>

                {trackingNumber && trackingCarrier && (
                  <a
                    href={getTrackingUrl(trackingCarrier, trackingNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-sm transition-colors text-center"
                  >
                    <Truck className="h-4 w-4" />
                    Track Shipment Live
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: LOCAL SERVICE / SOFTWARE HANDLING */}
        {(deal.type === 'LOCAL_SERVICE' || deal.type === 'DIGITAL_SOFTWARE') && (
          <div className="flex flex-col items-center text-center space-y-4">
            {['PENDING', 'PENDING_REDEMPTION'].includes(status) ? (
              <>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  {/* Securely generates high quality QR code instantly from voucher string */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(voucherCode || '')}`}
                    alt="Redemption QR Code"
                    className="h-36 w-36 mix-blend-multiply"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Show this code to the merchant to redeem</p>
                  <div className="mt-1.5 inline-block bg-gray-100 px-3 py-1 rounded border border-gray-200 font-mono text-xs font-bold text-gray-800 tracking-wider">
                    {voucherCode}
                  </div>
                </div>
              </>
            ) : status === 'REDEEMED' ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full flex flex-col items-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                <h5 className="text-sm font-semibold text-gray-700">Voucher Already Redeemed</h5>
                <p className="text-xs text-gray-400 mt-1">Thank you for utilizing Deelbreaker deals!</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full flex flex-col items-center">
                <Clock className="h-10 w-10 text-gray-400 mb-2" />
                <h5 className="text-sm font-semibold text-gray-700">Voucher Cancelled</h5>
                <p className="text-xs text-gray-400 mt-1">This order was cancelled or refunded.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
