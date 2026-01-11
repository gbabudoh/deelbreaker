'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Eye, Calendar, Download } from 'lucide-react';

export default function Analytics() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$125,847',
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-400 to-green-500'
    },
    {
      title: 'Deal Views',
      value: '45,231',
      change: '+8.7%',
      changeType: 'positive',
      icon: Eye,
      color: 'from-blue-400 to-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: '12.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-[#F3AF7B] to-[#F4C2B8]'
    },
    {
      title: 'Active Customers',
      value: '3,456',
      change: '+127',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-400 to-purple-500'
    }
  ];

  const topCategories = [
    { name: 'Electronics', revenue: 85420, percentage: 68 },
    { name: 'Fashion', revenue: 23150, percentage: 18 },
    { name: 'Home & Garden', revenue: 12890, percentage: 10 },
    { name: 'Sports', revenue: 4387, percentage: 4 }
  ];

  const recentActivity = [
    {
      type: 'sale',
      description: 'iPhone 15 Pro Max sold via group buy',
      amount: '+$999',
      time: '2 minutes ago'
    },
    {
      type: 'view',
      description: 'MacBook Air deal viewed 50 times',
      amount: '50 views',
      time: '15 minutes ago'
    },
    {
      type: 'join',
      description: 'New participant joined Samsung TV group buy',
      amount: '+1 participant',
      time: '32 minutes ago'
    },
    {
      type: 'complete',
      description: 'Sony Headphones group buy completed',
      amount: '+$13,950',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#F3AF7B] text-white rounded-xl hover:bg-[#F3AF7B]/90 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Revenue Trends</h3>
            <div className="flex items-center gap-2">
              <button className="cursor-pointer px-3 py-1 text-sm bg-[#F3AF7B] text-white rounded-lg">Revenue</button>
              <button className="cursor-pointer px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Orders</button>
              <button className="cursor-pointer px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Views</button>
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8]/30 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-[#F3AF7B] mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">Revenue Chart</p>
              <p className="text-sm text-gray-500">Chart.js or similar integration needed</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top Categories</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    <span className="text-sm text-gray-600">${category.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Performance Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-green-800">Strong Performance</h4>
              </div>
              <p className="text-sm text-green-700">
                Your group buy conversion rate is 23% higher than the platform average.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-blue-800">Growing Audience</h4>
              </div>
              <p className="text-sm text-blue-700">
                You've gained 127 new customers this month, a 15% increase.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-yellow-800">Optimization Tip</h4>
              </div>
              <p className="text-sm text-yellow-700">
                Consider running more deals on weekends when engagement is 40% higher.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'sale' ? 'bg-green-100' :
                  activity.type === 'view' ? 'bg-blue-100' :
                  activity.type === 'join' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  {activity.type === 'sale' && <DollarSign className="w-4 h-4 text-green-600" />}
                  {activity.type === 'view' && <Eye className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'join' && <Users className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'complete' && <TrendingUp className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span className="text-sm font-semibold text-gray-800">{activity.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}