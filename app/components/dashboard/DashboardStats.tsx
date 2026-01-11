'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Gift, Clock, Star, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface UserData {
  totalSavings: number;
  cashbackBalance: number;
  dealsJoined: number;
  groupBuysCompleted: number;
}

interface DashboardStatsProps {
  userData: UserData;
}

export default function DashboardStats({ userData }: DashboardStatsProps) {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Savings',
      value: `$${userData.totalSavings.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Gift,
      label: 'Cashback',
      value: `$${userData.cashbackBalance}`,
      change: '+$23.50',
      changeType: 'positive',
      color: 'from-[#F3AF7B] to-[#F4C2B8]',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Users,
      label: 'Deals Joined',
      value: userData.dealsJoined.toString(),
      change: '+3 this month',
      changeType: 'neutral',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: TrendingUp,
      label: 'Completed',
      value: userData.groupBuysCompleted.toString(),
      change: '87% success',
      changeType: 'positive',
      color: 'from-purple-400 to-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivity = [
    {
      type: 'cashback',
      title: 'Cashback Earned',
      description: 'Nike Air Max 270',
      amount: '+$15.00',
      time: '2h ago',
      icon: DollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'group-buy',
      title: 'Group Buy Joined',
      description: 'iPhone 15 Pro Max',
      amount: 'Pending',
      time: '1d ago',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'deal',
      title: 'Deal Saved',
      description: 'Samsung 65" QLED TV',
      amount: '40% OFF',
      time: '2d ago',
      icon: Star,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  const quickActions = [
    { icon: Users, label: 'Browse Group Buys', href: '/deals?type=group-buy', color: 'from-[#F3AF7B] to-[#F4C2B8]' },
    { icon: Zap, label: 'Instant Deals', href: '/deals?type=instant', color: 'from-yellow-400 to-yellow-500' },
    { icon: Gift, label: 'Refer Friends', href: '/referral', color: 'from-purple-400 to-purple-500' },
  ];

  return (
    <div className="space-y-4 lg:space-y-8">
      {/* Stats Grid - Hidden on mobile (shown in parent) */}
      <div className="hidden lg:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-green-600 bg-green-50' : 
                stat.changeType === 'negative' ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Stats Cards */}
      <div className="lg:hidden space-y-3">
        {stats.slice(2).map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
              stat.changeType === 'positive' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-100'
            }`}>
              {stat.change}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions - Mobile Horizontal Scroll */}
      <div className="lg:hidden">
        <h3 className="text-base font-semibold text-gray-900 mb-3 px-1">Quick Actions</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-xl font-medium shadow-sm touch-active`}
            >
              <action.icon className="w-5 h-5" />
              <span className="whitespace-nowrap text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
              <h3 className="text-base lg:text-xl font-bold text-gray-900">Recent Activity</h3>
              <Link href="/dashboard?tab=cashback" className="text-sm text-[#F3AF7B] font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 hover:bg-gray-50 transition-colors touch-active"
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 ${activity.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{activity.title}</h4>
                    <p className="text-xs lg:text-sm text-gray-500 truncate">{activity.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{activity.amount}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Desktop Only Quick Actions + Cashback Card */}
        <div className="space-y-4 lg:space-y-6">
          {/* Cashback Card */}
          <div className="bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm lg:text-lg font-bold">Available Cashback</h3>
              <Zap className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold mb-4">${userData.cashbackBalance}</p>
            <button className="cursor-pointer w-full bg-white/20 hover:bg-white/30 text-white py-2.5 lg:py-3 px-4 rounded-xl font-semibold transition-colors touch-active backdrop-blur-sm">
              Withdraw to Bank
            </button>
          </div>

          {/* Quick Actions - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="cursor-pointer w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors touch-active"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{action.label}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
