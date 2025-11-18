'use client';

import { ReactNode } from 'react';
import { firebaseApp, firestore, auth } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';

// This Client Provider ensures that Firebase is initialized only once on the client
// and wraps the main FirebaseProvider to pass down the initialized services.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
