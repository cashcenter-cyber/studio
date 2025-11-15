'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { ChatBubble } from '@/components/chat/chat-bubble';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading is complete
    if (isLoading) {
      return;
    }
    // If loading is finished and there's no user, redirect
    if (!user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // While loading, show a spinner. This prevents a flash of content or a premature redirect.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-headline text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If loading is complete and we have a user, render the dashboard
  if (user) {
      return (
        <div className="min-h-screen w-full flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
          <ChatBubble />
          <Footer />
        </div>
      );
  }

  // If there's no user after loading, this will be null, and the redirect will handle it.
  return null;
}
