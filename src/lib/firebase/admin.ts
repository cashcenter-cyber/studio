import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64, 'base64').toString('utf-8')
    : '';

  if (!serviceAccountKey) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set. Firebase Admin SDK will not be initialized on the server.");
  } else if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
    adminAuth = admin.auth();
    adminDb = admin.firestore();
  } else {
    // Re-use existing app instance
    adminAuth = admin.auth();
    adminDb = admin.firestore();
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error.message);
  // Keep adminDb and adminAuth as null if initialization fails
}

export { adminAuth, adminDb };

export const verifyIdToken = async (token: string): Promise<DecodedIdToken | null> => {
  if (!adminAuth) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};

export const isAdmin = (decodedToken: DecodedIdToken): boolean => {
    return decodedToken?.admin === true;
}
