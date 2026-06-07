'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

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
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('db_user_role') as UserRole | null;
      const storedComplete = localStorage.getItem('db_onboarding_complete');
      if (storedRole === 'BUYER' || storedRole === 'SELLER') {
        setRoleState(storedRole);
      }
      if (storedComplete === 'true') {
        setOnboardingComplete(true);
      }
    } catch {
      // localStorage not available (SSR or private mode)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('db_user_role', newRole);
    } catch {}
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingComplete(true);
    try {
      localStorage.setItem('db_onboarding_complete', 'true');
    } catch {}
  }, []);

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
