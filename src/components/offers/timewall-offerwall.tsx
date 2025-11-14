
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';

// La clé API publique de Timewall est maintenant codée en dur. C'est sécurisé car c'est une clé publique.
const TIMEWALL_APP_ID = 'e97ac5e4eb1ca52d';

export function TimewallOfferwall() {
  const { user } = useUser();

  if (!TIMEWALL_APP_ID) {
    return <div className="text-destructive">Timewall is not configured. The App ID is missing.</div>;
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Construction de l'URL finale en utilisant 'app' et 'user' comme noms de paramètres, comme requis par Timewall.
  const iframeUrl = `https://timewall.io/users/login?app=${TIMEWALL_APP_ID}&user=${user.uid}`;

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
