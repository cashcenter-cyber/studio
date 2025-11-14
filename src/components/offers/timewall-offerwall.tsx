
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';

// Les variables sont maintenant directement disponibles grâce à la configuration de next.config.ts
const TIMEWALL_APP_ID = process.env.NEXT_PUBLIC_TIMEWALL_APP_ID;

export function TimewallOfferwall() {
  const { user } = useUser();

  if (!TIMEWALL_APP_ID) {
    return <div className="text-destructive">Timewall is not configured. Please set NEXT_PUBLIC_TIMEWALL_APP_ID in your environment variables.</div>;
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Construct the URL directly as per the user's provided iframe.
  const iframeUrl = `https://timewall.io/users/login?oid=${TIMEWALL_APP_ID}&uid=${user.uid}`;

  return (
    <GlassCard className="w-full">
        <iframe
            src={iframeUrl}
            className="w-full h-[80vh] min-h-[600px] border-0 rounded-xl"
            title="Timewall Offerwall"
            frameBorder="0"
            scrolling="auto"
        />
    </GlassCard>
  );
}
