import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';

export const createUserProfile = async (db: Firestore, userAuth: User, username: string | null = null) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);

  // Ensure role is explicitly set for all new users.
  const newUserProfile: Omit<UserProfile, 'uid'> = {
    email: userAuth.email,
    username: username || userAuth.displayName,
    currentBalance: 0,
    lifetimeEarnings: 0,
    role: 'user', // Explicitly set role
    joinDate: serverTimestamp() as any,
    status: 'active',
  };

  try {
    await setDoc(userRef, newUserProfile);
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    // Note: In a real app, you would want to handle this more gracefully.
  }
};
