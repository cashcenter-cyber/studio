import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { PayoutLogos } from '@/components/home/payout-logos';
import { Stats } from '@/components/home/stats';
import { Container } from '@/components/ui/container';
import { DollarSign, Users, CheckCircle, Gift } from 'lucide-react';

const stats = [
    {
        icon: DollarSign,
        label: 'Total Paid Out',
        value: '$0',
        description: 'in cash and prizes'
    },
    {
        icon: Users,
        label: 'Happy Members',
        value: '0',
        description: 'and growing daily'
    },
    {
        icon: CheckCircle,
        label: 'Offers Completed',
        value: '0',
        description: 'tasks finished by our users'
    },
    {
        icon: Gift,
        label: 'Available Offers',
        value: '1,500+',
        description: 'from top brands'
    }
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero activeUsers="0" rewardsPaid="$0" />
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
