'use client';

import { motion } from 'framer-motion';
import { Clock, Users, CheckCircle, AlertCircle, ExternalLink, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ActiveGroupBuys() {
  const activeGroupBuys = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      merchant: 'TechWorld',
      image: '/api/placeholder/120/120',
      joinedPrice: 999,
      currentPrice: 999,
      finalPrice: 849,
      participants: 847,
      targetParticipants: 1000,
      timeLeft: '2d 14h',
      status: 'active',
      joinedAt: '3 days ago',
      quantity: 1
    },
    {
      id: 2,
      title: 'MacBook Air M3 13-inch',
      merchant: 'AppleStore',
      image: '/api/placeholder/120/120',
      joinedPrice: 1149,
      currentPrice: 1099,
      finalPrice: 1049,
      participants: 456,
      targetParticipants: 500,
      timeLeft: '1d 6h',
      status: 'price_dropped',
      joinedAt: '1 week ago',
      quantity: 1,
      refundAmount: 50
    },
    {
      id: 3,
      title: 'Samsung 65" QLED TV',
      merchant: 'ElectroMart',
      image: '/api/placeholder/120/120',
      joinedPrice: 1299,
      currentPrice: 1299,
      finalPrice: 999,
      participants: 89,
      targetParticipants: 200,
      timeLeft: '6d 12h',
      status: 'needs_participants',
      joinedAt: '2 days ago',
      quantity: 1
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': 
        return { 
          color: 'text-blue-600 bg-blue-50 border-blue-200', 
          text: 'Active',
          icon: Clock 
        };
      case 'price_dropped': 
        return { 
          color: 'text-green-600 bg-green-50 border-green-200', 
          text: 'Price Dropped!',
          icon: CheckCircle 
        };
      case 'needs_participants': 
        return { 
          color: 'text-orange-600 bg-orange-50 border-orange-200', 
          text: 'Needs More',
          icon: AlertCircle 
        };
      default: 
        return { 
          color: 'text-gray-600 bg-gray-50 border-gray-200', 
          text: 'Unknown',
          icon: Clock 
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Active Group Buys</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {activeGroupBuys.length} active
        </span>
      </div>

      {/* Group Buys List */}
      <div className="space-y-3 lg:space-y-4">
        {activeGroupBuys.map((groupBuy, index) => {
          const statusConfig = getStatusConfig(groupBuy.status);
          const StatusIcon = statusConfig.icon;
          const progressPercentage = (groupBuy.participants / groupBuy.targetParticipants) * 100;
          
          return (
            <motion.div
              key={groupBuy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Mobile Layout */}
              <div className="p-4 lg:p-6">
                {/* Top Row - Product Info */}
                <div className="flex gap-3 lg:gap-4 mb-4">
                  {/* Product Image Placeholder */}
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">Image</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm lg:text-lg line-clamp-2">{groupBuy.title}</h3>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mb-2">{groupBuy.merchant}</p>
                    
                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.text}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs lg:text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{groupBuy.participants}</span>
                      /{groupBuy.targetParticipants} joined
                    </span>
                    <span className="text-xs lg:text-sm font-semibold text-[#F3AF7B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {groupBuy.timeLeft}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-3 gap-2 lg:gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">You Paid</p>
                    <p className="font-bold text-gray-900 text-sm lg:text-base">${groupBuy.joinedPrice}</p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-xs text-gray-500 mb-0.5">Current</p>
                    <p className="font-bold text-gray-900 text-sm lg:text-base">${groupBuy.currentPrice}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Target</p>
                    <p className="font-bold text-[#F3AF7B] text-sm lg:text-base">${groupBuy.finalPrice}</p>
                  </div>
                </div>

                {/* Status Alerts */}
                {groupBuy.status === 'price_dropped' && groupBuy.refundAmount && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-800 font-medium text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      You'll receive a ${groupBuy.refundAmount} refund!
                    </p>
                  </div>
                )}

                {groupBuy.status === 'needs_participants' && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <p className="text-orange-800 font-medium text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Share to help reach the target price!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/group-buy/${groupBuy.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-2.5 lg:py-3 px-4 rounded-xl font-semibold text-sm lg:text-base shadow-sm hover:shadow-md transition-all touch-active"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </Link>
                  <button className="cursor-pointer flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2.5 lg:py-3 px-4 rounded-xl font-semibold text-sm lg:text-base hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors touch-active">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* Footer - Timeline */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Joined {groupBuy.joinedAt} • Ends in {groupBuy.timeLeft}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeGroupBuys.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No active group buys</h3>
          <p className="text-gray-500 mb-6 text-sm">Join a group buy to start saving with community power!</p>
          <Link
            href="/deals?type=group-buy"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all touch-active"
          >
            Browse Group Buys
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
