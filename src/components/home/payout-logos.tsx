'use client'

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const payoutMethods = [
  'PayPal', 'Bitcoin', 'Ethereum', 'Amazon', 'Steam', 'Google Play', 'Roblox'
];

export function PayoutLogos() {
   const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold font-headline text-center mb-2">Flexible Payout Options</h2>
      <p className="text-center text-muted-foreground mb-12">Get your rewards your way. We support a variety of payout methods.</p>
      
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-4xl mx-auto"
        opts={{
            align: "start",
            loop: true,
        }}
      >
        <CarouselContent>
          {payoutMethods.map((method) => (
            <CarouselItem key={method} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="p-1">
                    <div className="flex items-center justify-center h-16 w-full glass-card p-4 transition-all duration-300 hover:border-primary hover:scale-105">
                        <span className="text-lg font-semibold text-gray-300">{method}</span>
                    </div>
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
