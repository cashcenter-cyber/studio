import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { OfferCarousel } from '@/components/home/offer-carousel';
import { Stats } from '@/components/home/stats';
import { PayoutLogos } from '@/components/home/payout-logos';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4">
          <OfferCarousel />
          <Stats />
          <Separator className="my-12 bg-primary/20" />
          <PayoutLogos />
        </div>
      </main>
      <Footer />
    </div>
  );
}
