import Image from 'next/image';
import { GlassCard, CardContent } from '@/components/ui/glass-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const steps = [
  {
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-1'),
    title: 'Sign Up',
    description: 'Create an account in just a few seconds and join our community.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-2'),
    title: 'Complete Offers',
    description: 'Choose from hundreds of surveys, apps, and tasks to complete.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'how-it-works-3'),
    title: 'Get Paid',
    description: 'Withdraw your earnings via PayPal, crypto, gift cards, and more.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold font-headline text-center mb-2">How It Works</h2>
      <p className="text-center text-muted-foreground mb-12">Start Earning in Three Simple Steps</p>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <GlassCard key={index} className="overflow-hidden group text-center">
            <CardContent className="p-6">
                {step.image && (
                    <div className="relative h-48 w-full mb-6">
                        <Image
                        src={step.image.imageUrl}
                        alt={step.title}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={step.image.imageHint}
                        />
                    </div>
                )}
              <h3 className="font-headline text-2xl font-semibold text-white">{step.title}</h3>
              <p className="text-muted-foreground mt-2">{step.description}</p>
            </CardContent>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
