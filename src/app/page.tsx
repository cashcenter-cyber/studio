import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { PayoutLogos } from '@/components/home/payout-logos';
import { Stats } from '@/components/home/stats';
import { Container } from '@/components/ui/container';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Container>
          <HowItWorks />
          <Stats />
          <PayoutLogos />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
