'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';

// Les variables sont maintenant directement disponibles grâce à la configuration de next.config.ts
const CPX_APP_ID = process.env.NEXT_PUBLIC_CPX_APP_ID;
const CPX_IFRAME_HASH = process.env.NEXT_PUBLIC_CPX_IFRAME_HASH;

export function CpxOfferwall() {
  const { user } = useUser();

  if (!CPX_APP_ID || !CPX_IFRAME_HASH) {
    return <div className="text-destructive">CPX Research is not configured. Please set NEXT_PUBLIC_CPX_APP_ID and NEXT_PUBLIC_CPX_IFRAME_HASH in your environment variables.</div>;
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const iframeUrl = `https://live.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${user.uid}&username=${user.displayName}&hash=${CPX_IFRAME_HASH}`;

  return (
    <GlassCard className="w-full">
        <iframe
            src={iframeUrl}
            className="w-full h-[80vh] min-h-[600px] border-0 rounded-xl"
            title="CPX Research Offerwall"
        />
    </GlassCard>
  );
}
