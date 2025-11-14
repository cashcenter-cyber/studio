
import { NextResponse } from 'next/server';
import { verifyIdToken, adminDb } from '@/lib/firebase/admin';
import { createHash } from 'crypto';

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
  
  // Correctly use the environment variables exposed via next.config.js
  const TIMEWALL_API_KEY = process.env.NEXT_PUBLIC_TIMEWALL_APP_ID;
  const TIMEWALL_SECRET_KEY = process.env.TIMEWALL_SECRET_KEY;
  
  if (!TIMEWALL_API_KEY) {
      console.error('Timewall Error: NEXT_PUBLIC_TIMEWALL_APP_ID is not set in environment variables.');
      return NextResponse.json({ error: 'Timewall integration is missing APP_ID configuration on the server.' }, { status: 500 });
  }

  if (!TIMEWALL_SECRET_KEY) {
      console.error('Timewall Error: TIMEWALL_SECRET_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'Timewall integration is missing SECRET_KEY configuration on the server.' }, { status: 500 });
  }
  
  try {
    const userId = decodedToken.uid;
    // As per Timewall documentation: hash(user_id + api_secret_key)
    const hashString = userId + TIMEWALL_SECRET_KEY;
    const hash = createHash('sha256').update(hashString).digest('hex');

    const url = `https://timewall.com/users/login?app=${TIMEWALL_API_KEY}&user=${userId}&hash=${hash}`;
    
    return NextResponse.json({ url });

  } catch (error) {
    console.error('Error generating Timewall URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
