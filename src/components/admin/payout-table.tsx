'use client'

import { useState, useTransition } from 'react'
import type { Payout } from '@/lib/types'
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
import { formatDistanceToNow } from 'date-fns'
import { Check, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/firebase'
import { processPayoutAction } from '@/lib/actions'

export function PayoutTable({ payouts: initialPayouts }: { payouts: Payout[] }) {
    const [payouts, setPayouts] = useState(initialPayouts);
    const [loading, setLoading] = useState<string | null>(null);
    const { toast } = useToast();
    const { user } = useUser();
    const [isPending, startTransition] = useTransition();

    const handleProcess = (payoutId: string, status: 'approved' | 'declined') => {
        startTransition(async () => {
            setLoading(payoutId);
            const token = await user?.getIdToken();
            const result = await processPayoutAction(payoutId, status, token);
            
            if (result.success) {
                toast({ title: 'Success', description: `Payout has been ${status}.`});
                setPayouts(currentPayouts => currentPayouts.filter(p => p.id !== payoutId));
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
            setLoading(null);
        });
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.length === 0 && (
            <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">No pending payouts.</TableCell>
            </TableRow>
        )}
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>{payout.username}</TableCell>
            <TableCell className="font-medium text-primary">{payout.amount.toLocaleString()} CASH</TableCell>
            <TableCell>
              <Badge variant="secondary">{payout.method}</Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground truncate max-w-xs">{payout.payoutAddress}</TableCell>
            <TableCell>{payout.requestedAt ? formatDistanceToNow(payout.requestedAt.toDate(), { addSuffix: true }) : 'N/A'}</TableCell>
            <TableCell className="text-right space-x-2">
                {loading === payout.id ? <Loader2 className="h-4 w-4 animate-spin inline-block" /> :
                <>
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-400" onClick={() => handleProcess(payout.id, 'approved')} disabled={isPending}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400" onClick={() => handleProcess(payout.id, 'declined')} disabled={isPending}>
                        <X className="h-4 w-4" />
                    </Button>
                </>
                }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
