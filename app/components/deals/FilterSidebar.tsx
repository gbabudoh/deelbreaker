'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterChangeParams {
  categories: string[];
  priceRange: [number, number];
  dealType: string;
  discount: number;
  rating: number;
  merchants: string[];
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterChangeParams) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterChangeParams>({
    categories: [],
    priceRange: [0, 2000],
    dealType: 'all',
    discount: 0,
    rating: 0,
    merchants: []
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    dealType: true,
    discount: true,
    rating: true,
    merchants: false
  });

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 
    'Books', 'Automotive', 'Health', 'Toys', 'Food & Beverage'
  ];

  const merchants = [
    'TechWorld', 'SportZone', 'AppleStore', 'ElectroMart', 'FashionHub',
    'HomeDepot', 'BeautyBox', 'BookStore', 'AutoParts', 'HealthPlus'
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof FilterChangeParams, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterChangeParams = {
      categories: [],
      priceRange: [0, 2000],
      dealType: 'all',
      discount: 0,
      rating: 0,
      merchants: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Deal Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('dealType')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Deal Type</h4>
          {expandedSections.dealType ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.dealType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {['all', 'group-buy', 'instant'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="dealType"
                  value={type}
                  checked={filters.dealType === type}
                  onChange={(e) => updateFilter('dealType', e.target.value)}
                  className="mr-3 text-[#F3AF7B] focus:ring-[#F3AF7B]"
                />
                <span className="text-gray-700 capitalize">
                  {type === 'all' ? 'All Deals' : type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Categories</h4>
          {expandedSections.categories ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.categories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 max-h-48 overflow-y-auto"
          >
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, category]
                      : filters.categories.filter(c => c !== category);
                    updateFilter('categories', newCategories);
                  }}
                  className="mr-3 text-[#F3AF7B] focus:ring-[#F3AF7B] rounded"
                />
                <span className="text-gray-700">{category}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Price Range</h4>
          {expandedSections.price ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.price && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 2000])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F3AF7B]"
              />
            </div>
            <div className="text-sm text-gray-600">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </div>
          </motion.div>
        )}
      </div>

      {/* Minimum Discount */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('discount')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Minimum Discount</h4>
          {expandedSections.discount ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.discount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {[0, 10, 20, 30, 50].map((discount) => (
              <label key={discount} className="flex items-center">
                <input
                  type="radio"
                  name="discount"
                  value={discount}
                  checked={filters.discount === discount}
                  onChange={(e) => updateFilter('discount', parseInt(e.target.value))}
                  className="mr-3 text-[#F3AF7B] focus:ring-[#F3AF7B]"
                />
                <span className="text-gray-700">
                  {discount === 0 ? 'Any discount' : `${discount}% or more`}
                </span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Minimum Rating</h4>
          {expandedSections.rating ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.rating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {[0, 3, 4, 4.5].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
                  className="mr-3 text-[#F3AF7B] focus:ring-[#F3AF7B]"
                />
                <span className="text-gray-700">
                  {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                </span>
              </label>
            ))}
          </motion.div>
        )}
      </div>

      {/* Merchants */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('merchants')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className="font-semibold text-gray-800">Merchants</h4>
          {expandedSections.merchants ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.merchants && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 max-h-48 overflow-y-auto"
          >
            {merchants.map((merchant) => (
              <label key={merchant} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.merchants.includes(merchant)}
                  onChange={(e) => {
                    const newMerchants = e.target.checked
                      ? [...filters.merchants, merchant]
                      : filters.merchants.filter(m => m !== merchant);
                    updateFilter('merchants', newMerchants);
                  }}
                  className="mr-3 text-[#F3AF7B] focus:ring-[#F3AF7B] rounded"
                />
                <span className="text-gray-700">{merchant}</span>
              </label>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}