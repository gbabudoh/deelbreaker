'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, TrendingUp, ShoppingBag, Star, Bell, Settings, Plus, Search,
  Edit, Pause, Trash2, ArrowLeft, DollarSign, Users, BarChart3,
  CreditCard, ChevronRight, Package, Zap, Clock, Download, BadgeCheck, Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CreateDeal from '@/app/components/merchant/CreateDeal';
import Analytics from '@/app/components/merchant/Analytics';

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'deals', label: 'My Deals', icon: Store },
  { id: 'create', label: 'Create Deal', icon: Plus },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'payouts', label: 'Payouts', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const MOCK_ORDERS = [
  { id: '#ORD-4821', date: 'Jun 5, 2026', deal: 'Wireless Noise-Cancelling Headphones', buyer: 'Alice K.', amount: '$89.00', status: 'Completed' },
  { id: '#ORD-4820', date: 'Jun 5, 2026', deal: 'Luxury Skincare Bundle', buyer: 'Marco R.', amount: '$54.50', status: 'Processing' },
  { id: '#ORD-4819', date: 'Jun 4, 2026', deal: 'Smart Home Starter Kit', buyer: 'Priya N.', amount: '$129.00', status: 'Completed' },
  { id: '#ORD-4818', date: 'Jun 4, 2026', deal: 'Wireless Noise-Cancelling Headphones', buyer: 'Tom W.', amount: '$89.00', status: 'Pending' },
  { id: '#ORD-4817', date: 'Jun 3, 2026', deal: 'Premium Coffee Subscription', buyer: 'Sarah J.', amount: '$34.99', status: 'Refunded' },
];

const MOCK_DEALS = [
  { id: 1, title: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: '$89.00', discount: '40%', status: 'ACTIVE', sales: 47, revenue: '$4,183' },
  { id: 2, title: 'Luxury Skincare Bundle', category: 'Beauty & Wellness', price: '$54.50', discount: '35%', status: 'ACTIVE', sales: 31, revenue: '$1,690' },
  { id: 3, title: 'Smart Home Starter Kit', category: 'Electronics', price: '$129.00', discount: '25%', status: 'ACTIVE', sales: 18, revenue: '$2,322' },
  { id: 4, title: 'Premium Coffee Subscription', category: 'Food & Dining', price: '$34.99', discount: '20%', status: 'PAUSED', sales: 28, revenue: '$980' },
  { id: 5, title: 'Yoga & Meditation Class Pack', category: 'Local Services', price: '$45.00', discount: '50%', status: 'EXPIRED', sales: 62, revenue: '$2,790' },
];

const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', date: 'Jun 1, 2026', description: 'Payout — May 2026', amount: '+$920.00', type: 'payout' },
  { id: 'TXN-002', date: 'May 15, 2026', description: 'Sale — Headphones x3', amount: '+$267.00', type: 'sale' },
  { id: 'TXN-003', date: 'May 10, 2026', description: 'Refund — Order #4801', amount: '-$34.99', type: 'refund' },
  { id: 'TXN-004', date: 'May 5, 2026', description: 'Sale — Skincare Bundle x8', amount: '+$436.00', type: 'sale' },
  { id: 'TXN-005', date: 'Apr 30, 2026', description: 'Platform fee — April', amount: '-$48.50', type: 'fee' },
];

const TOP_DEALS = [
  { title: 'Wireless Headphones', sales: 47, revenue: '$4,183', trend: '+12%' },
  { title: 'Smart Home Kit', sales: 18, revenue: '$2,322', trend: '+8%' },
  { title: 'Luxury Skincare', sales: 31, revenue: '$1,690', trend: '+23%' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Refunded: 'bg-red-100 text-red-700',
    ACTIVE: 'bg-green-100 text-green-700',
    PAUSED: 'bg-yellow-100 text-yellow-700',
    EXPIRED: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('All');
  const [dealSearch, setDealSearch] = useState('');
  const [shopName, setShopName] = useState('My Store');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('db_seller_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.shopName) setShopName(parsed.shopName);
      }
    } catch {}
  }, []);

  const filteredOrders = orderFilter === 'All'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === orderFilter);

  const filteredDeals = dealSearch
    ? MOCK_DEALS.filter(d => d.title.toLowerCase().includes(dealSearch.toLowerCase()))
    : MOCK_DEALS;

  const tabVariants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-linear-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Top row */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Marketplace</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white hidden sm:block">Deelbreaker</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/10">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/10">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shop info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl flex items-center justify-center shadow-lg text-xl font-bold text-white shrink-0">
                {shopName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-white">{shopName}</h1>
                  <span className="flex items-center gap-1 bg-[#F3AF7B]/20 text-[#F3AF7B] text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Store className="w-3 h-3" />
                    Seller
                  </span>
                  <span className="flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-0.5">Seller Dashboard</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab('create')}
              className="shrink-0 flex items-center gap-2 bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Deal</span>
            </motion.button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-400' },
              { label: 'Active Deals', value: '8', icon: Zap, color: 'text-[#F3AF7B]' },
              { label: 'Total Orders', value: '147', icon: ShoppingBag, color: 'text-blue-400' },
              { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-yellow-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-white font-bold text-base leading-tight">{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex overflow-x-auto no-scrollbar border-b border-white/10">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-[#F3AF7B] text-[#F3AF7B]'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard label="This Month Revenue" value="$3,280" sub="vs $2,940 last month" icon={DollarSign} color="bg-green-100 text-green-600" />
                  <MetricCard label="Orders This Week" value="24" sub="8 pending fulfilment" icon={ShoppingBag} color="bg-blue-100 text-blue-600" />
                  <MetricCard label="New Customers" value="19" sub="71% first-time buyers" icon={Users} color="bg-purple-100 text-purple-600" />
                  <MetricCard label="Conversion Rate" value="3.4%" sub="Up from 2.8% last month" icon={TrendingUp} color="bg-orange-100 text-[#F3AF7B]" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-sm text-[#F3AF7B] font-semibold hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {MOCK_ORDERS.map(order => (
                        <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate max-w-45">{order.deal}</p>
                              <p className="text-xs text-gray-400">{order.id} · {order.buyer}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <span className="text-sm font-bold text-gray-900">{order.amount}</span>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Top Performing Deals</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {TOP_DEALS.map((deal, i) => (
                        <div key={deal.title} className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-[#F3AF7B]/15 text-[#F3AF7B] text-xs font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <p className="text-sm font-semibold text-gray-800 truncate">{deal.title}</p>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{deal.sales} sales</span>
                            <span className="font-bold text-gray-800">{deal.revenue}</span>
                            <span className="text-green-600 font-semibold">{deal.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => setActiveTab('deals')}
                        className="w-full py-2.5 text-sm text-[#F3AF7B] font-semibold border border-[#F3AF7B]/30 rounded-xl hover:bg-[#F3AF7B]/5 transition-colors"
                      >
                        View all deals
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Create Deal', icon: Plus, color: 'bg-[#F3AF7B]/10 text-[#F3AF7B]', tab: 'create' },
                      { label: 'View Orders', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', tab: 'orders' },
                      { label: 'Analytics', icon: BarChart3, color: 'bg-purple-50 text-purple-600', tab: 'analytics' },
                      { label: 'Payouts', icon: CreditCard, color: 'bg-green-50 text-green-600', tab: 'payouts' },
                    ].map(action => (
                      <button
                        key={action.label}
                        onClick={() => setActiveTab(action.tab)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MY DEALS TAB */}
            {activeTab === 'deals' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search deals..."
                      value={dealSearch}
                      onChange={e => setDealSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 text-gray-800"
                    />
                  </div>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="flex items-center gap-2 bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Deal
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {filteredDeals.map(deal => (
                      <div key={deal.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{deal.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-gray-400">{deal.category}</span>
                              <span className="text-xs font-bold text-gray-800">{deal.price}</span>
                              <span className="text-xs bg-red-50 text-red-600 font-semibold px-1.5 py-0.5 rounded-md">{deal.discount} off</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">{deal.sales} sales · {deal.revenue} revenue</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <StatusBadge status={deal.status} />
                          <div className="flex items-center gap-1">
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer">
                              {deal.status === 'PAUSED' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATE DEAL TAB */}
            {activeTab === 'create' && (
              <CreateDeal merchantId="seller-demo" />
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {['All', 'Pending', 'Processing', 'Completed', 'Refunded'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setOrderFilter(filter)}
                      className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        orderFilter === filter
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {['Order #', 'Date', 'Deal', 'Buyer', 'Amount', 'Status', 'Action'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{order.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{order.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 max-w-40 truncate">{order.deal}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{order.buyer}</td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">{order.amount}</td>
                            <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                            <td className="px-4 py-3">
                              <button className="text-xs text-[#F3AF7B] font-semibold hover:underline cursor-pointer">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-medium">No {orderFilter.toLowerCase()} orders</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <Analytics merchantId="seller-demo" />
            )}

            {/* PAYOUTS TAB */}
            {activeTab === 'payouts' && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                    <p className="text-gray-400 text-sm mb-1">Available Balance</p>
                    <p className="text-3xl font-extrabold mb-1">$1,247.50</p>
                    <p className="text-gray-400 text-xs mb-5">Updated just now</p>
                    <div className="relative group">
                      <button
                        disabled
                        className="w-full py-3 bg-white/10 text-white rounded-xl font-semibold text-sm cursor-not-allowed opacity-70"
                      >
                        Withdraw Funds
                      </button>
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-gray-500 text-sm mb-1">Pending Payout</p>
                    <p className="text-3xl font-extrabold text-gray-900 mb-1">$320.00</p>
                    <p className="text-gray-400 text-xs mb-5">Clears in 3–5 business days</p>
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                      <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
                      <p className="text-xs text-yellow-700 font-medium">Connect your bank account to receive payouts</p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-[#F3AF7B]/10 to-orange-50 rounded-2xl border border-[#F3AF7B]/20 p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Connect your bank account</h3>
                    <p className="text-gray-500 text-sm">Receive payouts directly to your bank. Secure and instant.</p>
                  </div>
                  <button className="shrink-0 flex items-center gap-2 bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                    Connect
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Transaction History</h3>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {MOCK_TRANSACTIONS.map(txn => (
                      <div key={txn.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            txn.type === 'payout' ? 'bg-green-100' :
                            txn.type === 'sale' ? 'bg-blue-100' :
                            txn.type === 'refund' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            <DollarSign className={`w-4 h-4 ${
                              txn.type === 'payout' ? 'text-green-600' :
                              txn.type === 'sale' ? 'text-blue-600' :
                              txn.type === 'refund' ? 'text-red-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{txn.description}</p>
                            <p className="text-xs text-gray-400">{txn.date} · {txn.id}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Store Profile</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Update your store information</p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Name</label>
                      <input
                        type="text"
                        defaultValue={shopName}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe your store to buyers..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
                      <input
                        type="url"
                        placeholder="https://yourshop.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]/30 focus:border-[#F3AF7B] text-gray-800 bg-white">
                        <option>Retail & E-commerce</option>
                        <option>Local Services</option>
                        <option>Experiences & Travel</option>
                        <option>Electronics</option>
                        <option>Food & Dining</option>
                        <option>Beauty & Wellness</option>
                      </select>
                    </div>
                    <button className="px-6 py-3 bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Notification Preferences</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { label: 'New Order Alerts', desc: 'Get notified when you receive a new order' },
                      { label: 'Deal Performance Reports', desc: 'Weekly email with your deal analytics' },
                      { label: 'Payout Confirmations', desc: 'Notifications when funds are transferred' },
                      { label: 'Platform Updates', desc: 'News and new features from Deelbreaker' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <button className="w-11 h-6 bg-[#F3AF7B] rounded-full relative transition-colors shrink-0">
                          <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-red-100 bg-red-50/50">
                    <h3 className="font-bold text-red-700">Danger Zone</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Delete Seller Account</p>
                        <p className="text-xs text-gray-400 mt-0.5">Permanently remove your store and all data</p>
                      </div>
                      <button
                        disabled
                        title="Contact support to delete your account"
                        className="px-4 py-2 border border-red-200 text-red-400 rounded-xl text-sm font-semibold cursor-not-allowed opacity-50"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
