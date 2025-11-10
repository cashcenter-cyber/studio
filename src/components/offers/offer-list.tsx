'use client';

import { useState } from 'react';
import type { Offer } from '@/lib/types';
import { OfferCard } from './offer-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';

// In a real app, this data would come from an API or Firestore
const sampleOffers: Offer[] = [
  {
    id: '1',
    name: 'RAID: Shadow Legends',
    description: 'Install the game and reach level 40 within 30 days to get your reward.',
    reward: 52500,
    category: 'Game',
    partner: 'Timewall',
    imageUrl: 'https://picsum.photos/seed/raid/600/400',
    status: 'active',
    offerUrl: '#',
  },
  {
    id: '2',
    name: 'Opinion Survey',
    description: 'Share your opinion on consumer products and earn cash for your time.',
    reward: 800,
    category: 'Survey',
    partner: 'Cps Survey',
    imageUrl: 'https://picsum.photos/seed/survey1/600/400',
    status: 'active',
    offerUrl: '#',
  },
  {
    id: '3',
    name: 'Star Trek: Fleet Command',
    description: 'Reach Ops Level 21 in this epic space strategy game.',
    reward: 85000,
    category: 'Game',
    partner: 'Timewall',
    imageUrl: 'https://picsum.photos/seed/startrek/600/400',
    status: 'active',
    offerUrl: '#',
  },
  {
    id: '4',
    name: 'TikTok Music',
    description: 'Install and subscribe to TikTok Music for a free trial.',
    reward: 500,
    category: 'App',
    partner: 'Timewall',
    imageUrl: 'https://picsum.photos/seed/tiktok/600/400',
    status: 'active',
    offerUrl: '#',
  },
  {
    id: '5',
    name: 'General Knowledge Quiz',
    description: 'Score 80% or higher on this quiz about world capitals.',
    reward: 150,
    category: 'Quiz',
    partner: 'Cps Survey',
    imageUrl: 'https://picsum.photos/seed/quiz/600/400',
    status: 'active',
    offerUrl: '#',
  },
  {
    id: '6',
    name: 'Family Island™',
    description: 'Reach level 22 on Family Island. New users only.',
    reward: 12000,
    category: 'Game',
    partner: 'Timewall',
    imageUrl: 'https://picsum.photos/seed/family/600/400',
    status: 'active',
    offerUrl: '#',
  }
];

function OfferSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                 <Skeleton className="h-10 w-full mt-4" />
            </div>
        </div>
    )
}

export function OfferList() {
  const [loading, setLoading] = useState(false); // In a real app, this would control loading state
  const [offers, setOffers] = useState<Offer[]>(sampleOffers);
  
  const categories = ['All', 'Game', 'Survey', 'App', 'Quiz'];

  const filterOffers = (category: string) => {
    if (category === 'All') {
      setOffers(sampleOffers);
    } else {
      setOffers(sampleOffers.filter(o => o.category === category));
    }
  };

  return (
    <div>
      <Tabs defaultValue="All" className="w-full mb-6">
        <TabsList>
            {categories.map(category => (
                <TabsTrigger key={category} value={category} onClick={() => filterOffers(category)}>
                    {category}
                </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      
      {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <OfferSkeleton key={i} />)}
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
            ))}
        </div>
      )}

      {offers.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No offers found in this category.</p>
        </div>
      )}
    </div>
  );
}
