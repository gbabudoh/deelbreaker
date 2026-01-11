'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Zap, Star, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Deal {
  id: number;
  title: string;
  merchant: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  type: 'group-buy' | 'instant';
  participants?: number;
  targetParticipants?: number;
  timeLeft?: string;
  cashback?: number;
  image: string;
  category: string;
  rating: number;
  verified: boolean;
}

interface DealCardProps {
  deal: Deal;
  viewMode: 'grid' | 'list';
}

export default function DealCard({ deal, viewMode }: DealCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const progressPercentage = deal.participants && deal.targetParticipants 
    ? (deal.participants / deal.targetParticipants) * 100 
    : 0;

  const formatTimeLeft = (timeLeft: string) => {
    const parts = timeLeft.split(' ');
    return parts.map((part, index) => (
      <span key={index} className={index % 2 === 0 ? 'font-bold' : 'text-sm'}>
        {part}{index < parts.length - 1 ? ' ' : ''}
      </span>
    ));
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <div className="flex">
          {/* Image */}
          <div className="w-48 h-32 relative overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-[#F3AF7B]/20 to-[#F4C2B8]/20 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Product Image</span>
            </div>
            {deal.verified && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                ✓ Verified
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{deal.title}</h3>
                <p className="text-gray-600">{deal.merchant}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{deal.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{deal.category}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-800">${deal.currentPrice}</span>
                  <span className="text-lg text-gray-400 line-through">${deal.originalPrice}</span>
                </div>
                <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {deal.discount}% OFF
                </div>
              </div>
            </div>

            {/* Deal Type Specific Info */}
            {deal.type === 'group-buy' ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {deal.participants}/{deal.targetParticipants} joined
                  </span>
                  <span className="text-sm text-[#F3AF7B] font-semibold">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatTimeLeft(deal.timeLeft || '')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">Instant ${deal.cashback} Cashback</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                {deal.type === 'group-buy' ? 'Join Group Buy' : 'Get Deal'}
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-xl border-2 transition-colors ${
                  isSaved 
                    ? 'border-red-300 bg-red-50 text-red-500' 
                    : 'border-gray-200 hover:border-[#F3AF7B] hover:text-[#F3AF7B]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-xl border-2 border-gray-200 hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-[#F3AF7B]/20 to-[#F4C2B8]/20 flex items-center justify-center">
          <span className="text-gray-400">Product Image</span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {deal.verified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ✓ Verified
            </div>
          )}
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {deal.discount}% OFF
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isSaved 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Deal Type Badge */}
        <div className="absolute bottom-3 left-3">
          {deal.type === 'group-buy' ? (
            <div className="bg-[#E2FBEE] text-[#F3AF7B] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Users className="w-4 h-4" />
              Group Buy
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Instant
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{deal.title}</h3>
          <p className="text-gray-600 text-sm">{deal.merchant}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{deal.rating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">{deal.category}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-800">${deal.currentPrice}</span>
            <span className="text-lg text-gray-400 line-through ml-2">${deal.originalPrice}</span>
          </div>
        </div>

        {/* Deal Type Specific Info */}
        {deal.type === 'group-buy' ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {deal.participants}/{deal.targetParticipants} joined
              </span>
              <span className="text-sm text-[#F3AF7B] font-semibold flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {deal.timeLeft}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">Instant ${deal.cashback} Cashback</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          {deal.type === 'group-buy' ? 'Join Group Buy' : 'Get Deal'}
        </button>
      </div>
    </motion.div>
  );
}