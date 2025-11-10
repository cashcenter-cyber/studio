'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { requestPayout } from '@/lib/actions'


const payoutSchema = z.object({
  amount: z.coerce.number().min(1000, { message: 'Minimum payout is 1,000 CASH.' }),
  method: z.string({ required_error: 'Please select a payout method.' }),
  payoutAddress: z.string().min(1, { message: 'Payout address is required.' }),
})

export function RewardForm() {
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
    defaultValues: {
      amount: 1000,
      payoutAddress: '',
    },
  })

  async function onSubmit(values: z.infer<typeof payoutSchema>) {
    if (!userProfile || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' })
        return
    }
    if(values.amount > userProfile.currentBalance) {
        form.setError('amount', { message: 'Insufficient balance.'})
        return
    }

    setLoading(true)
    
    try {
        const result = await requestPayout(values);

        if (result.success) {
            toast({ title: 'Success!', description: 'Your payout request has been submitted.'})
            form.reset()
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error })
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' })
    }


    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-4 rounded-md border border-primary/20 bg-primary/10 text-center">
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-2xl font-bold font-headline text-primary">{userProfile?.currentBalance.toLocaleString() ?? 0} CASH</p>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (CASH)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="glass-card">
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                  <SelectItem value="amazon-gc">Amazon Gift Card</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payoutAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Address</FormLabel>
              <FormControl>
                <Input placeholder="Your PayPal email or Bitcoin address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Request Payout
        </Button>
      </form>
    </Form>
  )
}
