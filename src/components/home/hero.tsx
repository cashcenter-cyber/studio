import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to the{' '}
          <span className="text-primary animate-glow">Neon Space</span> of Rewards
        </h1>
        <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Complete offers, watch videos, and take surveys to earn CASH. Simple tasks, real rewards. Your journey to earnings starts now.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="font-bold">
            <Link href="/auth">
              Start Earning Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
