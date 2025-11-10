import { NextResponse } from 'next/server';
import { adminDb, adminAuth, verifyIdToken, isAdmin } from '@/lib/firebase/admin';
import { doc, updateDoc, getDocs, collection, query, where, writeBatch } from 'firebase/firestore';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!adminDb || !adminAuth) {
    return NextResponse.json({ success: false, error: 'Firebase Admin not initialized.' }, { status: 500 });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await verifyIdToken(token);

  if (!decodedToken || !isAdmin(decodedToken)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const batch = writeBatch(adminDb);

    // 1. Anonymize user profile
    const userRef = doc(adminDb, 'users', userId);
    batch.update(userRef, {
      email: `anonymized_${userId}@example.com`,
      username: `anonymized_user_${userId}`,
      status: 'anonymized',
    });

    // 2. Anonymize payouts
    const payoutsQuery = query(collection(adminDb, 'payouts'), where('userId', '==', userId));
    const payoutsSnapshot = await getDocs(payoutsQuery);
    payoutsSnapshot.forEach(doc => {
      batch.update(doc.ref, { payoutAddress: '[anonymized]' });
    });
    
    // Commit anonymization batch
    await batch.commit();

    // 3. Delete user from Firebase Auth
    await adminAuth.deleteUser(userId);

    return NextResponse.json({ success: true, message: 'User data anonymized and account deleted.' });
  } catch (error) {
    console.error('Error in user deletion and anonymization process:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
