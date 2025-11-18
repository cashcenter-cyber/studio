
import admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Store instances in a private object to avoid re-initialization
const adminInstances = {
  auth: null as admin.auth.Auth | null,
  db: null as admin.firestore.Firestore | null,
};

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    if (!adminInstances.auth || !adminInstances.db) {
        adminInstances.auth = admin.auth();
        adminInstances.db = admin.firestore();
    }
    return;
  }

  try {
    const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
    if (!serviceAccountKeyBase64) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set.");
    }
    
    const serviceAccountJson = Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://cash-center-fun-default-rtdb.europe-west1.firebasedatabase.app"
    });

    adminInstances.auth = admin.auth();
    adminInstances.db = admin.firestore();

  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Set to null if initialization fails
    adminInstances.auth = null;
    adminInstances.db = null;
  }
}

// Ensure admin is initialized before exporting
initializeFirebaseAdmin();

export const adminAuth = adminInstances.auth;
export const adminDb = adminInstances.db;


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
