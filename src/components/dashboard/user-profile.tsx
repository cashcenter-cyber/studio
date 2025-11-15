'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { GlassCard, CardContent } from '@/components/ui/glass-card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Edit, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { updateUsernameAction } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

type UsernameFormValues = z.infer<typeof usernameSchema>;

export function UserProfileCard() {
  const { user, userProfile, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({ username: userProfile.username || '' });
    }
  }, [userProfile, form]);

  const handleCopy = () => {
    if (userProfile?.referralCode) {
      navigator.clipboard.writeText(userProfile.referralCode);
      toast({
        title: 'Copied!',
        description: 'Your referral code has been copied to the clipboard.',
      });
    }
  };
  
  const onSubmit = async (data: UsernameFormValues) => {
    if (!user) return;

    startTransition(async () => {
        const token = await user.getIdToken();
        const result = await updateUsernameAction(data.username, token);
        if (result.success) {
            toast({ title: 'Success', description: 'Your username has been updated.' });
            setIsEditing(false);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

  if (isUserLoading || !userProfile) {
      return (
          <GlassCard>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
              </CardContent>
          </GlassCard>
      )
  }

  return (
    <GlassCard>
      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <Label htmlFor="username">Username</Label>
                                {!isEditing && (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                )}
                            </div>
                            <FormControl>
                                <Input id="username" {...field} readOnly={!isEditing} className={!isEditing ? 'border-transparent bg-transparent' : ''}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isEditing && (
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsEditing(false); form.reset({ username: userProfile?.username || '' }); }}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Save
                        </Button>
                    </div>
                )}
            </form>
        </Form>
        
        {!isEditing && (
            <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email ?? ''} readOnly className="border-transparent bg-transparent"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral">Your Referral Code</Label>
                  <div className="flex items-center gap-2">
                    <Input id="referral" value={userProfile?.referralCode ?? ''} readOnly className="font-mono border-transparent bg-transparent" />
                    <Button variant="outline" size="icon" onClick={handleCopy}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Share this code to earn 2% of your referrals' earnings!</p>
                </div>
            </>
        )}
      </CardContent>
    </GlassCard>
  );
}
