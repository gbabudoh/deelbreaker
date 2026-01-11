'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Target } from 'lucide-react';

interface PriceBreakdownProps {
  currentPrice: number;
  originalPrice: number;
  finalPrice: number;
  currentDiscount: number;
  maxDiscount: number;
}

export default function PriceBreakdown({ 
  currentPrice, 
  originalPrice, 
  finalPrice, 
  currentDiscount, 
  maxDiscount 
}: PriceBreakdownProps) {
  const currentSavings = originalPrice - currentPrice;
  const maxSavings = originalPrice - finalPrice;
  const additionalSavings = finalPrice - currentPrice;

  return (
    <div className="bg-white border-2 border-[#E2FBEE] rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-[#F3AF7B]" />
        Price Breakdown
      </h3>

      {/* Current Price */}
      <div className="flex items-center justify-between mb-4 p-4 bg-[#E2FBEE]/50 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Current Group Buy Price</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-800">${currentPrice}</span>
            <span className="text-lg text-gray-400 line-through">${originalPrice}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
            {currentDiscount}% OFF
          </div>
          <p className="text-sm text-gray-600 mt-1">Save ${currentSavings}</p>
        </div>
      </div>

      {/* Potential Final Price */}
      {additionalSavings < 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-[#F3AF7B]/10 to-[#F4C2B8]/10 rounded-lg border border-[#F3AF7B]/20"
        >
          <div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Target className="w-4 h-4" />
              If target is reached
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#F3AF7B]">${finalPrice}</span>
              <span className="text-sm text-gray-500">vs ${currentPrice} now</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-[#F3AF7B] text-white px-3 py-1 rounded-full text-sm font-semibold">
              {maxDiscount}% OFF
            </div>
            <p className="text-sm text-gray-600 mt-1">Save ${Math.abs(additionalSavings)} more</p>
          </div>
        </motion.div>
      )}

      {/* Savings Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Original Price:</span>
          <span className="font-semibold">${originalPrice}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Current Savings:</span>
          <span className="font-semibold text-green-600">-${currentSavings}</span>
        </div>
        {additionalSavings < 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Potential Additional Savings:</span>
            <span className="font-semibold text-[#F3AF7B]">-${Math.abs(additionalSavings)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">You Pay Now:</span>
            <span className="text-2xl font-bold text-gray-800">${currentPrice}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 <strong>How it works:</strong> You'll be charged the current group buy price. 
          If more people join and the price drops further, you'll automatically get a refund for the difference!
        </p>
      </div>
    </div>
  );
}