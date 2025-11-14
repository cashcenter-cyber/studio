'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function TimewallOfferwall() {
  const { user } = useUser();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchTimewallUrl = async () => {
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/timewall-url', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to get Timewall URL');
          }

          const data = await response.json();
          setIframeUrl(data.url);
        } catch (error) {
          console.error(error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load Timewall offerwall. Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchTimewallUrl();
    } else {
        setLoading(false);
    }
  }, [user, toast]);


  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!iframeUrl) {
    return (
        <div className="flex items-center justify-center h-96 glass-card">
            <p className="text-destructive text-center">Could not load Timewall offerwall.<br />Please check your configuration or contact support.</p>
        </div>
    )
  }

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
