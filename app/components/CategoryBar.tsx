'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Flashlight,
  ShoppingBag,
  MapPin,
  Plane,
  Utensils,
  Sparkles,
  Scissors,
  Laptop
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Featured', icon: Sparkles, href: '/deals/featured' },
  { name: 'Local', icon: MapPin, href: '/deals/local' },
  { name: 'Goods', icon: ShoppingBag, href: '/deals/goods' },
  { name: 'Travel', icon: Plane, href: '/deals/travel' },
  { name: 'Dining', icon: Utensils, href: '/deals/dining' },
  { name: 'Beauty', icon: Scissors, href: '/deals/beauty' },
  { name: 'Tech', icon: Laptop, href: '/deals/tech' },
  { name: 'Coupons', icon: Flashlight, href: '/deals/coupons' },
];

export default function CategoryBar() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-100 pt-16 lg:pt-20 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-3">
          {categories.map((cat, i) => {
            const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="shrink-0"
              >
                <Link
                  href={cat.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-[#F3AF7B]/10'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#F3AF7B]/15'
                      : 'bg-gray-50 group-hover:bg-[#F3AF7B]/10'
                  }`}>
                    <cat.icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-[#F3AF7B]' : 'text-gray-500 group-hover:text-[#F3AF7B]'
                    }`} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? 'text-[#F3AF7B]' : 'text-gray-500 group-hover:text-gray-900'
                  }`}>
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
