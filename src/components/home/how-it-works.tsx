import Image from 'next/image';
import { GlassCard, CardContent } from '@/components/ui/glass-card';

const steps = [
  {
    image: '/s_step_1.png',
    title: 'Sign Up',
    description: 'Create an account in just a few seconds and join our community.',
  },
  {
    image: '/s_step_2.png',
    title: 'Complete Offers',
    description: 'Choose from hundreds of surveys, apps, and tasks to complete.',
  },
  {
    image: '/s_step_3.png',
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
                <div className="relative h-48 w-full mb-6">
                    <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
              <h3 className="font-headline text-2xl font-semibold text-white">{step.title}</h3>
              <p className="text-muted-foreground mt-2">{step.description}</p>
            </CardContent>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
