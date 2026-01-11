'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Calendar, Users, DollarSign, Tag, Info } from 'lucide-react';

export default function CreateDeal() {
  const [dealType, setDealType] = useState<'instant' | 'group-buy'>('instant');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    originalPrice: '',
    discountPrice: '',
    cashbackAmount: '',
    targetParticipants: '',
    duration: '',
    images: [] as File[],
    features: [''],
    terms: ''
  });

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 
    'Books', 'Automotive', 'Health', 'Toys', 'Food & Beverage'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating deal:', { ...formData, type: dealType });
    // Handle form submission
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Deal</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Deal Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Deal Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDealType('instant')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-colors ${
                  dealType === 'instant'
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Instant Deal</h3>
                </div>
                <p className="text-sm text-gray-600 text-left">
                  Customers get immediate cashback and discounts. Perfect for clearing inventory quickly.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDealType('group-buy')}
                className={`cursor-pointer p-6 rounded-xl border-2 transition-colors ${
                  dealType === 'group-buy'
                    ? 'border-[#F3AF7B] bg-[#F3AF7B]/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Group Buy</h3>
                </div>
                <p className="text-sm text-gray-600 text-left">
                  Price drops as more people join. Great for demand forecasting and bulk sales.
                </p>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Product Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max 256GB"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed product description..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Original Price ($)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                placeholder="999.99"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {dealType === 'instant' ? 'Discount Price ($)' : 'Starting Price ($)'}
              </label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => handleInputChange('discountPrice', e.target.value)}
                placeholder="799.99"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                required
              />
            </div>

            {dealType === 'instant' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Cashback Amount ($)</label>
                <input
                  type="number"
                  value={formData.cashbackAmount}
                  onChange={(e) => handleInputChange('cashbackAmount', e.target.value)}
                  placeholder="50.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Target Participants</label>
                <input
                  type="number"
                  value={formData.targetParticipants}
                  onChange={(e) => handleInputChange('targetParticipants', e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                  required={dealType === 'group-buy'}
                />
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {dealType === 'instant' ? 'Deal Duration (days)' : 'Group Buy Duration (days)'}
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="7"
                min="1"
                max="30"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Product Features */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Key Features</label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g., A17 Pro chip with 6-core GPU"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="cursor-pointer px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="cursor-pointer text-[#F3AF7B] hover:text-[#F3AF7B]/80 font-medium"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#F3AF7B] transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB each (max 5 images)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData(prev => ({ ...prev, images: Array.from(e.target.files!) }));
                  }
                }}
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Deal terms, shipping info, warranty details..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F3AF7B] focus:border-transparent"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Deal Review Process</p>
                <p>
                  Your deal will be reviewed within 24 hours. You'll receive an email notification once it's approved and live on the platform.
                  {dealType === 'group-buy' && ' Group buy deals require additional verification for pricing tiers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              className="cursor-pointer flex-1 py-3 px-6 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 py-3 px-6 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}