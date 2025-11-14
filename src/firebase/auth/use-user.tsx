'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { FirebaseContext } from '@/firebase/provider';

// Interface for the user authentication state
export interface UserAuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * A dedicated internal hook to manage the authentication state and user profile fetching.
 */
export const useUserAuthState = (auth: Auth | null, firestore: Firestore | null): UserAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth || !firestore) {
      setIsUserLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        // Not logged in
        setUserProfile(null);
        setIsUserLoading(false);
      }
    }, (error) => {
      console.error("useUserAuthState: Auth state error:", error);
      setUserError(error);
      setIsUserLoading(false);
    });

    return () => authUnsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (!firestore || !user) {
      // If there's no user, no profile to fetch.
      // isUserLoading is controlled by the auth state change.
      return;
    }

    setIsUserLoading(true); // Start loading profile data
    const profileDocRef = doc(firestore, 'users', user.uid);
    
    const profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
      if (doc.exists()) {
        setUserProfile({ uid: doc.id, ...doc.data() } as UserProfile);
      } else {
        // This might happen briefly after signup before profile is created.
        setUserProfile(null); 
      }
      setIsUserLoading(false);
    }, (error) => {
      console.error("useUserAuthState: Profile snapshot error:", error);
      setUserError(error);
      setIsUserLoading(false);
    });

    return () => profileUnsubscribe();

  }, [user, firestore]); // Rerun when the user object or firestore instance changes.

  return { user, userProfile, isUserLoading, userError };
};

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserAuthState} Object with user, userProfile, isUserLoading, userError.
 */
export const useUser = (): UserAuthState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  const { user, userProfile, isUserLoading, userError } = context;
  return { user, userProfile, isUserLoading, userError };
};
