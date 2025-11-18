
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

try {
  const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!serviceAccountKeyBase64) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set. Firebase Admin SDK will not be initialized on the server.");
  } else {
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://cash-center-fun-default-rtdb.europe-west1.firebasedatabase.app"
      });
    }
    
    adminAuth = admin.auth();
    adminDb = admin.firestore();
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error.message);
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

export const isAdmin = async (decodedToken: DecodedIdToken): Promise<boolean> => {
    return decodedToken?.admin === true;
};
