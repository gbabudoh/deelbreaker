'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Users, DollarSign, Plus, Settings, Bell, ArrowLeft } from 'lucide-react';
import MerchantStats from './MerchantStats';
import DealManagement from './DealManagement';
import CreateDeal from './CreateDeal';
import Analytics from './Analytics';

export default function MerchantPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'deals', label: 'Manage Deals', icon: Store },
    { id: 'create', label: 'Create Deal', icon: Plus },
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
  ];

  // Mock merchant data
  const merchantData = {
    name: 'TechWorld Electronics',
    email: 'merchant@techworld.com',
    logo: '/api/placeholder/80/80',
    memberSince: 'January 2024',
    totalRevenue: 125847.50,
    activeDeals: 12,
    totalCustomers: 3456,
    avgRating: 4.8,
    tier: 'Premium Partner',
    commissionRate: 8.5
  };

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
            <h1 className="text-3xl font-bold text-gray-800">{merchantData.name}</h1>
            <p className="text-gray-600">{merchantData.tier} • Member since {merchantData.memberSince}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="cursor-pointer p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="cursor-pointer bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
            Create New Deal
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">${merchantData.totalRevenue.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600">+3 this week</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{merchantData.activeDeals}</h3>
          <p className="text-gray-600 text-sm">Active Deals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-600">+127 this month</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{merchantData.totalCustomers.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Customers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-orange-600">{merchantData.avgRating}/5.0</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{merchantData.commissionRate}%</h3>
          <p className="text-gray-600 text-sm">Commission Rate</p>
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
        {activeTab === 'overview' && <MerchantStats merchantData={merchantData} />}
        {activeTab === 'deals' && <DealManagement />}
        {activeTab === 'create' && <CreateDeal />}
        {activeTab === 'analytics' && <Analytics />}
      </motion.div>
    </div>
  );
}