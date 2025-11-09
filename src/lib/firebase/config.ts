import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API key is not set. Please check your .env.local file.");
    // In a real app, you might want to render a different component or show a message to the user.
    // For now, we'll avoid initializing Firebase.
  } else {
    app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}


const auth = app ? getAuth(app) : ({} as any); // Use a mock if app is not initialized
const db = app ? getFirestore(app) : ({} as any);

export { app, auth, db };
