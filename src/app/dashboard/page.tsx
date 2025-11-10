'use client';

import { useAuth } from '@/hooks/use-auth';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';
import { useCollection } from '@/firebase';
import { useMemo } from 'react';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Payout } from '@/lib/types';
import { TransactionList } from '@/components/dashboard/transaction-list';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const db = useFirestore();

  const payoutsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'payouts'), 
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );
  }, [db, user?.uid]);

  const { data: pendingPayouts } = useCollection<Payout>(payoutsQuery);

  const pendingAmount = useMemo(() => {
    return pendingPayouts?.reduce((sum, payout) => sum + payout.amount, 0) ?? 0;
  }, [pendingPayouts]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">
        Welcome back, <span className="text-primary">{userProfile?.username || 'User'}</span>!
      </h1>
      <p className="text-muted-foreground mb-8">Here's a summary of your account activity.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Balance"
          value={`${(userProfile?.currentBalance ?? 0).toLocaleString()} CASH`}
          icon={DollarSign}
          description="Ready to be withdrawn"
        />
        <StatCard
          title="Lifetime Earnings"
          value={`${(userProfile?.lifetimeEarnings ?? 0).toLocaleString()} CASH`}
          icon={CheckCircle}
          description="Total earned since joining"
        />
        <StatCard
          title="Pending Payouts"
          value={`${pendingAmount.toLocaleString()} CASH`}
          icon={Clock}
          description="Currently being processed"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
        <div className="glass-card">
            <TransactionList />
        </div>
      </div>
    </div>
  );
}
