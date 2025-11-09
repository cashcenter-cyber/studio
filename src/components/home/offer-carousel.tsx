'use client'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { GlassCard, CardContent } from '@/components/ui/glass-card'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const offers = [
    { id: 1, title: 'Galactic Gems', reward: 5000, type: 'Game', image: PlaceHolderImages[0] },
    { id: 2, title: 'Starlight Survey', reward: 250, type: 'Survey', image: PlaceHolderImages[1] },
    { id: 3, title: 'Nebula Navigator', reward: 1200, type: 'App', image: PlaceHolderImages[2] },
    { id: 4, title: 'Cosmic Clips', reward: 50, type: 'Video', image: PlaceHolderImages[3] },
    { id: 5, title: 'AstroDeals', reward: 750, type: 'Shopping', image: PlaceHolderImages[4] },
    { id: 6, title: 'Supernova Signup', reward: 300, type: 'Signup', image: PlaceHolderImages[5] },
]

export function OfferCarousel() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold font-headline text-center mb-2">Featured Offers</h2>
      <p className="text-center text-muted-foreground mb-8">Explore top offers curated just for you.</p>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {offers.map((offer) => (
            <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <GlassCard className="overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                       <Image
                        src={offer.image.imageUrl}
                        alt={offer.image.description}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={offer.image.imageHint}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <Badge variant="secondary" className="absolute top-3 right-3">{offer.type}</Badge>
                    </div>
                    <div className="p-6">
                        <h3 className="font-headline text-xl font-semibold text-white">{offer.title}</h3>
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Reward</p>
                                <p className="text-lg font-bold text-primary">{offer.reward.toLocaleString()} CASH</p>
                            </div>
                            <Button variant="outline" className="bg-primary/10 border-primary/30 hover:bg-primary/20">Start Offer</Button>
                        </div>
                    </div>
                  </CardContent>
                </GlassCard>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-foreground -left-4" />
        <CarouselNext className="text-foreground -right-4" />
      </Carousel>
    </section>
  )
}
