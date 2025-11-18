
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import type { Transaction, OfferwallTransaction, UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  const partnerSecret = request.headers.get('x-partner-secret');
  if (partnerSecret !== process.env.OFFERWALL_PARTNER_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!adminDb) {
    return NextResponse.json({ success: false, error: 'Firebase Admin not initialized.' }, { status: 500 });
  }

  try {
    const body: OfferwallTransaction = await request.json();
    const { userId, amount, offerId, offerName } = body;

    if (!userId || !amount || !offerId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(adminDb, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const userProfile = userDoc.data() as UserProfile;

    // --- 1. Credit the user who completed the offer ---
    const transactionsRef = collection(userRef, 'transactions');
    
    await updateDoc(userRef, {
      currentBalance: increment(amount),
      lifetimeEarnings: increment(amount)
    });

    const newTransaction: Omit<Transaction, 'id'> = {
      userId,
      amount,
      type: 'earn',
      description: `Completed offer: ${offerName || offerId}`,
      createdAt: serverTimestamp() as any,
      status: 'completed',
      externalTransactionId: offerId,
    };
    await addDoc(transactionsRef, newTransaction);
    
    // --- 2. Handle Referral Commission (ACTIVE) ---
    if (userProfile.referredBy) {
        const referrerId = userProfile.referredBy;
        const commissionAmount = Math.round(amount * 0.02); // 2% commission

        if (commissionAmount > 0) {
            const referrerRef = doc(adminDb, 'users', referrerId);
            const referrerDoc = await getDoc(referrerRef);

            if (referrerDoc.exists()) {
                // Increment referrer's balances
                await updateDoc(referrerRef, {
                    currentBalance: increment(commissionAmount),
                    referralEarnings: increment(commissionAmount)
                });

                // Create a transaction record for the referrer
                const referrerTransactionsRef = collection(referrerRef, 'transactions');
                const referralTransaction: Omit<Transaction, 'id'> = {
                    userId: referrerId,
                    amount: commissionAmount,
                    type: 'referral',
                    description: `Referral bonus from ${userProfile.username || 'user'}`,
                    createdAt: serverTimestamp() as any,
                    status: 'completed',
                };
                await addDoc(referrerTransactionsRef, referralTransaction);
            }
        }
    }
    
    return NextResponse.json({ success: true, message: 'User credited successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
