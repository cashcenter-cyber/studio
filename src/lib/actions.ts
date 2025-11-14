
'use server'

import { z } from 'zod'
import { adminDb, verifyIdToken } from './firebase/admin'
import { collection, doc, updateDoc, getDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore'
import type { Payout, UserProfile, Offer } from './types'
import { revalidatePath } from 'next/cache'
import { createHash } from 'crypto'

const payoutSchema = z.object({
  amount: z.coerce.number().min(1000),
  method: z.string(),
  payoutAddress: z.string().min(1),
})

export async function requestPayout(values: z.infer<typeof payoutSchema>, token: string) {
    if (!token) {
      return { success: false, error: 'User is not authenticated.' };
    }
  
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
  
  if (!adminDb) {
      return { success: false, error: 'Database service is not available.'}
  }

  const userRef = doc(adminDb, 'users', currentUser.uid)
  const payoutsRef = collection(adminDb, 'payouts');


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

        const newPayoutDocRef = doc(payoutsRef);
        const newPayout: Omit<Payout, 'id'> = {
            userId: currentUser.uid,
            username: userProfile.username,
            amount,
            method,
            payoutAddress,
            status: 'pending',
            requestedAt: serverTimestamp() as any,
        }
        transaction.set(newPayoutDocRef, newPayout);
        return { newBalance };
    })
    
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/rewards')
    return { success: true, newBalance: result.newBalance }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit payout request.' }
  }
}

export async function processPayoutAction(payoutId: string, newStatus: 'approved' | 'declined', token: string | undefined) {
    if (!token) {
      return { success: false, error: 'Authentication token not found.' };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/payouts/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payoutId, newStatus }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to process payout.');
        }

        const data = await response.json();
        if (data.success) {
            revalidatePath('/dashboard/payouts/admin');
            revalidatePath('/dashboard/admin/users');
        }
        return data;

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


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

export async function createOrUpdateOfferAction(formData: FormData) {
    if (!adminDb) {
        return { success: false, error: 'Database service is not available.' };
    }

    const values = Object.fromEntries(formData.entries());
    const validatedFields = offerSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, ...offerData } = validatedFields.data;

    try {
        if (id) {
            // Update existing offer
            const offerRef = doc(adminDb, 'offers', id);
            await updateDoc(offerRef, offerData);
        } else {
            // Create new offer
            const offersRef = collection(adminDb, 'offers');
            await addDoc(offersRef, offerData);
        }
        revalidatePath('/dashboard/admin/offers');
        revalidatePath('/dashboard/offers');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to save offer.' };
    }
}

export async function deleteOfferAction(offerId: string) {
    if (!adminDb) {
        return { success: false, error: 'Database service is not available.' };
    }

    if (!offerId) {
        return { success: false, error: 'Offer ID is required.' };
    }

    try {
        const offerRef = doc(adminDb, 'offers', offerId);
        await deleteDoc(offerRef);

        revalidatePath('/dashboard/admin/offers');
        revalidatePath('/dashboard/offers');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to delete offer.' };
    }
}

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be at most 20 characters.'),
});

export async function updateUsernameAction(formData: FormData, token: string | undefined) {
    if (!token) {
        return { success: false, error: 'User is not authenticated.' };
    }
    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
        return { success: false, error: 'Invalid authentication token.' };
    }
    
    if (!adminDb) {
        return { success: false, error: 'Database service is not available.' };
    }
    
    const values = Object.fromEntries(formData.entries());
    const validatedFields = usernameSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    const { username } = validatedFields.data;
    const userRef = doc(adminDb, 'users', decodedToken.uid);

    try {
        await updateDoc(userRef, { username });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update username.' };
    }
}

export async function getTimewallUrlAction(userId: string) {
    const TIMEWALL_API_KEY = process.env.NEXT_PUBLIC_TIMEWALL_APP_ID;
    const TIMEWALL_SECRET_KEY = "c68c29bfbae761006c9e1975bfcef1b1";

    if (!TIMEWALL_API_KEY) {
        console.error('Timewall Action Error: NEXT_PUBLIC_TIMEWALL_APP_ID is not set.');
        return { success: false, error: 'Timewall integration is not configured correctly on the server (missing API_KEY).' };
    }

    if (!TIMEWALL_SECRET_KEY) {
        console.error('Timewall Action Error: TIMEWALL_SECRET_KEY is not set.');
        return { success: false, error: 'Timewall integration is not configured correctly on the server (missing SECRET_KEY).' };
    }

    try {
        const hashString = userId + TIMEWALL_SECRET_KEY;
        const hash = createHash('sha256').update(hashString).digest('hex');
        const url = `https://timewall.com/users/login?app=${TIMEWALL_API_KEY}&user=${userId}&hash=${hash}`;
        
        return { success: true, url };
    } catch (error: any) {
        console.error('Error generating Timewall URL:', error);
        return { success: false, error: 'Internal Server Error while generating Timewall URL.' };
    }
}
