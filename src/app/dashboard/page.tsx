'use client';

import { useAuth } from '@/hooks/use-auth';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">
        Welcome back, <span className="text-primary">{userProfile?.username || 'User'}</span>!
      </h1>
      <p className="text-muted-foreground mb-8">Here's a summary of your account activity.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Balance"
          value={`${(userProfile?.currentBalance ?? 0).toLocaleString()} CASH`}
          icon={DollarSign}
          description="Ready to be withdrawn"
        />
        <StatCard
          title="Lifetime Earnings"
          value="125,500 CASH"
          icon={CheckCircle}
          description="Total earned since joining"
        />
        <StatCard
          title="Pending Payouts"
          value="0 CASH"
          icon={Clock}
          description="Currently being processed"
        />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
        <div className="glass-card p-6">
            <p className="text-center text-muted-foreground">Your recent transactions will appear here.</p>
        </div>
      </div>
    </div>
  );
}
