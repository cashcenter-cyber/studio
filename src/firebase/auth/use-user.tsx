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

    // This handles the primary authentication state.
    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // Once auth state is determined, the primary loading is done.
      setIsUserLoading(false); 
    }, (error) => {
      console.error("useUserAuthState: Auth state error:", error);
      setUserError(error);
      setIsUserLoading(false);
    });

    return () => authUnsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (!firestore || !user) {
        // If there is no user, or firestore is not ready, clear profile.
        setUserProfile(null);
        return;
    }

    // Fetch user profile data. This does not set isUserLoading.
    const profileDocRef = doc(firestore, 'users', user.uid);
    
    const profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
      if (doc.exists()) {
        setUserProfile({ uid: doc.id, ...doc.data() } as UserProfile);
      } else {
        setUserProfile(null); 
      }
    }, (error) => {
      console.error("useUserAuthState: Profile snapshot error:", error);
      // We can set a userError here, but we won't block the UI with a loader.
      setUserError(error);
      setUserProfile(null);
    });

    return () => profileUnsubscribe();

  }, [user, firestore]); // Rerun only when the user object or firestore instance changes.

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
