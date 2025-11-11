'use client';
import { doc, setDoc, serverTimestamp, Firestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';

// Simple function to generate a random string for referral codes
const generateReferralCode = (length: number = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface CreateUserOptions {
  username: string | null;
  referralCode?: string | null;
}

export const createUserProfile = async (
  db: Firestore, 
  userAuth: User, 
  options: CreateUserOptions | null = { username: null }
) => {
  if (!userAuth) throw new Error("User object is missing.");

  const userRef = doc(db, 'users', userAuth.uid);
  let referredBy = null;

  // If a referral code is provided, find the referring user
  if (options?.referralCode) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', options.referralCode), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const referringUserDoc = querySnapshot.docs[0];
      referredBy = referringUserDoc.id;
    }
  }

  // Assign role based on UID
  const userRole = userAuth.uid === 'PLilMKBPuvQRn9pwbpnTWDKXj7Q2' ? 'admin' : 'user';

  const newUserProfile: Omit<UserProfile, 'uid'> = {
    email: userAuth.email,
    username: options?.username || userAuth.displayName || userAuth.email,
    currentBalance: 0,
    lifetimeEarnings: 0,
    role: userRole,
    joinDate: serverTimestamp() as any,
    status: 'active',
    referralCode: generateReferralCode(),
    referredBy: referredBy,
    referralOf: options?.referralCode || null,
    referralEarnings: 0
  };

  try {
    await setDoc(userRef, newUserProfile);
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    // Re-throw the error to be caught by the caller
    throw new Error('Failed to create user profile in database.');
  }
};
