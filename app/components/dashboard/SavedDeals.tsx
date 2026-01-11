'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Users, Zap, Trash2, ExternalLink, ChevronRight, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';

export default function SavedDeals() {
  const [savedDeals, setSavedDeals] = useState([
    {
      id: 1,
      title: 'MacBook Air M3 13-inch',
      merchant: 'AppleStore',
      originalPrice: 1299,
      currentPrice: 1099,
      discount: 15,
      type: 'group-buy',
      participants: 234,
      targetParticipants: 500,
      timeLeft: '5d 8h',
      savedAt: '2 days ago',
      priceAlert: true
    },
    {
      id: 2,
      title: 'Sony WH-1000XM5 Headphones',
      merchant: 'AudioWorld',
      originalPrice: 399,
      currentPrice: 279,
      discount: 30,
      type: 'instant',
      cashback: 25,
      savedAt: '1 week ago',
      priceAlert: false
    },
    {
      id: 3,
      title: 'Nintendo Switch OLED',
      merchant: 'GameHub',
      originalPrice: 349,
      currentPrice: 299,
      discount: 14,
      type: 'instant',
      cashback: 15,
      savedAt: '3 days ago',
      priceAlert: true
    }
  ]);

  const removeDeal = (dealId: number) => {
    setSavedDeals(deals => deals.filter(deal => deal.id !== dealId));
  };

  const toggleAlert = (dealId: number) => {
    setSavedDeals(deals => deals.map(deal => 
      deal.id === dealId ? { ...deal, priceAlert: !deal.priceAlert } : deal
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Saved Deals</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {savedDeals.length} saved
          </span>
          {savedDeals.length > 0 && (
            <button className="cursor-pointer text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Deals List - Mobile Card Layout */}
      <AnimatePresence>
        <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 lg:space-y-0">
          {savedDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-36 lg:h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
                
                {/* Deal Type Badge */}
                <div className="absolute top-3 left-3">
                  {deal.type === 'group-buy' ? (
                    <div className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <Users className="w-3 h-3" />
                      Group Buy
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3" />
                      Instant
                    </div>
                  )}
                </div>

                {/* Discount Badge */}
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  -{deal.discount}%
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleAlert(deal.id)}
                    className={`cursor-pointer p-2 rounded-full shadow-md transition-colors touch-active ${
                      deal.priceAlert 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-600 hover:text-blue-500'
                    }`}
                    title={deal.priceAlert ? 'Alert On' : 'Alert Off'}
                  >
                    {deal.priceAlert ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => removeDeal(deal.id)}
                    className="cursor-pointer p-2 bg-white text-gray-600 hover:text-red-500 rounded-full shadow-md transition-colors touch-active"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-1 line-clamp-2">{deal.title}</h3>
                <p className="text-xs lg:text-sm text-gray-500 mb-3">{deal.merchant}</p>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg lg:text-xl font-bold text-gray-900">${deal.currentPrice}</span>
                  <span className="text-sm text-gray-400 line-through">${deal.originalPrice}</span>
                </div>

                {/* Deal Specific Info */}
                {deal.type === 'group-buy' ? (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600">
                        {deal.participants}/{deal.targetParticipants} joined
                      </span>
                      <span className="text-xs text-[#F3AF7B] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.timeLeft}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-1.5 rounded-full transition-all"
                        style={{ width: `${(deal.participants! / deal.targetParticipants!) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold text-sm">${deal.cashback} Cashback</span>
                  </div>
                )}

                {/* View Deal Button */}
                <Link
                  href={deal.type === 'group-buy' ? `/group-buy/${deal.id}` : `/deals/${deal.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all touch-active"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Deal
                </Link>

                {/* Saved Time */}
                <p className="text-xs text-gray-400 text-center mt-3">Saved {deal.savedAt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {savedDeals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved deals yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Save deals you're interested in to track them here.</p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all touch-active"
          >
            Browse Deals
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
