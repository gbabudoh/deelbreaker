'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Trash2, ExternalLink, ChevronRight, Bell, BellOff, Package, MapPin, Laptop } from 'lucide-react';
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
      type: 'PHYSICAL_PRODUCT',
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
      type: 'PHYSICAL_PRODUCT',
      savedAt: '1 week ago',
      priceAlert: false
    },
    {
      id: 3,
      title: 'Deep Tissue Massage Package',
      merchant: 'SpaRetreat',
      originalPrice: 150,
      currentPrice: 90,
      discount: 40,
      type: 'LOCAL_SERVICE',
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
                  {deal.type === 'PHYSICAL_PRODUCT' ? (
                    <div className="bg-indigo-500 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                      <Package className="w-3 h-3" />
                      Physical
                    </div>
                  ) : deal.type === 'LOCAL_SERVICE' ? (
                    <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3" />
                      Local Service
                    </div>
                  ) : (
                    <div className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                      <Laptop className="w-3 h-3" />
                      Digital
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

                {/* Delivery Information */}
                <div className="mb-4 text-xs font-semibold text-gray-500 bg-gray-50 py-1.5 px-3 rounded-lg flex items-center gap-1.5">
                  {deal.type === 'PHYSICAL_PRODUCT' ? (
                    <>
                      <Package className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Est. Delivery: 3-5 Working Days</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Instant Voucher & QR Code</span>
                    </>
                  )}
                </div>

                {/* View Deal Button */}
                <Link
                  href={`/deal/${deal.id}`}
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
