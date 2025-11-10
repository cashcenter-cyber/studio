
import { ProfileCard } from '@/components/dashboard/profile-card';
import { GlassCard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/glass-card';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">
        View your account details and referral code.
      </p>

      <div className="max-w-2xl mx-auto">
        <ProfileCard />
      </div>
    </div>
  );
}
