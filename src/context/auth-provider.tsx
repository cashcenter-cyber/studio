'use client';

import { createContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, userProfile, isUserLoading } = useUser();
  
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-headline text-lg">Loading Dashboard...</p>
          </div>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading: isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
