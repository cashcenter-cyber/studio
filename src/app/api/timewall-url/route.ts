import { NextResponse } from 'next/server';
import { verifyIdToken, adminDb } from '@/lib/firebase/admin';
import { createHash } from 'crypto';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await verifyIdToken(token);

  if (!decodedToken) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }
  
  if (!adminDb) {
      return NextResponse.json({ error: 'Admin DB not initialized' }, { status: 500 });
  }

  const TIMEWALL_API_KEY = process.env.TIMEWALL_API_KEY;
  const TIMEWALL_SECRET_KEY = process.env.TIMEWALL_SECRET_KEY;
  
  if (!TIMEWALL_API_KEY || !TIMEWALL_SECRET_KEY) {
      return NextResponse.json({ error: 'Timewall environment variables not set' }, { status: 500 });
  }
  
  try {
    const userDocRef = doc(adminDb, 'users', decodedToken.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const userEmail = userData.email;
    const userSignupTimestamp = userData.joinDate.seconds;
    
    // As per Timewall documentation: hash(user_id + user_email + user_signup_timestamp + secret_key)
    const hashString = decodedToken.uid + userEmail + userSignupTimestamp + TIMEWALL_SECRET_KEY;
    const hash = createHash('sha256').update(hashString).digest('hex');

    const url = `https://timewall.com/users/login?apikey=${TIMEWALL_API_KEY}&user_id=${decodedToken.uid}&user_email=${userEmail}&user_signup_timestamp=${userSignupTimestamp}&hash=${hash}`;
    
    return NextResponse.json({ url });

  } catch (error) {
    console.error('Error generating Timewall URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
