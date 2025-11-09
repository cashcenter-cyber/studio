import { DollarSign, Users, CheckCircle, Gift } from 'lucide-react';
import { GlassCard, CardContent, CardHeader, CardTitle } from '@/components/ui/glass-card';

type StatItem = {
    icon: React.ElementType;
    label: string;
    value: string;
    description: string;
};

export function Stats({ stats }: { stats: StatItem[] }) {
    return (
        <section className="py-16">
             <h2 className="text-3xl font-bold font-headline text-center mb-8">Our Impact in Numbers</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <GlassCard key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                            <stat.icon className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold font-headline text-white">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </GlassCard>
                ))}
            </div>
        </section>
    )
}
