'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { initializeFirebase } from '.';
import type { UserProfile } from '@/lib/types';
import { createUserProfile } from '@/lib/firestore';

// --- CONTEXT DEFINITIONS ---

export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isUserLoading: boolean; // for compatibility with header
  error: Error | null;
}

// Create the React Contexts
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);
const UserContext = createContext<UserState | undefined>(undefined);

// --- PROVIDER COMPONENT ---

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  // Memoize Firebase services initialization to prevent re-renders
  const firebaseServices = useMemo(() => initializeFirebase(), []);
  
  const [userState, setUserState] = useState<UserState>({
    user: null,
    userProfile: null,
    isLoading: true,
    isUserLoading: true,
    error: null,
  });

  useEffect(() => {
    const { auth, firestore } = firebaseServices;
    
    let profileUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // First, clear any previous profile listener
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      if (firebaseUser) {
        const profileRef = doc(firestore, 'users', firebaseUser.uid);

        // Set loading state for user and profile
        setUserState(prev => ({ ...prev, user: firebaseUser, isLoading: true, isUserLoading: true }));

        try {
            // Check if profile exists, if not, create it.
            const docSnap = await getDoc(profileRef);
            if (!docSnap.exists()) {
              await createUserProfile(firestore, firebaseUser);
            }

            // Now, attach a real-time listener for the profile.
            profileUnsubscribe = onSnapshot(profileRef, (doc) => {
                setUserState(prev => ({
                ...prev,
                userProfile: doc.exists() ? doc.data() as UserProfile : null,
                isLoading: false,
                isUserLoading: false,
                error: null,
                }));
            }, (profileError) => {
                console.error("Error listening to user profile:", profileError);
                setUserState(prev => ({ ...prev, userProfile: null, isLoading: false, isUserLoading: false, error: profileError }));
            });

        } catch (error: any) {
             console.error("Error creating/fetching user profile:", error);
             setUserState(prev => ({ ...prev, isLoading: false, isUserLoading: false, error }));
        }

      } else {
        // User is signed out
        setUserState({ user: null, userProfile: null, isLoading: false, isUserLoading: false, error: null });
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [firebaseServices]);

  return (
    <FirebaseContext.Provider value={firebaseServices}>
      <UserContext.Provider value={userState}>
        <FirebaseErrorListener />
        {children}
      </UserContext.Provider>
    </FirebaseContext.Provider>
  );
};


// --- HOOKS ---

/**
 * Custom hook to access the core Firebase services from the context.
 * Throws an error if used outside of a FirebaseProvider.
 */
export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

/** Hook to access Firebase Auth instance. */
export const useAuthService = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

/**
 * Custom hook to access the user's auth and profile state.
 * Throws an error if used outside of a UserProvider (which is inside FirebaseProvider).
 */
export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  return context;
};


type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
