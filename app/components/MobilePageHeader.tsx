'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Share2, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: ReactNode;
  showShare?: boolean;
  showFavorite?: boolean;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  transparent?: boolean;
  className?: string;
}

export default function MobilePageHeader({
  title,
  subtitle,
  showBack = true,
  backHref,
  rightAction,
  showShare = false,
  showFavorite = false,
  onShare,
  onFavorite,
  isFavorited = false,
  transparent = false,
  className = '',
}: MobilePageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-40 ${
        transparent 
          ? 'bg-transparent' 
          : 'bg-white/95 backdrop-blur-lg border-b border-gray-100'
      } safe-top ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left Section - Back Button */}
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="cursor-pointer p-2 -ml-2 text-gray-700 hover:text-[#F3AF7B] transition-colors touch-target touch-active rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          {showShare && (
            <button
              onClick={onShare}
              className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-target touch-active rounded-full hover:bg-gray-100"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          )}
          
          {showFavorite && (
            <button
              onClick={onFavorite}
              className={`cursor-pointer p-2 transition-colors touch-target touch-active rounded-full hover:bg-gray-100 ${
                isFavorited ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          )}
          
          {rightAction}
        </div>
      </div>
    </motion.header>
  );
}

// Compact version for nested pages
export function MobileSubHeader({
  title,
  onBack,
  rightAction,
}: {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
      <button
        onClick={handleBack}
        className="cursor-pointer p-1.5 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-active rounded-lg hover:bg-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <span className="flex-1 font-medium text-gray-800">{title}</span>
      {rightAction}
    </div>
  );
}
