
import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const username = searchParams.get('username');
  const email = searchParams.get('email');

  const appId = "29497";
  const secretKey = "VAEvtiPj8ehJAgKR6keIZAE2GdZdOg0k";

  if (!userId || !username || !email) {
    return NextResponse.json({ error: 'Missing required user information' }, { status: 400 });
  }

  if (!appId || !secretKey) {
    const errorMsg = "CPX Configuration Error: App ID or Secret Key is not set on the server.";
    console.error(errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }

  // CPX Research requires the hash to be of the user ID and the secret key.
  const hash = createHash('sha1').update(`${userId}-${secretKey}`).digest('hex');

  const url = new URL('https://offers.cpx-research.com/index.php');
  url.searchParams.append('app_id', appId);
  url.searchParams.append('ext_user_id', userId);
  url.searchParams.append('secure_hash', hash);
  url.searchParams.append('username', username);
  url.searchParams.append('email', email);
  url.searchParams.append('subid_1', ''); 
  url.searchParams.append('subid_2', '');

  return NextResponse.json({ url: url.toString() });
}
