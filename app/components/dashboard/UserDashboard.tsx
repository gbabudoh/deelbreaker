'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Wallet, Heart, Clock, TrendingUp, Gift, Settings, Bell, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import DashboardStats from './DashboardStats';
import SavedDeals from './SavedDeals';
import CashbackHistory from './CashbackHistory';
import ActiveGroupBuys from './ActiveGroupBuys';
import ProfileSettings from './ProfileSettings';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'from-blue-400 to-blue-500' },
    { id: 'saved', label: 'Saved', icon: Heart, color: 'from-red-400 to-red-500' },
    { id: 'active', label: 'Orders & Vouchers', icon: Clock, color: 'from-green-400 to-green-500' },
    { id: 'cashback', label: 'Cashback', icon: Wallet, color: 'from-[#F3AF7B] to-[#F4C2B8]' },
    { id: 'profile', label: 'Profile', icon: User, color: 'from-purple-400 to-purple-500' },
  ];

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.profile) {
            setProfile(data.profile);
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [session]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/consumer/dashboard?tab=${tabId}`, { scroll: false });
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]"></div>
      </div>
    );
  }

  // Fallback in case fetch fails
  const displayProfile = profile || {
    name: session?.user?.name || 'User',
    email: session?.user?.email || '',
    avatar: null,
    memberSince: 'Joined recently',
    totalSavings: 0,
    cashbackBalance: 0,
    dealsJoined: 0,
    groupBuysCompleted: 0,
    level: 'Bronze Member',
    nextLevelProgress: 0
  };



  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.push('/')}
            className="cursor-pointer p-2 -ml-2 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-active rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-1">
            <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors relative touch-active rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="cursor-pointer p-2 text-gray-600 hover:text-[#F3AF7B] transition-colors touch-active rounded-full">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Back Button */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 pt-6">
        <button 
          onClick={() => router.push('/')}
          className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-[#F3AF7B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Homepage</span>
        </button>
      </div>

      <div className="mobile-container py-4 lg:py-8 max-w-7xl mx-auto">
        {/* User Profile Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl lg:rounded-3xl p-4 lg:p-6 mb-4 lg:mb-8 text-white shadow-lg"
        >
          <div className="flex items-center gap-3 lg:gap-4 mb-4">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg lg:text-xl font-bold border-2 border-white/30 font-sans">
              {displayProfile.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-2xl font-bold truncate">Hi, {displayProfile.name.split(' ')[0]}!</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-white/80 text-xs lg:text-sm bg-white/10 px-2 py-0.5 rounded-full border border-white/20">{displayProfile.level}</span>
                <span className="text-white/80 text-xs lg:text-sm bg-white/10 px-2 py-0.5 rounded-full border border-white/20">{displayProfile.memberSince}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <button className="cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors touch-active">
                <Bell className="w-5 h-5" />
              </button>
              <button className="cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors touch-active">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/90">Progress Status</span>
              <span className="text-sm font-bold">{displayProfile.nextLevelProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 lg:h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${displayProfile.nextLevelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white h-full rounded-full"
              />
            </div>
            <p className="text-xs lg:text-sm text-white/70 mt-2">
              {displayProfile.level === 'Platinum Member' 
                ? 'Maximum Platinum benefits unlocked!' 
                : 'Join more flash deals to unlock the next membership tier benefits!'}
            </p>
          </div>
        </motion.div>

        {/* Quick Stats - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 lg:hidden mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Cashback</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${displayProfile.cashbackBalance.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Saved Savings</span>
            </div>
            <p className="text-xl font-bold text-gray-900">${displayProfile.totalSavings.toFixed(2)}</p>
          </div>
        </div>

        {/* Navigation Tabs - Horizontal Scroll on Mobile */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 mb-4 lg:mb-8 overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`cursor-pointer flex-shrink-0 flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-all whitespace-nowrap touch-active ${
                    isActive
                      ? 'text-[#F3AF7B] border-b-2 border-[#F3AF7B] bg-[#F3AF7B]/5'
                      : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? `bg-gradient-to-br ${tab.color}` : 'bg-gray-100'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <span className="text-sm lg:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <DashboardStats userData={displayProfile} />}
            {activeTab === 'saved' && <SavedDeals />}
            {activeTab === 'active' && <ActiveGroupBuys />}
            {activeTab === 'cashback' && <CashbackHistory />}
            {activeTab === 'profile' && <ProfileSettings userData={displayProfile} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
