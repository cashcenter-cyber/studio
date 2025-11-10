import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Payout } from '@/lib/types';
import { PayoutTable } from '@/components/admin/payout-table';
import { Badge } from '@/components/ui/badge';
import { adminDb } from '@/lib/firebase/admin';

async function getPendingPayouts(): Promise<Payout[]> {
  if (!adminDb) {
    return [];
  }
  const payoutsCol = collection(adminDb, 'payouts');
  const q = query(payoutsCol, where('status', '==', 'pending'), orderBy('requestedAt', 'asc'), limit(50));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          requestedAt: data.requestedAt,
        } as Payout;
  });
}

export default async function AdminPayoutsPage() {
  const pendingPayouts = await getPendingPayouts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Payouts</h1>
            <p className="text-muted-foreground">Review and process pending withdrawal requests.</p>
        </div>
        <Badge variant="destructive" className="text-lg">
            {pendingPayouts.length} Pending
        </Badge>
      </div>

      <div className="glass-card">
        <PayoutTable payouts={pendingPayouts} />
      </div>
    </div>
  );
}
