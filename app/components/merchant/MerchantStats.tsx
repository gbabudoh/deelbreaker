'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Star, Clock, ShoppingCart } from 'lucide-react';

interface MerchantData {
  totalRevenue: number;
  activeDeals: number;
  totalCustomers: number;
  avgRating: number;
}

interface MerchantStatsProps {
  merchantData: MerchantData;
}

export default function MerchantStats({ merchantData }: MerchantStatsProps) {
  const recentOrders = [
    {
      id: 'ORD-12345',
      customer: 'Sarah M.',
      product: 'iPhone 15 Pro Max',
      amount: 999,
      type: 'group-buy',
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: 'ORD-12344',
      customer: 'Mike R.',
      product: 'MacBook Air M3',
      amount: 1099,
      type: 'instant',
      status: 'processing',
      date: '4 hours ago'
    },
    {
      id: 'ORD-12343',
      customer: 'Lisa K.',
      product: 'Samsung TV 65"',
      amount: 899,
      type: 'group-buy',
      status: 'completed',
      date: '1 day ago'
    }
  ];

  const topDeals = [
    {
      name: 'iPhone 15 Pro Max',
      participants: 847,
      revenue: 847000,
      status: 'active'
    },
    {
      name: 'MacBook Air M3',
      participants: 234,
      revenue: 257000,
      status: 'active'
    },
    {
      name: 'Samsung QLED TV',
      participants: 156,
      revenue: 140000,
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Overview</h3>
          <div className="h-64 bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8]/30 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-[#F3AF7B] mx-auto mb-4" />
              <p className="text-gray-600">Revenue chart would go here</p>
              <p className="text-sm text-gray-500">Integration with analytics library needed</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+15.3%</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">${merchantData.totalRevenue.toLocaleString()}</h3>
            <p className="text-green-100">Monthly Revenue</p>
          </div>

          <div className="bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+127</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{merchantData.totalCustomers.toLocaleString()}</h3>
            <p className="text-orange-100">Total Customers</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{order.product}</h4>
                    <span className="font-bold text-gray-800">${order.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{order.customer}</span>
                    <span>•</span>
                    <span className="capitalize">{order.type.replace('-', ' ')}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {order.status}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="cursor-pointer text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium">
              View All Orders
            </button>
          </div>
        </div>

        {/* Top Performing Deals */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top Performing Deals</h3>
          <div className="space-y-4">
            {topDeals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{deal.name}</h4>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    deal.status === 'active' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {deal.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-semibold text-gray-800">{deal.participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold text-gray-800">${deal.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="cursor-pointer flex items-center gap-3 p-4 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl hover:shadow-lg transition-all duration-300">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Create Group Buy</span>
          </button>
          <button className="cursor-pointer flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Flash Sale</span>
          </button>
          <button className="cursor-pointer flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">View Analytics</span>
          </button>
          <button className="cursor-pointer flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
            <Star className="w-5 h-5" />
            <span className="font-semibold">Manage Reviews</span>
          </button>
        </div>
      </div>
    </div>
  );
}