
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
          if (result.success) {
            setIframeUrl(result.url);
          } else {
            throw new Error('Failed to get CPX URL from server action.');
          }
        } catch (err) {
          console.error('CPX Offerwall Error:', err);
          setError('Could not load the offerwall. Please try again later.');
        }
      };

      fetchCpxUrl();
    }
  }, [user, userProfile]);

  if (error) {
    return <div className="text-destructive p-4 glass-card">{error}</div>;
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
