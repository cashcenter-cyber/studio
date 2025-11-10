'use server';

import { collectionGroup, query, where, getDocs, Timestamp, orderBy, limit, collection } from 'firebase/firestore';
import { adminDb } from '@/lib/firebase/admin';
import type { UserProfile } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardTable } from '@/components/leaderboards/leaderboard-table';

export interface LeaderboardUser {
    rank: number;
    username: string | null;
    earnings: number;
    uid: string;
}

async function getMonthlyLeaders(): Promise<LeaderboardUser[]> {
    if (!adminDb) return [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthTimestamp = Timestamp.fromDate(startOfMonth);

    const transactionsQuery = query(
        collectionGroup(adminDb, 'transactions'),
        where('type', '==', 'earn'),
        where('createdAt', '>=', startOfMonthTimestamp)
    );

    const transactionsSnapshot = await getDocs(transactionsQuery);

    const userEarnings: { [key: string]: { earnings: number, username: string | null } } = {};

    for (const doc of transactionsSnapshot.docs) {
        const transaction = doc.data();
        const userId = transaction.userId;
        if (!userEarnings[userId]) {
            const userDoc = await getDocs(query(collection(adminDb, 'users'), where('uid', '==', userId)));
            const username = userDoc.docs.length > 0 ? (userDoc.docs[0].data() as UserProfile).username : 'Anonymous';
            userEarnings[userId] = { earnings: 0, username: username };
        }
        userEarnings[userId].earnings += transaction.amount;
    }

    const sortedUsers = Object.entries(userEarnings)
        .sort(([, a], [, b]) => b.earnings - a.earnings)
        .slice(0, 100);

    return sortedUsers.map(([uid, data], index) => ({
        rank: index + 1,
        username: data.username,
        earnings: data.earnings,
        uid: uid,
    }));
}


async function getAllTimeLeaders(): Promise<LeaderboardUser[]> {
    if (!adminDb) return [];

    const usersQuery = query(
        collection(adminDb, 'users'),
        orderBy('lifetimeEarnings', 'desc'),
        limit(100)
    );

    const usersSnapshot = await getDocs(usersQuery);
    
    return usersSnapshot.docs.map((doc, index) => {
        const user = doc.data() as UserProfile;
        return {
            rank: index + 1,
            username: user.username,
            earnings: user.lifetimeEarnings,
            uid: user.uid,
        };
    });
}


export default async function LeaderboardsPage() {
    const [monthlyLeaders, allTimeLeaders] = await Promise.all([
        getMonthlyLeaders(),
        getAllTimeLeaders()
    ]);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Leaderboards</h1>
        <p className="text-muted-foreground">
          See who is topping the charts and earning the most CASH.
        </p>
      </div>

       <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="mb-6">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
            <div className="glass-card">
                <LeaderboardTable users={monthlyLeaders} />
            </div>
        </TabsContent>
        <TabsContent value="all-time">
            <div className="glass-card">
                <LeaderboardTable users={allTimeLeaders} />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
