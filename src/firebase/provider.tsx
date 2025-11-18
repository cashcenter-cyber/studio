'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo, type DependencyList } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { FirestorePermissionError, errorEmitter } from '.';
import type { UserProfile } from '@/lib/types';
import { ensureUserProfileExistsAction } from '@/lib/actions';

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
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children, firebaseApp, firestore, auth }) => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    userProfile: null,
    isLoading: true,
    isUserLoading: true,
    error: null,
  });

  useEffect(() => {
    let profileUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // First, clear any previous profile listener
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      if (firebaseUser) {
        // Set loading state immediately upon finding a firebase user
        setUserState(prev => ({ ...prev, user: firebaseUser, isLoading: true, isUserLoading: true }));

        try {
            // Get signup data from session storage
            const signupUsername = sessionStorage.getItem('signupUsername');
            const signupReferralCode = sessionStorage.getItem('signupReferralCode');
            
            // Get token and call server action to ensure profile exists
            const token = await firebaseUser.getIdToken();
            const result = await ensureUserProfileExistsAction(token, {
                username: signupUsername,
                referralCode: signupReferralCode,
            });

            // Clean up session storage regardless of result
            sessionStorage.removeItem('signupUsername');
            sessionStorage.removeItem('signupReferralCode');

            if (!result.success) {
                throw new Error(result.error || "Failed to ensure user profile on server.");
            }

            // Now that we're sure a profile exists (or was just created), listen for it.
            const profileRef = doc(firestore, 'users', firebaseUser.uid);
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
                const contextualError = new FirestorePermissionError({
                  path: profileRef.path,
                  operation: 'get',
                });
                errorEmitter.emit('permission-error', contextualError);
                setUserState(prev => ({ ...prev, userProfile: null, isLoading: false, isUserLoading: false, error: contextualError }));
            });

        } catch (error: any) {
             console.error("Error ensuring user profile:", error);
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
  }, [auth, firestore]);

  const firebaseServices = useMemo(() => ({ firebaseApp, firestore, auth }), [firebaseApp, firestore, auth]);

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

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuthService = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

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
