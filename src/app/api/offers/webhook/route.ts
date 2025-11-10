import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Transaction, OfferwallTransaction } from '@/lib/types';

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
    const transactionsRef = collection(userRef, 'transactions');
    
    // Update user balance and lifetime earnings
    await updateDoc(userRef, {
      currentBalance: increment(amount),
      lifetimeEarnings: increment(amount)
    });

    // Create a transaction record
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
    
    return NextResponse.json({ success: true, message: 'User credited successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
