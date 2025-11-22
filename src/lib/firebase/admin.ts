
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

if (!admin.apps.length) {
  try {
    const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
    if (!serviceAccountKeyBase64) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set in environment variables.");
    }
    
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://cash-center-fun-default-rtdb.europe-west1.firebasedatabase.app"
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

const adminAuth = admin.apps.length ? admin.auth() : null;
const adminDb = admin.apps.length ? admin.firestore() : null;

export const verifyIdToken = async (token: string): Promise<DecodedIdToken | null> => {
  if (!adminAuth) {
      console.error("verifyIdToken failed: Firebase Admin not initialized.");
      return null;
  }
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

export { adminAuth, adminDb };
