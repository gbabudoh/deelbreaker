'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, TrendingUp, Megaphone } from 'lucide-react';
import Link from 'next/link';

interface CampaignDeal {
  id: string;
  title: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  type: string;
  endDate: string;
  category: string;
  merchant: {
    name: string;
  };
  _count: {
    orders: number;
  };
}

interface Campaign {
  id: string;
  dealId: string | null;
  deal: CampaignDeal | null;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  pricePaid: number;
  isPaidPromotion: boolean;
  isActive: boolean;
}

function calculateTimeLeft(targetDate: string) {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) return 'Expired';

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

export default function MarketplaceHero() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Sync country selection from global header selection
  useEffect(() => {
    const loadCountry = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('user-country');
        setSelectedCountry(saved || 'US');
      }
    };
    loadCountry();
    window.addEventListener('countryChange', loadCountry);
    return () => window.removeEventListener('countryChange', loadCountry);
  }, []);

  // Fetch active campaign based on selected country
  useEffect(() => {
    async function fetchActiveCampaign() {
      try {
        let url = '/api/promotions/active';
        if (selectedCountry) {
          url += `?country=${encodeURIComponent(selectedCountry)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCampaign(data.campaign || null);
          }
        }
      } catch (error) {
        console.error('Error fetching active promotion campaign:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActiveCampaign();
  }, [selectedCountry]);

  // Timer loop
  useEffect(() => {
    if (!campaign) return;

    const targetEnd = campaign.deal ? campaign.deal.endDate : campaign.endDate;
    setTimeLeft(calculateTimeLeft(targetEnd));

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(targetEnd);
      setTimeLeft(remaining);

      if (remaining === 'Expired') {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  if (loading) {
    return (
      <section className="pt-6 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gray-950 min-h-80 aspect-21/9 sm:aspect-21/7 animate-pulse">
            <div className="absolute inset-0 bg-gray-900/50" />
          </div>
        </div>
      </section>
    );
  }

  // Fallback layout (if no active campaign is returned)
  const defaultBanner = {
    title: "Up to 60% Off Premium Home Electronics",
    description: "Discover exclusive deals on the latest smart home devices. Join 500+ savvy shoppers already saving big today.",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80",
    buttonLink: "/deals/featured",
    badgeText: "TOP DEAL OF THE DAY",
    badgeIcon: Zap,
    showStats: true,
    statsJoined: "1.2k+ Joined",
    statsSaving: "Saving $45.00 avg.",
    timeLeftText: "14h 25m"
  };

  const currentPromo = campaign ? {
    title: campaign.title,
    description: campaign.description,
    imageUrl: campaign.imageUrl,
    buttonLink: campaign.dealId ? `/deal/${campaign.dealId}` : '/deals/featured',
    badgeText: campaign.isPaidPromotion ? "FEATURED MERCHANT DEAL" : "DEELBREAKER SPECIAL OFFER",
    badgeIcon: campaign.isPaidPromotion ? Zap : Megaphone,
    showStats: !!campaign.deal,
    statsJoined: campaign.deal ? `${campaign.deal._count.orders} Joined` : "",
    statsSaving: campaign.deal ? `Saving $${(campaign.deal.originalPrice - campaign.deal.currentPrice).toFixed(2)} each` : "",
    timeLeftText: timeLeft
  } : defaultBanner;

  const BadgeIcon = currentPromo.badgeIcon;

  return (
    <section className="pt-6 pb-8">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gray-900 min-h-80 aspect-21/9 sm:aspect-21/7">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
            style={{ backgroundImage: `url(${currentPromo.imageUrl})` }}
          />
          {/* Layered gradient: strong left for text, soft vignette bottom */}
          <div className="absolute inset-0 bg-linear-to-r from-gray-950 via-gray-950/80 to-gray-900/20 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-transparent z-10" />

          <div className="relative z-20 h-full flex flex-col justify-center px-8 lg:px-16 max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#F3AF7B] border border-[#F3AF7B]/40 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit shadow-lg"
            >
              <BadgeIcon className="w-4 h-4" />
              {currentPromo.badgeText}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-md"
            >
              {currentPromo.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-200 text-base sm:text-lg mb-8 line-clamp-2 max-w-lg drop-shadow-sm leading-relaxed"
            >
              {currentPromo.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <Link
                href={currentPromo.buttonLink}
                className="bg-white text-gray-900 px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 hover:shadow-xl transition-all transform hover:scale-105 shadow-md"
              >
                View Deal
              </Link>
              {currentPromo.timeLeftText && currentPromo.timeLeftText !== 'Expired' && (
                <div className="flex items-center gap-2 text-white font-semibold bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 text-sm shadow-sm">
                  <Clock className="w-4.5 h-4.5 text-[#F3AF7B]" />
                  <span>Ends in: {currentPromo.timeLeftText}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Floating stats widget */}
          {currentPromo.showStats && (
            <div className="absolute bottom-6 right-8 z-20 hidden md:flex flex-col items-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 bg-gray-950/85 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl"
              >
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F3AF7B] to-[#F4C2B8] flex items-center justify-center shadow-inner shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{currentPromo.statsJoined}</div>
                  <div className="text-[#F3AF7B] font-medium text-xs">{currentPromo.statsSaving}</div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
