
'use server';

import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

let adminAuth: admin.auth.Auth | null = null;
let adminDb: admin.firestore.Firestore | null = null;

try {
  const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!serviceAccountKeyBase64) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set. Firebase Admin SDK will not be initialized on the server.");
  } else {
    // Decode the Base64 string into a raw JSON string
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8');

    // Robustly clean the JSON string to remove any potential control characters or invalid whitespace
    const cleanedJson = serviceAccountJson.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(cleanedJson)),
        databaseURL: "https://cash-center-fun-default-rtdb.europe-west1.firebasedatabase.app"
      });
      adminAuth = admin.auth();
      adminDb = admin.firestore();
    } else {
      // Re-use existing app instance
      adminAuth = admin.auth();
      adminDb = admin.firestore();
    }
  }
} catch (error: any) {
  console.error('Firebase admin initialization error:', error.message);
  // Keep adminDb and adminAuth as null if initialization fails
}

export { adminAuth, adminDb };

export const verifyIdToken = async (token: string): Promise<DecodedIdToken | null> => {
  if (!adminAuth) return null;
  try {
    // The verifyIdToken method automatically handles token expiration.
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
