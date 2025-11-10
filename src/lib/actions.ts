'use server'

import { z } from 'zod'
import { adminDb } from './firebase/admin'
import { collection, addDoc, serverTimestamp, doc, updateDoc, writeBatch, getDocs, query, where, getDoc } from 'firebase/firestore'
import type { Payout, UserProfile } from './types'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { verifyIdToken } from '@/lib/firebase/admin'


const payoutSchema = z.object({
  amount: z.coerce.number().min(1000),
  method: z.string(),
  payoutAddress: z.string().min(1),
})

export async function requestPayout(values: z.infer<typeof payoutSchema>) {
    const authHeader = headers().get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'User is not authenticated.' };
    }
  
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);
  
    if (!decodedToken) {
      return { success: false, error: 'Invalid authentication token.' };
    }

  const currentUser = decodedToken;

  const validatedFields = payoutSchema.safeParse(values)
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data provided.' }
  }

  const { amount, method, payoutAddress } = validatedFields.data
  const userRef = doc(adminDb, 'users', currentUser.uid)

  try {
    const result = await adminDb.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef)
        if (!userDoc.exists()) {
            throw new Error("User does not exist.")
        }
        const userProfile = userDoc.data() as UserProfile;
        if(userProfile.currentBalance < amount) {
            throw new Error("Insufficient balance.")
        }

        const newBalance = userProfile.currentBalance - amount;
        transaction.update(userRef, { currentBalance: newBalance });

        const payoutRef = collection(adminDb, 'payouts');
        const newPayout: Omit<Payout, 'id' | 'processedAt'> = {
            userId: currentUser.uid,
            username: userProfile.username,
            amount,
            method,
            payoutAddress,
            status: 'pending',
            requestedAt: serverTimestamp() as any,
        }
        transaction.set(doc(payoutRef), newPayout);
        return { newBalance };
    })
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/rewards')
    return { success: true, newBalance: result.newBalance }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit payout request.' }
  }
}

export async function processPayoutAction(payoutId: string, newStatus: 'approved' | 'declined') {
    try {
        const payoutRef = doc(adminDb, 'payouts', payoutId);
        const payoutDoc = await getDoc(payoutRef);
        if (!payoutDoc.exists()) {
            throw new Error('Payout not found.');
        }

        if (newStatus === 'declined') {
            const payoutData = payoutDoc.data() as Payout;
            const userRef = doc(adminDb, 'users', payoutData.userId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data() as UserProfile;
                await updateDoc(userRef, {
                    currentBalance: userData.currentBalance + payoutData.amount
                });
            }
        }
        
        await updateDoc(payoutRef, {
            status: newStatus,
            processedAt: serverTimestamp(),
        });
        
        revalidatePath('/dashboard/payouts/admin');
        revalidatePath('/dashboard/admin/users')
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
