'use client';

import type { Offer } from '@/lib/types';
import { GlassCard, CardContent } from '@/components/ui/glass-card';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <GlassCard className="group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
      <div className="relative h-40 w-full">
        <Image
          src={offer.imageUrl}
          alt={offer.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="font-bold text-lg animate-glow">
              {offer.reward.toLocaleString()} CASH
            </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
            <Badge variant="secondary">{offer.partner}</Badge>
            <Badge variant="outline">{offer.category}</Badge>
        </div>
        <h3 className="mt-4 font-headline text-xl font-semibold text-white truncate group-hover:text-primary">
          {offer.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground h-10 overflow-hidden">
          {offer.description}
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href={offer.offerUrl} target="_blank" rel="noopener noreferrer">
            Start Offer
          </Link>
        </Button>
      </CardContent>
    </GlassCard>
  );
}
