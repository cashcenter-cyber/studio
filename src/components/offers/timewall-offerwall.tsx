'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { useEffect, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getTimewallUrlAction } from '@/lib/actions';

export function TimewallOfferwall() {
  const { user } = useUser();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      startTransition(async () => {
        setLoading(true);
        const result = await getTimewallUrlAction(user.uid);
        
        if (result.success && result.url) {
          setIframeUrl(result.url);
          setError(null);
        } else {
          setError(result.error || 'Failed to get Timewall URL');
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'Could not load Timewall offerwall. Please try again later.',
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, toast]);


  if (loading || isPending || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !iframeUrl) {
    return (
        <div className="flex items-center justify-center h-96 glass-card">
            <p className="text-destructive text-center">{error}<br />Please check your configuration or contact support.</p>
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
