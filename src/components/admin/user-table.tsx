'use client'

import { useState } from 'react'
import type { UserProfile } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
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
import { useAuth } from '@/hooks/use-auth'

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


export function UserTable({ users }: { users: UserProfile[] }) {
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();
    const { user } = useAuth();


    const handleDelete = async (userId: string) => {
        setLoading(userId);
        try {
            const token = await user?.getIdToken();
            await deleteAndAnonymizeUser(userId, token);
            toast({ title: 'Success', description: 'User has been deleted and their data anonymized.'});
            // Here you would typically re-fetch or update the state to remove the user from the UI
            // For now, we rely on page reload after action. A full state management would be better.
            window.location.reload(); 
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(null);
        }
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.uid} className={u.status === 'anonymized' ? 'opacity-50' : ''}>
            <TableCell>{u.username}</TableCell>
            <TableCell className="text-muted-foreground">{u.email}</TableCell>
            <TableCell>
              <Badge variant={u.role === 'admin' ? 'destructive' : 'secondary'}>{u.role}</Badge>
            </TableCell>
            <TableCell className="font-medium text-primary">{u.currentBalance.toLocaleString()} CASH</TableCell>
            <TableCell>{format(new Date(u.joinDate), 'PPP')}</TableCell>
            <TableCell className="text-right">
                {loading === u.uid ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> :
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button size="icon" variant="destructive" className="h-8 w-8" disabled={u.role === 'admin' || u.status === 'anonymized'}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user's authentication account and anonymize their associated data (profile, payouts, etc.) to comply with GDPR.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(u.uid)} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete and anonymize
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
