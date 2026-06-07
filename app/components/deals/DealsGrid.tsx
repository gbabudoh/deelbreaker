'use client';

import { motion } from 'framer-motion';
import DealCard from './DealCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Deal {
  id: number;
  title: string;
  merchant: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  type: 'PHYSICAL_PRODUCT' | 'LOCAL_SERVICE' | 'DIGITAL_SOFTWARE';
  participants?: number;
  targetParticipants?: number;
  timeLeft?: string;
  cashback?: number;
  image: string;
  category: string;
  rating: number;
  verified: boolean;
}

interface DealsGridProps {
  title: string;
  subtitle?: string;
  deals: Deal[];
  viewAllHref?: string;
}

export default function DealsGrid({ title, subtitle, deals, viewAllHref }: DealsGridProps) {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link 
              href={viewAllHref}
              className="text-[#F3AF7B] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} viewMode="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}
