import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';

export async function POST(request: Request) {
  const partnerSecret = request.headers.get('x-partner-secret');
  if (partnerSecret !== process.env.OFFERWALL_PARTNER_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, amount, offerId, offerName } = body;

    if (!userId || !amount || !offerId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(adminDb, 'users', userId);
    const transactionsRef = collection(adminDb, 'transactions');
    
    // Update user balance
    await updateDoc(userRef, {
      currentBalance: increment(amount)
    });

    // Create a transaction record
    const newTransaction: Omit<Transaction, 'id'> = {
      userId,
      amount,
      type: 'earn',
      description: `Completed offer: ${offerName || offerId}`,
      createdAt: serverTimestamp() as any,
    };
    await addDoc(transactionsRef, newTransaction);
    
    return NextResponse.json({ success: true, message: 'User credited successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
