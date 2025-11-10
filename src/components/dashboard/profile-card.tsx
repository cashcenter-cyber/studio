'use client'

import { useAuth } from "@/hooks/use-auth"
import { GlassCard, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/glass-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfileCard() {
    const { user, userProfile } = useAuth();
    const { toast } = useToast();

    const handleCopy = () => {
        if (userProfile?.referralCode) {
            navigator.clipboard.writeText(userProfile.referralCode);
            toast({
                title: 'Copied!',
                description: 'Your referral code has been copied to the clipboard.',
            });
        }
    }

    if (!user || !userProfile) {
        return null;
    }

    return (
        <GlassCard>
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Here are your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={userProfile.username ?? ''} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userProfile.email ?? ''} readOnly />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="referral">Your Referral Code</Label>
                    <div className="flex items-center gap-2">
                        <Input id="referral" value={userProfile.referralCode ?? ''} readOnly className="font-mono" />
                        <Button variant="outline" size="icon" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground">Share this code to earn 2% of your referrals' earnings!</p>
                </div>
            </CardContent>
        </GlassCard>
    )
}
