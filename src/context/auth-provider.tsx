'use client';

import { createContext } from 'react';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userProfile, isUserLoading } = useUser();
  
  // This top-level provider still handles the initial app load state.
  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="font-headline text-lg">Initializing...</p>
          </div>
        </div>
      );
  }

  // The value provided here might be consumed by other, more specific legacy contexts if needed.
  return (
    <AuthContext.Provider value={{ user, userProfile, loading: isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
