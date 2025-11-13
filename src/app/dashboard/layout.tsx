'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Loader2 } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne rien faire tant que l'état d'authentification est en cours de chargement.
    if (loading) {
      return;
    }
    // Une fois le chargement terminé, si l'utilisateur n'est pas connecté, rediriger.
    if (!user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Affiche l'écran de chargement si l'authentification est en cours
  // OU si l'utilisateur n'est pas encore chargé (évite un flash de contenu).
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-headline text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Si le chargement est terminé et que l'utilisateur est bien connecté, affiche le tableau de bord.
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
