'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit, Trash2, Eye, Plus, ShoppingBag, CheckCircle, Truck, Clock, QrCode } from 'lucide-react'
import { fulfillPhysicalOrder, redeemServiceVoucher } from '@/app/actions/merchant-actions'

interface DealManagementProps {
  merchantId: string
}

export default function DealManagement({ merchantId }: DealManagementProps) {
  const [deals, setDeals] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'deals' | 'orders'>('deals')
  const [searchTerm, setSearchTerm] = useState('')

  // Voucher redemption state
  const [voucherInput, setVoucherInput] = useState('')
  const [redeemLoading, setRedeemLoading] = useState(false)

  // Physical shipment modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [carrier, setCarrier] = useState('USPS')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipLoading, setShipLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [dealsRes, ordersRes] = await Promise.all([
        fetch(`/api/merchant/deals?merchantId=${merchantId}`),
        fetch(`/api/merchant/orders?merchantId=${merchantId}`)
      ])
      const dealsData = await dealsRes.json()
      const ordersData = await ordersRes.json()

      setDeals(dealsData.deals || [])
      setOrders(ordersData.orders || [])
    } catch (err) {
      console.error('Failed to load merchant panel data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [merchantId])

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!voucherInput.trim()) return

    setRedeemLoading(true)
    try {
      const res = await redeemServiceVoucher(voucherInput, merchantId)
      if (res.success) {
        alert(res.message)
        setVoucherInput('')
        fetchData()
      } else {
        alert(`Redemption failed: ${res.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Voucher redemption error')
    } finally {
      setRedeemLoading(false)
    }
  }

  const handleShipOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder || !trackingNumber.trim()) return

    setShipLoading(true)
    try {
      const res = await fulfillPhysicalOrder({
        orderId: selectedOrder.id,
        merchantId,
        trackingCarrier: carrier,
        trackingNumber
      })

      if (res.success) {
        alert(res.message)
        setSelectedOrder(null)
        setTrackingNumber('')
        fetchData()
      } else {
        alert(`Fulfillment failed: ${res.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Order shipment error')
    } finally {
      setShipLoading(false)
    }
  }

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toggle Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('deals')}
            className={`cursor-pointer px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              viewMode === 'deals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Manage Deals ({deals.length})
          </button>
          <button
            onClick={() => setViewMode('orders')}
            className={`cursor-pointer px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              viewMode === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Fulfill Orders ({orders.length})
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={viewMode === 'deals' ? 'Search deals...' : 'Search order # or title...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: MANAGE DEALS */}
      {viewMode === 'deals' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Deal Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Markdown</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Views / Sales</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDeals.map(deal => {
                  const dealRevenue = deal.orders
                    .filter((o: any) => ['SHIPPED', 'SHIPPED_LATE', 'DELIVERED', 'REDEEMED'].includes(o.status))
                    .reduce((sum: number, o: any) => sum + o.amountPaid, 0)

                  return (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={deal.images?.[0] || '/api/placeholder/48/48'}
                            alt={deal.title}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{deal.title}</h4>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{deal.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {deal.type === 'PHYSICAL_PRODUCT' && 'Physical'}
                          {deal.type === 'LOCAL_SERVICE' && 'Local Service'}
                          {deal.type === 'DIGITAL_SOFTWARE' && 'Digital/Software'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">${deal.currentPrice}</span>{' '}
                          <span className="line-through text-gray-400 text-xs">${deal.originalPrice}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          <p>Views: {deal._count.views}</p>
                          <p className="font-medium text-gray-900">Orders: {deal._count.orders}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">${dealRevenue.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="cursor-pointer p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="cursor-pointer p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredDeals.length === 0 && (
            <div className="text-center py-12 text-gray-500">No deals published yet.</div>
          )}
        </div>
      )}

      {/* VIEW 2: FULFILL ORDERS */}
      {viewMode === 'orders' && (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Orders List & Tracking */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-50 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">Customer Orders Queue</h3>
            </div>
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[500px]">
              {filteredOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-gray-50/50 transition-colors flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-gray-100 rounded-lg text-gray-600">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            order.status === 'REDEEMED' || order.status === 'SHIPPED'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : order.status === 'SHIPPED_LATE'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : order.status === 'CANCELLED_EXPIRED_REFUNDED'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Purchased: {order.deal.title}</p>
                      <p className="text-xs text-gray-400">Buyer: {order.user.name || order.user.email}</p>

                      {order.trackingNumber && (
                        <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          Tracking: {order.trackingCarrier} - {order.trackingNumber}
                        </p>
                      )}
                      {order.voucherCode && (
                        <p className="text-xs text-indigo-600 font-semibold mt-1 flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" />
                          Voucher Code: {order.voucherCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm">${order.amountPaid.toFixed(2)}</span>
                    {order.status === 'PENDING_SHIPMENT' && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer block mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                      >
                        Fulfill / Ship
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">No orders received yet.</div>
              )}
            </div>
          </div>

          {/* Quick Redemption Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-sm">Voucher Redemption Console</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Enter the consumer's custom `DEEL-` alphanumeric voucher code below to instantly trigger redemption, complete fulfillment, and release payment splits to your connected Stripe account.
              </p>
              <form onSubmit={handleRedeemVoucher} className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g. DEEL-9A4B8F"
                  value={voucherInput}
                  onChange={e => setVoucherInput(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 font-mono uppercase tracking-wider text-center focus:outline-indigo-600"
                  required
                />
                <button
                  type="submit"
                  disabled={redeemLoading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all"
                >
                  {redeemLoading ? 'Verifying...' : 'Redeem Voucher'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Shipment Dialog/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-gray-900">Ship Physical Order</h3>
              <p className="text-xs text-gray-500 mt-1">Input carrier details for order {selectedOrder.orderNumber}</p>
            </div>

            <form onSubmit={handleShipOrder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Shipping Carrier</label>
                <select
                  value={carrier}
                  onChange={e => setCarrier(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5"
                >
                  <option value="USPS">USPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="UPS">UPS</option>
                  <option value="DHL">DHL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9400100000000000000000"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="cursor-pointer flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shipLoading}
                  className="cursor-pointer flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center"
                >
                  {shipLoading ? 'Fulfilling...' : 'Confirm Shipment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}