import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from './firebase/config';
import type { UserProfile } from './types';

export const createUserProfile = async (userAuth: User, username: string | null = null) => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);

  const newUserProfile: Omit<UserProfile, 'uid'> = {
    email: userAuth.email,
    username: username || userAuth.displayName,
    currentBalance: 0,
    lifetimeEarnings: 0,
    role: 'user',
    joinDate: serverTimestamp() as any,
    status: 'active',
  };

  try {
    await setDoc(userRef, newUserProfile);
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
  }
};
