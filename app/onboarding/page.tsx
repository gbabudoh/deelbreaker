'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Store, Zap, Check, ArrowRight } from 'lucide-react';
import { useRole } from '@/lib/role-context';

const buyerFeatures = [
  'Discover exclusive flash deals',
  'Join group buys for extra savings',
  'Earn cashback on every purchase',
  'AI-powered deal recommendations',
  'Save deals & get price alerts',
];

const sellerFeatures = [
  'List deals to thousands of buyers',
  'Real-time analytics dashboard',
  'Automated payment processing',
  'Group buy campaign tools',
  'Verified seller badge',
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const { role, onboardingComplete, isLoading, setRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/onboarding');
      return;
    }
    if (!isLoading && role) {
      if (onboardingComplete) {
        router.push(role === 'SELLER' ? '/seller' : '/dashboard');
      } else {
        router.push(role === 'SELLER' ? '/onboarding/seller' : '/onboarding/buyer');
      }
    }
  }, [status, isLoading, role, onboardingComplete, router]);

  const handleSelect = (selected: 'BUYER' | 'SELLER') => {
    setRole(selected);
    router.push(selected === 'BUYER' ? '/onboarding/buyer' : '/onboarding/seller');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-center py-6 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent">
            Deelbreaker
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-lg"
        >
          {session?.user?.name && (
            <p className="text-sm font-medium text-[#F3AF7B] mb-2 uppercase tracking-widest">
              Welcome, {session.user.name.split(' ')[0]}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            How will you use{' '}
            <span className="bg-gradient-to-r from-[#F3AF7B] to-[#F4C2B8] bg-clip-text text-transparent">
              Deelbreaker?
            </span>
          </h1>
          <p className="text-gray-500 text-lg">
            Choose your role to get a personalised experience. You can always switch later.
          </p>
        </motion.div>

        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Buyer Card */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('BUYER')}
            className="group relative bg-white rounded-3xl border-2 border-gray-100 hover:border-indigo-300 p-8 text-left shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-50/60 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg mb-5">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1.5">I&apos;m a Buyer</h2>
              <p className="text-gray-500 text-sm mb-5">Discover deals, save money, earn cashback</p>
              <ul className="space-y-2.5 mb-6">
                {buyerFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Seller Card */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('SELLER')}
            className="group relative bg-white rounded-3xl border-2 border-gray-100 hover:border-[#F3AF7B] p-8 text-left shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-50/60 to-amber-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-2xl flex items-center justify-center shadow-lg mb-5">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1.5">I&apos;m a Seller</h2>
              <p className="text-gray-500 text-sm mb-5">List deals, reach customers, grow your business</p>
              <ul className="space-y-2.5 mb-6">
                {sellerFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#F3AF7B]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-[#F3AF7B] font-semibold text-sm group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-gray-400"
        >
          By continuing you agree to Deelbreaker&apos;s{' '}
          <span className="text-[#F3AF7B] cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-[#F3AF7B] cursor-pointer hover:underline">Privacy Policy</span>.
        </motion.p>
      </div>
    </div>
  );
}
