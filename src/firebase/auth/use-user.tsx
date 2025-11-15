'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';
import type { Auth, User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { FirebaseContext } from '@/firebase/provider';

export interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isUserLoading: boolean; // for compatibility with header
  error: Error | null;
}

const UserContext = createContext<UserState | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('UserProvider must be used within a FirebaseProvider.');
  }
  const { auth, firestore } = context;

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth || !firestore) {
      setIsLoading(false);
      return;
    }

    let profileUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        // First, clear any previous profile listener
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = undefined;
        }
        setUser(firebaseUser);
        setUserProfile(null);

        if (firebaseUser) {
          setIsLoading(true);
          const profileRef = doc(firestore, 'users', firebaseUser.uid);
          profileUnsubscribe = onSnapshot(
            profileRef,
            (docSnap) => {
              if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
              } else {
                setUserProfile(null);
                // This could happen if profile creation fails, not necessarily an error state
              }
              setIsLoading(false); // Loading is done once we get a profile snapshot
            },
            (profileError) => {
              console.error('Error fetching user profile:', profileError);
              setError(profileError);
              setIsLoading(false);
            }
          );
        } else {
          // User is logged out, no profile to fetch.
          setIsLoading(false);
        }
      },
      (authError) => {
        console.error('Auth state error:', authError);
        setError(authError);
        setIsLoading(false);
      }
    );

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [auth, firestore]);

  const value = { user, userProfile, isLoading, isUserLoading: isLoading, error };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};
