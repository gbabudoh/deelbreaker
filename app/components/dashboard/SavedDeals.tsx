'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  Bell, 
  BellOff, 
  Package, 
  MapPin, 
  Laptop, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

interface SavedDealItem {
  id: string;
  userId: string;
  dealId: string;
  priceAlert: boolean;
  targetPrice: number | null;
  swoopaActive: boolean;
  savedAt: string;
  deal: {
    id: string;
    title: string;
    description: string;
    category: string;
    originalPrice: number;
    currentPrice: number;
    discount: number;
    type: string;
    images: string[];
    verified: boolean;
    featured: boolean;
    trending: boolean;
    merchant: {
      id: string;
      name: string;
      logo: string | null;
      verified: boolean;
      avgRating?: number;
    };
  };
}

export default function SavedDeals() {
  const [savedDeals, setSavedDeals] = useState<SavedDealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [targetPrices, setTargetPrices] = useState<Record<string, string>>({});

  const fetchSavedDeals = async () => {
    try {
      const res = await fetch('/api/user/saved-deals');
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setSavedDeals(data);
        
        // Initialize target prices inputs
        const prices: Record<string, string> = {};
        data.forEach((item: SavedDealItem) => {
          prices[item.dealId] = item.targetPrice !== null ? item.targetPrice.toString() : '';
        });
        setTargetPrices(prices);
      }
    } catch (error) {
      console.error('Failed to load saved deals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedDeals();
  }, []);

  const removeDeal = async (dealId: string) => {
    try {
      const res = await fetch(`/api/user/saved-deals/${dealId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSavedDeals(deals => deals.filter(item => item.dealId !== dealId));
      }
    } catch (error) {
      console.error('Failed to remove deal:', error);
    }
  };

  const handleUpdateDeal = async (dealId: string, updates: Partial<SavedDealItem>) => {
    setUpdatingId(dealId);
    try {
      const res = await fetch(`/api/user/saved-deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setSavedDeals(deals => deals.map(item => 
          item.dealId === dealId 
            ? { ...item, ...updates } 
            : item
        ));
      }
    } catch (error) {
      console.error('Failed to update deal alerts:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculates Deal Attractiveness Index (DAI) dynamically (0 - 100)
  const calculateDAI = (item: SavedDealItem) => {
    const { deal } = item;
    const ratingScore = 24; // Default baseline rating points (out of 30)
    const verificationScore = deal.verified ? 10 : 0;
    const trendingScore = deal.trending ? 10 : 0;
    const discountScore = Math.min(50, deal.discount * 1.2); // max 50 points for discount

    return Math.round(Math.min(100, discountScore + ratingScore + verificationScore + trendingScore));
  };

  const handleTargetPriceChange = (dealId: string, val: string) => {
    setTargetPrices(prev => ({ ...prev, [dealId]: val }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#F3AF7B] animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Loading saved deals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Saved Deals
            <Sparkles className="w-5 h-5 text-[#F3AF7B]" />
          </h2>
          <p className="text-xs text-gray-500">Track discounts and activate Swoopa price-drop hunting.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {savedDeals.length} saved
          </span>
        </div>
      </div>

      {/* Deals List */}
      <AnimatePresence>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedDeals.map((item, index) => {
            const { deal } = item;
            const daiScore = calculateDAI(item);
            const isSwoopaActive = item.swoopaActive;
            const savedDateLabel = new Date(item.savedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });

            // Color coordinate DAI scores
            let daiColor = 'text-red-500 bg-red-50 border-red-100';
            if (daiScore >= 80) daiColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
            else if (daiScore >= 50) daiColor = 'text-amber-700 bg-amber-50 border-amber-100';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between"
              >
                {/* Image & Badges Section */}
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  {deal.images && deal.images[0] ? (
                    <img 
                      src={deal.images[0]} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Product Image</span>
                  )}
                  
                  {/* Category Type Badge */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-col items-start">
                    {deal.type === 'PHYSICAL_PRODUCT' ? (
                      <div className="bg-indigo-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        <Package className="w-3 h-3" />
                        Physical
                      </div>
                    ) : deal.type === 'LOCAL_SERVICE' ? (
                      <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        Service
                      </div>
                    ) : (
                      <div className="bg-purple-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        <Laptop className="w-3 h-3" />
                        Digital
                      </div>
                    )}

                    {/* DAI Score badge */}
                    <div className={`px-2 py-1 border rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm ${daiColor}`}>
                      <Activity className="w-3 h-3" />
                      DAI Score: {daiScore}
                    </div>
                  </div>

                  {/* Discount Percentage */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-sm">
                    -{deal.discount}%
                  </div>

                  {/* Actions (Delete/Alerts) */}
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleUpdateDeal(deal.id, { priceAlert: !item.priceAlert })}
                      disabled={updatingId === deal.id}
                      className={`cursor-pointer p-2 rounded-full shadow-md transition-colors touch-active ${
                        item.priceAlert 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-white text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                      }`}
                      title={item.priceAlert ? 'General alerts active' : 'General alerts inactive'}
                    >
                      {item.priceAlert ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeDeal(deal.id)}
                      className="cursor-pointer p-2 bg-white text-gray-600 hover:text-red-500 rounded-full shadow-md transition-colors touch-active hover:bg-gray-50"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-1 line-clamp-2">{deal.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">by {deal.merchant.name}</p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-gray-900">${deal.currentPrice}</span>
                      <span className="text-xs text-gray-400 line-through">${deal.originalPrice}</span>
                    </div>

                    {/* Swoopa Tracker UI */}
                    <div className="border-t border-gray-100 pt-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#F3AF7B]" />
                          Swoopa Target Hunt
                        </span>
                        
                        {/* Swoopa Toggle Button */}
                        <button
                          onClick={() => handleUpdateDeal(deal.id, { swoopaActive: !isSwoopaActive })}
                          disabled={updatingId === deal.id}
                          className={`cursor-pointer text-xxs px-2.5 py-1 rounded-full font-bold uppercase transition-all tracking-wider ${
                            isSwoopaActive 
                              ? 'bg-[#F3AF7B]/15 text-[#e09153] border border-[#F3AF7B]/30'
                              : 'bg-gray-100 text-gray-400 border border-transparent'
                          }`}
                        >
                          {isSwoopaActive ? 'Active' : 'Off'}
                        </button>
                      </div>

                      {isSwoopaActive ? (
                        <div className="flex gap-2 items-center bg-orange-50/20 p-2.5 rounded-xl border border-orange-100/50">
                          <span className="text-xs font-bold text-gray-500">$</span>
                          <input
                            type="number"
                            placeholder="Target price (e.g. 95)"
                            className="bg-transparent text-xs text-gray-800 focus:outline-none flex-1 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={targetPrices[deal.id] || ''}
                            onChange={(e) => handleTargetPriceChange(deal.id, e.target.value)}
                          />
                          <button
                            onClick={() => {
                              const val = targetPrices[deal.id];
                              handleUpdateDeal(deal.id, { 
                                targetPrice: val.trim() === '' ? null : parseFloat(val) 
                              });
                            }}
                            className="cursor-pointer bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white p-1 rounded-lg hover:shadow-sm transition-all"
                            title="Save target price"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xxs text-gray-400 italic">
                          Activate Swoopa to set custom alert prices and trigger immediate lock-screen push alerts.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <Link
                      href={`/deal/${deal.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-gray-800 transition-colors touch-active"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Deal Details
                    </Link>
                    <p className="text-[10px] text-gray-400 text-center mt-3 font-semibold">Saved {savedDateLabel}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {savedDeals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 px-4 bg-white border border-gray-100 rounded-3xl"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No saved deals yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Save deals you are interested in, then activate Swoopa to auto-hunt discounts.</p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all touch-active"
          >
            Browse Deals
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
