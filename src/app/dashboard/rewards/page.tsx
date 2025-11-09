import { RewardForm } from '@/components/rewards/reward-form';
import { GlassCard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/glass-card';

export default function RewardsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Request a Payout</h1>
      <p className="text-muted-foreground mb-8">
        Withdraw your CASH earnings. Payouts are typically processed within 3-5 business days.
      </p>

      <div className="max-w-2xl mx-auto">
        <GlassCard>
            <CardHeader>
                <CardTitle>Withdraw CASH</CardTitle>
                <CardDescription>Select your payout method and enter the amount you wish to withdraw.</CardDescription>
            </CardHeader>
            <CardContent>
                <RewardForm />
            </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
