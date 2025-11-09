import type { LucideIcon } from 'lucide-react';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/glass-card';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description: string;
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
    return (
        <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold font-headline text-white">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </GlassCard>
    )
}
