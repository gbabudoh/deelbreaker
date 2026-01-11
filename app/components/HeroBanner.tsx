'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Shield, Star, ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  const colors = {
    primary: '#F3AF7B',
    secondary: '#DEDEDE', 
    accent: '#E2FBEE',
    neutral: '#AEB1AF',
    highlight: '#F4C2B8'
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#E2FBEE] via-white to-[#F4C2B8] min-h-screen">
      {/* Background Pattern - Hidden on mobile for performance */}
      <div className="absolute inset-0 opacity-10 hidden sm:block">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#F3AF7B] rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-[#F4C2B8] rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#E2FBEE] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        {/* Header - Mobile First */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
            DEELBREAKER
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#AEB1AF] font-medium mb-2 sm:mb-3 md:mb-4">
            The Future of Smart Shopping
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Where AI meets exclusive deals. Break through ordinary discounts with our dual-track system.
          </p>
        </motion.div>

        {/* Main Features Grid - Stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          {/* Preorder Power */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-[#DEDEDE]/30"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">Group Buy Power</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Unite with others to unlock deeper discounts. The more people join, the lower the price goes for everyone.
            </p>
            <div className="flex items-center text-[#F3AF7B] font-semibold text-sm sm:text-base">
              <span>Up to 70% off</span>
              <TrendingUp className="w-4 h-4 ml-2" />
            </div>
          </motion.div>

          {/* Instant Rewards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-[#DEDEDE]/30"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#E2FBEE] to-[#F4C2B8] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#F3AF7B]" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">Instant Cashback</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Get immediate Deelbreaker Credits that work across all merchants. No broken codes, no waiting.
            </p>
            <div className="flex items-center text-[#F3AF7B] font-semibold text-sm sm:text-base">
              <span>Instant rewards</span>
              <Zap className="w-4 h-4 ml-2" />
            </div>
          </motion.div>

          {/* AI Discovery */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl border border-[#DEDEDE]/30 sm:col-span-2 lg:col-span-1"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#F4C2B8] to-[#F3AF7B] rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">AI-Powered Discovery</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Your personal deal assistant predicts when your favorite items go on sale and alerts you first.
            </p>
            <div className="flex items-center text-[#F3AF7B] font-semibold text-sm sm:text-base">
              <span>Smart alerts</span>
              <Star className="w-4 h-4 ml-2" />
            </div>
          </motion.div>
        </div>

        {/* Value Proposition - Mobile optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-[#F3AF7B]/20 to-[#F4C2B8]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6">
            Beyond Ordinary Discounts
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8">
            We're not just another coupon site. Deelbreaker bridges consumers and retailers with intelligent 
            inventory management, community-driven pricing, and AI-powered deal discovery that creates 
            exclusive advantages no competitor can match.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-lg font-semibold text-[#F3AF7B]">
            <span className="flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Verified by Community
            </span>
            <span className="flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Group Buying Power
            </span>
            <span className="flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Instant Rewards
            </span>
          </div>
        </motion.div>

        {/* CTA Section - Mobile optimized */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <button className="cursor-pointer bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white text-base sm:text-lg md:text-xl font-bold px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full shadow-xl sm:shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto">
            Start Breaking Deals
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
          </button>
          <p className="text-gray-500 mt-3 sm:mt-4 text-sm sm:text-base">Join thousands of smart shoppers already saving more</p>
        </motion.div>
      </div>

      {/* Floating Elements - Hidden on mobile */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-10 w-20 h-20 bg-[#F3AF7B]/30 rounded-full blur-sm hidden md:block"
      />
      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/3 left-10 w-16 h-16 bg-[#E2FBEE]/40 rounded-full blur-sm hidden md:block"
      />
    </div>
  );
}