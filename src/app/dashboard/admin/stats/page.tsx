'use server';

import { adminDb } from '@/lib/firebase/admin';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, Users, CheckCircle, Gift } from 'lucide-react';
import { collection, getDocs, query, where, getCountFromServer, collectionGroup } from 'firebase/firestore';

async function getStats() {
    if (!adminDb) {
        return {
            userCount: 0,
            totalPaidOut: 0,
            offersCompleted: 0, 
            availableOffers: 0,
        }
    }
    const usersCollection = collection(adminDb, 'users');
    const usersSnapshot = await getCountFromServer(usersCollection);
    const userCount = usersSnapshot.data().count;

    const payoutsQuery = query(collection(adminDb, 'payouts'), where('status', '==', 'approved'));
    const payoutsSnapshot = await getDocs(payoutsQuery);
    const totalPaidOut = payoutsSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
    
    const transactionsQuery = query(collectionGroup(adminDb, 'transactions'), where('type', '==', 'earn'));
    const transactionsSnapshot = await getCountFromServer(transactionsQuery);
    const offersCompleted = transactionsSnapshot.data().count;

    const offersQuery = query(collection(adminDb, 'offers'), where('status', '==', 'active'));
    const availableOffersSnapshot = await getCountFromServer(offersQuery);
    const availableOffers = availableOffersSnapshot.data().count;

    return {
        userCount,
        totalPaidOut,
        offersCompleted,
        availableOffers
    };
}


export default async function AdminStatsPage() {
    const stats = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Live Statistics</h1>
            <p className="text-muted-foreground mb-8">
                A real-time overview of your platform's activity and growth.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Paid Out"
                    value={`$${(stats.totalPaidOut / 1000).toFixed(2)}`}
                    icon={DollarSign}
                    description="in cash and prizes"
                />
                <StatCard
                    title="Happy Members"
                    value={stats.userCount.toLocaleString()}
                    icon={Users}
                    description="and growing daily"
                />
                <StatCard
                    title="Offers Completed"
                    value={stats.offersCompleted.toLocaleString()}
                    icon={CheckCircle}
                    description="tasks finished by our users"
                />
                <StatCard
                    title="Available Offers"
                    value={stats.availableOffers.toLocaleString()}
                    icon={Gift}
                    description="from top brands"
                />
            </div>
        </div>
    );
}
