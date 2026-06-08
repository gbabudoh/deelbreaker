'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export type UserRole = 'BUYER' | 'SELLER';

interface RoleContextValue {
  role: UserRole | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state from database / localStorage
  useEffect(() => {
    if (status === 'loading') return;

    async function syncProfile() {
      // Initialize from localStorage first for fast initial paint
      try {
        const storedRole = localStorage.getItem('db_user_role') as UserRole | null;
        const storedComplete = localStorage.getItem('db_onboarding_complete');
        if (storedRole === 'BUYER' || storedRole === 'SELLER') {
          setRoleState(storedRole);
        }
        if (storedComplete === 'true') {
          setOnboardingComplete(true);
        }
      } catch {}

      if (status === 'unauthenticated') {
        setIsLoading(false);
        return;
      }

      try {
        const isMerchant = session?.user?.userType === 'merchant';
        const endpoint = isMerchant ? '/api/merchant/profile' : '/api/user/profile';
        const res = await fetch(endpoint);
        
        if (res.ok) {
          const data = await res.json();
          if (isMerchant) {
            if (data.merchant) {
              setRoleState('SELLER');
              localStorage.setItem('db_user_role', 'SELLER');
              if (data.merchant.onboardingComplete) {
                setOnboardingComplete(true);
                localStorage.setItem('db_onboarding_complete', 'true');
              } else {
                setOnboardingComplete(false);
                localStorage.setItem('db_onboarding_complete', 'false');
              }
            } else {
              setRoleState('SELLER');
              localStorage.setItem('db_user_role', 'SELLER');
              setOnboardingComplete(false);
              localStorage.setItem('db_onboarding_complete', 'false');
            }
          } else {
            if (data.profile) {
              const userRole = data.profile.role as UserRole | null;
              if (userRole === 'BUYER' || userRole === 'SELLER') {
                setRoleState(userRole);
                localStorage.setItem('db_user_role', userRole);
              }
              if (data.profile.onboardingComplete) {
                setOnboardingComplete(true);
                localStorage.setItem('db_onboarding_complete', 'true');
              } else {
                setOnboardingComplete(false);
                localStorage.setItem('db_onboarding_complete', 'false');
              }
            }
          }
        }
      } catch (err) {
        console.error('Error syncing profile with role-context:', err);
      } finally {
        setIsLoading(false);
      }
    }

    syncProfile();
  }, [session, status]);

  const setRole = useCallback(async (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('db_user_role', newRole);
      
      const isMerchant = session?.user?.userType === 'merchant';
      if (!isMerchant) {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });
      }
    } catch (err) {
      console.error('Error saving role selection:', err);
    }
  }, [session]);

  const completeOnboarding = useCallback(async () => {
    setOnboardingComplete(true);
    try {
      localStorage.setItem('db_onboarding_complete', 'true');
      
      const isMerchant = session?.user?.userType === 'merchant';
      if (!isMerchant) {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboardingComplete: true, role })
        });
      }
    } catch (err) {
      console.error('Error saving onboarding completion:', err);
    }
  }, [session, role]);

  const reset = useCallback(() => {
    setRoleState(null);
    setOnboardingComplete(false);
    try {
      localStorage.removeItem('db_user_role');
      localStorage.removeItem('db_onboarding_complete');
      localStorage.removeItem('db_buyer_prefs');
      localStorage.removeItem('db_seller_profile');
    } catch {}
  }, []);

  return (
    <RoleContext.Provider value={{ role, onboardingComplete, isLoading, setRole, completeOnboarding, reset }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
