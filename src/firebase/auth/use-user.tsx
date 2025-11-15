'use client';

import React, { useState, useEffect, useContext, createContext } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, DocumentData, Firestore } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { FirebaseContext } from '@/firebase/provider';

// This is the shape of our combined User state, including both auth and profile data
export interface UserState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean; // A single loading state
  error: Error | null;
}

// Create a context to hold this state.
const UserContext = createContext<UserState | undefined>(undefined);

// A new provider component specifically for user data.
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

        // --- Step 1: Listen for Auth State Changes ---
        const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser); // Update the user object

            if (!firebaseUser) {
                // If the user logs out, clear everything and stop loading.
                setUserProfile(null);
                setIsLoading(false);
            }
        }, (authError) => {
            console.error("Auth state error:", authError);
            setError(authError);
            setIsLoading(false);
        });

        // --- Step 2: Listen for Profile Document Changes (if user is logged in) ---
        let profileUnsubscribe: () => void = () => {};
        if (user) {
            const profileRef = doc(firestore, 'users', user.uid);
            profileUnsubscribe = onSnapshot(profileRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data() as UserProfile);
                } else {
                    setUserProfile(null); // Profile doesn't exist
                }
                setIsLoading(false); // Loading is complete after profile is fetched
            }, (profileError) => {
                console.error("Profile snapshot error:", profileError);
                setError(profileError);
                setIsLoading(false);
            });
        } else {
             // If there's no user, we are not loading.
             setIsLoading(false);
        }

        // Cleanup function
        return () => {
            authUnsubscribe();
            profileUnsubscribe();
        };

    }, [auth, firestore, user]); // Rerun effect if services or user object changes

    const value = { user, userProfile, isLoading, error };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


/**
 * The ONE hook to rule them all.
 * Provides the complete user state: auth object, firestore profile, and loading status.
 * @returns {UserState}
 */
export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider.');
  }
  return context;
};
