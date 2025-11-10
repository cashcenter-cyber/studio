import { OfferList } from '@/components/offers/offer-list';

export default function OffersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Complete Offers & Earn</h1>
        <p className="text-muted-foreground">
          Choose from a variety of tasks from our trusted partners. New offers are added daily!
        </p>
      </div>
      <OfferList />
    </div>
  );
}
