'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Users, Zap, ArrowLeft } from 'lucide-react';
import DealCard from './DealCard';
import { FilterSidebar } from './index';

// Mock data - replace with API calls
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
  image: string;
  category: string;
  rating: number;
  verified: boolean;
  cashback?: number;
}

const mockDeals: Deal[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    merchant: 'TechWorld',
    originalPrice: 1199,
    currentPrice: 999,
    discount: 17,
    type: 'group-buy',
    participants: 847,
    targetParticipants: 1000,
    timeLeft: '2d 14h 32m',
    image: '/api/placeholder/300/200',
    category: 'Electronics',
    rating: 4.8,
    verified: true
  },
  {
    id: 2,
    title: 'Nike Air Max 270',
    merchant: 'SportZone',
    originalPrice: 150,
    currentPrice: 89,
    discount: 41,
    type: 'instant',
    cashback: 15,
    image: '/api/placeholder/300/200',
    category: 'Fashion',
    rating: 4.6,
    verified: true
  },
  {
    id: 3,
    title: 'MacBook Air M3',
    merchant: 'AppleStore',
    originalPrice: 1299,
    currentPrice: 1099,
    discount: 15,
    type: 'group-buy',
    participants: 234,
    targetParticipants: 500,
    timeLeft: '5d 8h 15m',
    image: '/api/placeholder/300/200',
    category: 'Electronics',
    rating: 4.9,
    verified: true
  },
  {
    id: 4,
    title: 'Samsung 65" QLED TV',
    merchant: 'ElectroMart',
    originalPrice: 1499,
    currentPrice: 899,
    discount: 40,
    type: 'instant',
    cashback: 50,
    image: '/api/placeholder/300/200',
    category: 'Electronics',
    rating: 4.7,
    verified: true
  }
];

interface FilterChangeParams {
  categories: string[];
  priceRange: [number, number];
  dealType: string;
  discount: number;
  rating: number;
  merchants: string[];
}

export default function DealsDiscovery() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [deals, setDeals] = useState<Deal[]>(mockDeals);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Filter deals based on search term
    const filtered = mockDeals.filter(deal => 
      deal.title.toLowerCase().includes(term.toLowerCase()) ||
      deal.merchant.toLowerCase().includes(term.toLowerCase()) ||
      deal.category.toLowerCase().includes(term.toLowerCase())
    );
    setDeals(filtered);
  };

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    const sorted = [...deals].sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'discount':
          return b.discount - a.discount;
        case 'rating':
          return b.rating - a.rating;
        case 'ending-soon':
          return a.type === 'group-buy' && b.type === 'group-buy' && a.timeLeft && b.timeLeft ? 
            a.timeLeft.localeCompare(b.timeLeft) : 0;
        default:
          return 0;
      }
    });
    setDeals(sorted);
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Deals</h1>
        <p className="text-gray-600">Find exclusive group buys and instant cashback offers</p>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals, brands, or categories..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Highest Rated</option>
              <option value="ending-soon">Ending Soon</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-[#F3AF7B]' : 'text-gray-500'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-[#F3AF7B]' : 'text-gray-500'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-[#F3AF7B] text-white rounded-xl hover:bg-[#F3AF7B]/90 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 flex-shrink-0"
          >
            <FilterSidebar onFilterChange={(filters: FilterChangeParams) => console.log(filters)} />
          </motion.div>
        )}

        {/* Deals Grid/List */}
        <div className="flex-1">
          {/* Deal Type Tabs */}
          <div className="flex gap-4 mb-6">
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-[#E2FBEE] text-[#F3AF7B] rounded-xl font-semibold">
              <Users className="w-5 h-5" />
              Group Buys
              <span className="bg-[#F3AF7B] text-white px-2 py-1 rounded-full text-sm">
                {deals.filter(d => d.type === 'group-buy').length}
              </span>
            </button>
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              <Zap className="w-5 h-5" />
              Instant Deals
              <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-sm">
                {deals.filter(d => d.type === 'instant').length}
              </span>
            </button>
          </div>

          {/* Deals Display */}
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DealCard deal={deal} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="cursor-pointer px-8 py-3 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
              Load More Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}