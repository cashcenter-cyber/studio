import { NextResponse } from 'next/server';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { adminDb, verifyIdToken, isAdmin } from '@/lib/firebase/admin';
import type { Payout, UserProfile } from '@/lib/types';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await verifyIdToken(token);

  if (!isAdmin(decodedToken)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { payoutId, newStatus } = await request.json();

    if (!payoutId || !['approved', 'declined'].includes(newStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }
    
    const payoutRef = doc(adminDb, 'payouts', payoutId);
    
    if (newStatus === 'declined') {
        const payoutDoc = await getDoc(payoutRef);
        if (payoutDoc.exists()) {
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
    }
    
    await updateDoc(payoutRef, {
      status: newStatus,
      processedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: `Payout ${newStatus}` });
  } catch (error) {
    console.error('Error processing payout:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
