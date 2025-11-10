'use client';

import { useState } from 'react';
import type { Offer } from '@/lib/types';
import { OfferCard } from './offer-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

function OfferSkeleton() {
    return (
        <div className="flex flex-col space-y-3 glass-card overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <div className="space-y-2 p-4">
                 <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-10 w-full mt-4" />
            </div>
        </div>
    )
}

export function OfferList() {
  const db = useFirestore();
  const [activeCategory, setActiveCategory] = useState('All');
  
  const offersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'offers'));
  }, [db]);

  const { data: allOffers, isLoading } = useCollection<Offer>(offersQuery);

  const categories = ['All', 'Game', 'Survey', 'App', 'Quiz'];

  const filteredOffers = allOffers?.filter(offer => {
      if (activeCategory === 'All') return offer.status === 'active';
      return offer.category === activeCategory && offer.status === 'active';
  });

  return (
    <div>
      <Tabs defaultValue="All" className="w-full mb-6" onValueChange={setActiveCategory}>
        <TabsList>
            {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                    {category}
                </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      
      {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <OfferSkeleton key={i} />)}
          </div>
      ) : (
        <>
            {filteredOffers && filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOffers.map(offer => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground glass-card">
                    <p className="text-lg">No offers found in this category.</p>
                    <p className="text-sm">Check back later for new opportunities to earn!</p>
                </div>
            )}
        </>
      )}
    </div>
  );
}
