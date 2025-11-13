'use client';

import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { useUser } from '@/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userProfile, isUserLoading } = useUser();

  // The main loading state is now handled by the useUser hook.
  // The global "Initializing" screen is no longer needed here as the useUser hook
  // will provide the isUserLoading state to consumers like DashboardLayout.

  return (
    <AuthContext.Provider value={{ user, userProfile, loading: isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
