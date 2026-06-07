'use client';

import { useEffect } from 'react';
import { useRole } from '@/lib/role-context';
import { useRouter } from 'next/navigation';
import UserDashboard from '../components/dashboard/UserDashboard';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F3AF7B]"></div>
    </div>
  );
}

export default function DashboardPage() {
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
    if (role === 'SELLER') {
      router.push('/seller');
      return;
    }
  }, [role, onboardingComplete, isLoading, router]);

  if (isLoading || role !== 'BUYER') return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserDashboard />
    </div>
  );
}
