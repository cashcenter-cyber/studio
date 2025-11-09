import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';
import { GlassCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/glass-card';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard>
          <CardHeader className="text-center">
             <Link href="/" className="mx-auto mb-4 flex items-center space-x-2 w-fit">
                <DollarSign className="h-8 w-8 text-primary animate-glow" />
             </Link>
            <CardTitle className="font-headline text-2xl">Join the Cash-Center</CardTitle>
            <CardDescription>Sign in or create an account to start earning.</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
