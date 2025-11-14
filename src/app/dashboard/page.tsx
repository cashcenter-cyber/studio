'use client';

import { useUser } from '@/firebase';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, CheckCircle, Clock, Trash2, Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase';
import { useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { Payout } from '@/lib/types';
import { TransactionList } from '@/components/dashboard/transaction-list';
import { GlassCard, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signOut } from 'firebase/auth';
import { useAuthService } from '@/firebase';
import { UserProfileCard } from '@/components/dashboard/user-profile';

async function deleteAndAnonymizeUser(userId: string, token: string | undefined) {
    if (!token) {
        throw new Error('Authentication token not found.');
    }
    const response = await fetch('/api/admin/deleteUserAndAnonymizeData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user.');
    }

    return await response.json();
}


export default function DashboardPage() {
  const { user, userProfile } = useUser();
  const db = useFirestore();
  const auth = useAuthService();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const payoutsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, 'users', user.uid, 'payouts'), 
      where('status', '==', 'pending')
    );
  }, [db, user?.uid]);

  const { data: pendingPayouts, isLoading: isLoadingPayouts } = useCollection<Payout>(payoutsQuery);

  const pendingAmount = pendingPayouts?.reduce((sum, payout) => sum + payout.amount, 0) ?? 0;

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
        const token = await user.getIdToken(true); // Force refresh the token
        await deleteAndAnonymizeUser(user.uid, token);
        toast({ title: 'Account Deleted', description: 'Your account has been successfully deleted and your data anonymized.' });
        await signOut(auth);
        window.location.href = '/';
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Deletion Error', description: error.message });
        setIsDeleting(false);
    }
  }


  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">
          Welcome back, <span className="text-primary">{userProfile?.username || 'User'}</span>!
        </h1>
        <p className="text-muted-foreground">Here's a summary of your account activity and profile.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Balance"
          value={`${(userProfile?.currentBalance ?? 0).toLocaleString()} CASH`}
          icon={DollarSign}
          description="Ready to be withdrawn"
        />
        <StatCard
          title="Lifetime Earnings"
          value={`${(userProfile?.lifetimeEarnings ?? 0).toLocaleString()} CASH`}
          icon={CheckCircle}
          description="Total earned since joining"
        />
        <StatCard
          title="Pending Payouts"
          value={isLoadingPayouts ? '...' : `${pendingAmount.toLocaleString()} CASH`}
          icon={Clock}
          description="Currently being processed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-4">Recent Activity</h2>
            <div className="glass-card">
                <TransactionList />
            </div>
        </div>

        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline mb-4">My Profile</h2>
                 <UserProfileCard />
            </div>
            <div>
                <h2 className="text-2xl font-bold font-headline mb-4 text-destructive">Danger Zone</h2>
                <GlassCard>
                    <CardHeader>
                        <CardTitle>Delete Account</CardTitle>
                        <CardDescription>Permanently delete your account and anonymize all your data. This action is irreversible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete My Account
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="glass-card">
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your authentication account and anonymize all associated data (profile, transactions, payouts). You will be logged out immediately.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90" disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Yes, delete my account
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </GlassCard>
            </div>
        </div>
      </div>
    </div>
  );
}
