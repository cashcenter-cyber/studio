import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, DollarSign } from 'lucide-react';
import { GlassCard, CardHeader } from '@/components/ui/glass-card';

interface HeroProps {
    activeUsers: string;
    rewardsPaid: string;
}

export function Hero({ activeUsers, rewardsPaid }: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 border border-primary/20">
                <Star className="h-4 w-4 mr-2 fill-primary" />
                Over 1200 offers available
            </div>

            <h1 className="font-headline text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Earn <span className="text-primary">Money Online</span> <br/>
                Today!
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-300">
                Complete surveys, test apps, and earn real money. Cash out via PayPal, crypto, or gift cards.
            </p>
            <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
                <Link href="/auth">
                Start Earning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">
                    Learn More
                </Link>
            </Button>
            </div>
        </div>

        <div className="space-y-6">
            <GlassCard className="p-4">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Users className="h-10 w-10 text-primary" />
                    <div>
                        <p className="font-headline text-4xl font-bold">{activeUsers}</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                </CardHeader>
            </GlassCard>
            <GlassCard className="p-4">
                 <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <DollarSign className="h-10 w-10 text-primary" />
                    <div>
                        <p className="font-headline text-4xl font-bold">{rewardsPaid}</p>
                        <p className="text-sm text-muted-foreground">Rewards Paid</p>
                    </div>
                </CardHeader>
            </GlassCard>
        </div>
      </div>
    </section>
  );
}
