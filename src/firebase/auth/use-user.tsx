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
      if (!firebaseUser) {
        setIsUserLoading(false);
        setUserProfile(null); // Clear profile on logout
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
        // If there is no user, or firestore is not ready, we are not loading a profile.
        // The overall loading state is handled by the auth state listener.
        return;
    }
    
    // Start loading profile data specifically for the logged-in user
    setIsUserLoading(true);

    const profileDocRef = doc(firestore, 'users', user.uid);
    
    const profileUnsubscribe = onSnapshot(profileDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const profile = { 
            uid: doc.id,
            ...data,
            joinDate: data.joinDate?.toDate ? data.joinDate.toDate() : new Date(),
        } as UserProfile;
        setUserProfile(profile);
      } else {
        setUserProfile(null); 
      }
      setIsUserLoading(false); // Profile loaded (or confirmed not to exist)
    }, (error) => {
      console.error("useUserAuthState: Profile snapshot error:", error);
      setUserError(error);
      setUserProfile(null);
      setIsUserLoading(false); // Stop loading on error too
    });

    return () => profileUnsubscribe();

  }, [user, firestore]);

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
