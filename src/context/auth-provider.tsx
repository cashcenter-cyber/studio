'use client';

import { createContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    // Ne rien faire tant que l'état d'authentification est en cours de chargement.
    if (isUserLoading) {
      return;
    }
    // Une fois le chargement terminé, si l'utilisateur n'est pas connecté
    // ET que l'on n'est pas déjà sur une page publique, rediriger.
    if (!user && !['/auth', '/'].includes(window.location.pathname)) {
        // La redirection vers la page de connexion est gérée par le layout du dashboard
        // router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  // Affiche l'écran de chargement global si l'authentification est en cours
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

  // Si le chargement est terminé, affiche le contenu de l'application.
  // La protection de route spécifique se fera dans les layouts concernés.
  return (
    <AuthContext.Provider value={{ user, userProfile, loading: isUserLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
