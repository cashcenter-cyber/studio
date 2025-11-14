
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { useEffect, useState } from 'react';
import { getCpxUrlAction } from '@/lib/actions';

export function CpxOfferwall() {
  const { user, userProfile } = useUser();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && userProfile) {
      const fetchCpxUrl = async () => {
        try {
          const result = await getCpxUrlAction(
            user.uid,
            userProfile.username || 'user',
            user.email || ''
          );
          if (result.success && result.url) {
            setIframeUrl(result.url);
          } else {
            // Set the error state with the message from the server action
            setError(result.error || 'Failed to get CPX URL. The server did not provide a reason.');
          }
        } catch (err: any) {
          console.error('CPX Offerwall Client Error:', err);
          setError(err.message || 'Could not load the offerwall due to a client-side error.');
        }
      };

      fetchCpxUrl();
    }
  }, [user, userProfile]);

  if (error) {
    return (
        <GlassCard className="p-4 text-center">
            <h3 className="text-lg font-semibold text-destructive">Failed to Load Offerwall</h3>
            <p className="text-sm text-muted-foreground mt-2">
                There was a problem loading offers from CPX Research. Please try again later.
            </p>
            <p className="text-xs text-muted-foreground/50 mt-4 font-mono">
                Error: {error}
            </p>
        </GlassCard>
    );
  }

  if (!user || !iframeUrl) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
