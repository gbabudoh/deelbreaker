'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Shield, Share2, Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import ParticipantsList from './ParticipantsList';
import PriceBreakdown from './PriceBreakdown';

interface GroupBuyDetailsProps {
  dealId: string;
}

// Mock data - replace with API call
const mockGroupBuy = {
  id: 1,
  title: 'iPhone 15 Pro Max 256GB',
  merchant: 'TechWorld Electronics',
  description: 'Latest iPhone with advanced camera system, titanium design, and A17 Pro chip. Includes 1-year warranty and free shipping.',
  originalPrice: 1199,
  currentPrice: 999,
  finalPrice: 849, // Price if target is reached
  discount: 17,
  maxDiscount: 29,
  participants: 847,
  targetParticipants: 1000,
  endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 2 days 14 hours from now
  images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
  category: 'Electronics',
  rating: 4.8,
  reviews: 1247,
  verified: true,
  features: [
    'A17 Pro chip with 6-core GPU',
    'Pro camera system with 5x Telephoto',
    'Titanium design',
    'Action Button',
    'USB-C connector',
    '1-year warranty included'
  ],
  priceBreaks: [
    { participants: 100, price: 1149, discount: 4 },
    { participants: 300, price: 1099, discount: 8 },
    { participants: 500, price: 1049, discount: 13 },
    { participants: 750, price: 999, discount: 17 },
    { participants: 1000, price: 849, discount: 29 }
  ],
  recentParticipants: [
    { name: 'Sarah M.', avatar: '/api/placeholder/40/40', joinedAt: '2 minutes ago' },
    { name: 'Mike R.', avatar: '/api/placeholder/40/40', joinedAt: '5 minutes ago' },
    { name: 'Lisa K.', avatar: '/api/placeholder/40/40', joinedAt: '8 minutes ago' },
    { name: 'John D.', avatar: '/api/placeholder/40/40', joinedAt: '12 minutes ago' }
  ]
};

export default function GroupBuyDetails({ dealId }: GroupBuyDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const progressPercentage = (mockGroupBuy.participants / mockGroupBuy.targetParticipants) * 100;
  const currentPriceBreak = mockGroupBuy.priceBreaks
    .filter(pb => mockGroupBuy.participants >= pb.participants)
    .pop() || mockGroupBuy.priceBreaks[0];

  const nextPriceBreak = mockGroupBuy.priceBreaks
    .find(pb => mockGroupBuy.participants < pb.participants);

  const handleJoinGroupBuy = () => {
    setHasJoined(true);
    // Here you would typically make an API call to join the group buy
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-[#F3AF7B] mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Deals
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="relative mb-4 rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-[#F3AF7B]/20 to-[#F4C2B8]/20 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Product Image {selectedImage + 1}</span>
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {mockGroupBuy.verified && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Verified
                </div>
              )}
              <div className="bg-[#E2FBEE] text-[#F3AF7B] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Users className="w-4 h-4" />
                Group Buy
              </div>
            </div>

            {/* Save & Share */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-full transition-all ${
                  isSaved ? 'bg-red-100 text-red-500' : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3">
            {mockGroupBuy.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-[#F3AF7B]' : 'border-gray-200'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#F3AF7B]/20 to-[#F4C2B8]/20 flex items-center justify-center">
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{mockGroupBuy.title}</h1>
            <p className="text-gray-600 mb-3">{mockGroupBuy.merchant}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{mockGroupBuy.rating}</span>
                <span className="text-gray-500">({mockGroupBuy.reviews} reviews)</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600">{mockGroupBuy.category}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-6">
            <CountdownTimer endTime={mockGroupBuy.endTime} />
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">
                {mockGroupBuy.participants} / {mockGroupBuy.targetParticipants} joined
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] h-3 rounded-full"
              />
            </div>
            {nextPriceBreak && (
              <p className="text-sm text-gray-600">
                {nextPriceBreak.participants - mockGroupBuy.participants} more people needed for next price drop!
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <PriceBreakdown 
            currentPrice={currentPriceBreak.price}
            originalPrice={mockGroupBuy.originalPrice}
            finalPrice={mockGroupBuy.finalPrice}
            currentDiscount={currentPriceBreak.discount}
            maxDiscount={mockGroupBuy.maxDiscount}
          />

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#F3AF7B] transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#F3AF7B] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Join Button */}
          <div className="mb-8">
            {hasJoined ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-green-800">You've joined this group buy!</p>
                  <p className="text-sm text-green-600">You'll be charged when the deal closes.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleJoinGroupBuy}
                className="w-full bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300"
              >
                Join Group Buy - ${currentPriceBreak.price * quantity}
              </button>
            )}
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {mockGroupBuy.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Participants */}
          <ParticipantsList participants={mockGroupBuy.recentParticipants} />
        </div>
      </div>

      {/* Description */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h3>
        <p className="text-gray-600 leading-relaxed">{mockGroupBuy.description}</p>
      </div>
    </div>
  );
}