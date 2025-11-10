import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Offer } from '@/lib/types';
import { adminDb } from '@/lib/firebase/admin';
import { OfferTable } from '@/components/admin/offer-table';
import { OfferForm } from '@/components/admin/offer-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

async function getOffers(): Promise<Offer[]> {
  if (!adminDb) {
    return [];
  }
  const offersCol = collection(adminDb, 'offers');
  const q = query(offersCol, orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
        } as Offer;
  });
}

export default async function AdminOffersPage() {
  const offers = await getOffers();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Offers</h1>
            <p className="text-muted-foreground">Add, edit, or remove offers available to users.</p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Offer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] glass-card">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Add New Offer</DialogTitle>
                </DialogHeader>
                <OfferForm />
            </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card">
        <OfferTable offers={offers} />
      </div>
    </div>
  );
}
