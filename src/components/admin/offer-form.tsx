'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createOrUpdateOfferAction } from '@/lib/actions'
import type { Offer } from '@/lib/types'
import { DialogClose } from '../ui/dialog'


const offerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name is too short'),
  description: z.string().min(10, 'Description is too short'),
  reward: z.coerce.number().positive('Reward must be positive'),
  category: z.enum(['Game', 'Survey', 'App', 'Quiz']),
  partner: z.string().min(2, 'Partner name is too short'),
  imageUrl: z.string().url('Must be a valid URL'),
  offerUrl: z.string().url('Must be a valid URL'),
  status: z.enum(['active', 'inactive']),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
    offer?: Offer;
    onSuccess?: () => void;
}

export function OfferForm({ offer, onSuccess }: OfferFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      id: offer?.id,
      name: offer?.name || '',
      description: offer?.description || '',
      reward: offer?.reward || 0,
      category: offer?.category || 'Game',
      partner: offer?.partner || '',
      imageUrl: offer?.imageUrl || '',
      offerUrl: offer?.offerUrl || '',
      status: offer?.status || 'active',
    },
  });

  function onSubmit(data: OfferFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    startTransition(async () => {
        const result = await createOrUpdateOfferAction(formData);
        if (result.success) {
            toast({ title: 'Success', description: 'Offer saved successfully.' });
            if(onSuccess) onSuccess();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {offer?.id && <input type="hidden" {...form.register('id')} />}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer Name</FormLabel>
              <FormControl><Input placeholder="e.g. RAID: Shadow Legends" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the offer requirements" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="reward"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Reward (CASH)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g. 5000" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="partner"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Partner</FormLabel>
                <FormControl><Input placeholder="e.g. Timewall" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="glass-card">
                    <SelectItem value="Game">Game</SelectItem>
                    <SelectItem value="App">App</SelectItem>
                    <SelectItem value="Survey">Survey</SelectItem>
                    <SelectItem value="Quiz">Quiz</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="glass-card">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="offerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer URL</FormLabel>
              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {offer ? 'Update Offer' : 'Create Offer'}
            </Button>
        </div>
      </form>
    </Form>
  )
}
