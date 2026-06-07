'use client';

import { useEffect } from 'react';
import { useRole } from '@/lib/role-context';
import { useRouter } from 'next/navigation';
import SellerDashboard from '../components/seller/SellerDashboard';
import { Zap } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-[#F3AF7B] to-[#F4C2B8] rounded-xl flex items-center justify-center shadow-md animate-pulse">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#F3AF7B]"></div>
    </div>
  );
}

export default function SellerPage() {
  const { role, onboardingComplete, isLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!role) {
      router.push('/onboarding');
      return;
    }
    if (!onboardingComplete) {
      router.push(`/onboarding/${role.toLowerCase()}`);
      return;
    }
    if (role === 'BUYER') {
      router.push('/consumer/dashboard');
      return;
    }
  }, [role, onboardingComplete, isLoading, router]);

  if (isLoading || role !== 'SELLER') return <LoadingSpinner />;
  return <SellerDashboard />;
}
