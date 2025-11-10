'use client';

import { OfferList } from '@/components/offers/offer-list';
import { CpxOfferwall } from '@/components/offers/cpx-offerwall';
import { TimewallOfferwall } from '@/components/offers/timewall-offerwall';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OffersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Complete Offers & Earn</h1>
        <p className="text-muted-foreground">
          Choose from a variety of tasks from our trusted partners. New offers are added daily!
        </p>
      </div>
      
      <Tabs defaultValue="cpx" className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 max-w-lg">
          <TabsTrigger value="cpx">CPX Research</TabsTrigger>
          <TabsTrigger value="timewall">Timewall</TabsTrigger>
          <TabsTrigger value="manual">Our Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="cpx">
            <CpxOfferwall />
        </TabsContent>
        <TabsContent value="timewall">
            <TimewallOfferwall />
        </TabsContent>
        <TabsContent value="manual">
            <OfferList />
        </TabsContent>
      </Tabs>

    </div>
  );
}
