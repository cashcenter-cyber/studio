'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';

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

  // Correct URL format as per Timewall documentation
  const iframeUrl = `https://timewall.com/users/login?app=${TIMEWALL_APP_ID}&user=${user.uid}`;

  return (
    <GlassCard className="w-full">
        <iframe
            src={iframeUrl}
            className="w-full h-[80vh] min-h-[600px] border-0 rounded-xl"
            title="Timewall Offerwall"
        />
    </GlassCard>
  );
}
