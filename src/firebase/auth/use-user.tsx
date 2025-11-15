'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { FirebaseContext } from '@/firebase/provider';

// Interface for the user authentication state
export interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * A dedicated internal hook to manage ONLY the authentication state.
 * Profile data is now handled separately by the components that need it.
 */
export const useUserAuthState = (auth: Auth | null): UserAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsUserLoading(false);
    }, (error) => {
      console.error("useUserAuthState: Auth state error:", error);
      setUserError(error);
      setIsUserLoading(false);
    });

    return () => authUnsubscribe();
  }, [auth]);

  return { user, isUserLoading, userError };
};

// This custom type provides userProfile, but it will come from components, not the hook itself.
export interface UserState extends UserAuthState {
    userProfile: UserProfile | null;
}

/**
 * Hook for accessing the authenticated user's state.
 * This hook ONLY provides the Firebase Auth user object.
 * It is up to components to fetch the user's profile document from Firestore.
 * @returns {UserAuthState} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserAuthState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
};
