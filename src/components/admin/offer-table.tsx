'use client'

import { useState, useTransition } from 'react'
import type { Offer } from '@/lib/types'
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
import { Trash2, Edit, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import Image from 'next/image'
import { deleteOfferAction } from '@/lib/actions'
import { OfferForm } from './offer-form'

export function OfferTable({ offers }: { offers: Offer[] }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = (offerId: string) => {
        startDeleteTransition(async () => {
            const result = await deleteOfferAction(offerId);
            if (result.success) {
                toast({ title: 'Success', description: 'Offer has been deleted.'});
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
        });
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Reward</TableHead>
          <TableHead>Partner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => (
          <TableRow key={offer.id}>
            <TableCell>
                <Image src={offer.imageUrl} alt={offer.name} width={64} height={40} className="rounded-md object-cover" />
            </TableCell>
            <TableCell className="font-medium">{offer.name}</TableCell>
            <TableCell className="text-primary font-semibold">{offer.reward.toLocaleString()} CASH</TableCell>
            <TableCell><Badge variant="secondary">{offer.partner}</Badge></TableCell>
            <TableCell>
              <Badge variant={offer.status === 'active' ? 'default' : 'destructive'}>{offer.status}</Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="outline" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                        <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Edit Offer</DialogTitle>
                        </DialogHeader>
                        <OfferForm offer={offer} onSuccess={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="h-8 w-8" disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this offer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(offer.id)} className="bg-destructive hover:bg-destructive/90">
                        Yes, delete offer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
