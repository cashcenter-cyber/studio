import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { PayoutLogos } from '@/components/home/payout-logos';
import { Stats } from '@/components/home/stats';
import { Container } from '@/components/ui/container';
import { DollarSign, Users, CheckCircle, Gift } from 'lucide-react';
import { adminDb } from '@/lib/firebase/admin';
import { collection, getDocs, query, where, getCountFromServer, collectionGroup } from 'firebase/firestore';


async function getHomepageStats() {
    if (!adminDb) {
        return {
            totalPaidOut: 0,
            userCount: 0,
            offersCompleted: 0,
        }
    }
    
    const usersSnapshot = await getCountFromServer(collection(adminDb, 'users'));
    const userCount = usersSnapshot.data().count;

    const payoutsQuery = query(collection(adminDb, 'payouts'), where('status', '==', 'approved'));
    const payoutsSnapshot = await getDocs(payoutsQuery);
    const totalPaidOut = payoutsSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    const transactionsQuery = query(collectionGroup(adminDb, 'transactions'), where('type', '==', 'earn'));
    const transactionsSnapshot = await getCountFromServer(transactionsQuery);
    const offersCompleted = transactionsSnapshot.data().count;

    return {
        totalPaidOut,
        userCount,
        offersCompleted,
    }
}


export default async function Home() {
  const statsData = await getHomepageStats();

  const stats = [
    {
        icon: DollarSign,
        label: 'Total Paid Out',
        value: `$${(statsData.totalPaidOut / 1000).toFixed(2)}`,
        description: 'in cash and prizes'
    },
    {
        icon: Users,
        label: 'Happy Members',
        value: statsData.userCount.toLocaleString(),
        description: 'and growing daily'
    },
    {
        icon: CheckCircle,
        label: 'Offers Completed',
        value: statsData.offersCompleted.toLocaleString(),
        description: 'tasks finished by our users'
    },
    {
        icon: Gift,
        label: 'Available Offers',
        value: '1,500+',
        description: 'from top brands'
    }
]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero activeUsers={statsData.userCount.toLocaleString()} rewardsPaid={`$${(statsData.totalPaidOut / 1000).toFixed(2)}`} />
        <Container>
          <HowItWorks />
          <Stats stats={stats} />
          <PayoutLogos />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
