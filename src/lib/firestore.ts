'use client';
import { doc, setDoc, serverTimestamp, Firestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const generateReferralCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface CreateUserOptions {
  username?: string | null;
  referralCode?: string | null;
}

export const createUserProfile = async (
  db: Firestore, 
  userAuth: User, 
  options: CreateUserOptions = {}
): Promise<void> => {
  if (!userAuth) throw new Error("User object is missing.");

  const userRef = doc(db, 'users', userAuth.uid);
  let referredBy: string | null = null;
  
  if (options.referralCode) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', options.referralCode.toUpperCase()), limit(1));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const referringUserDoc = querySnapshot.docs[0];
        referredBy = referringUserDoc.id;
      }
    } catch (e) {
        console.error("Error finding referrer:", e);
    }
  }
  
  const userRole = 'user';

  const newUserProfile: Omit<UserProfile, 'joinDate'> & { joinDate: any } = {
    uid: userAuth.uid,
    email: userAuth.email,
    username: options.username || userAuth.displayName || userAuth.email?.split('@')[0] || `user_${userAuth.uid.substring(0, 6)}`,
    currentBalance: 0,
    lifetimeEarnings: 0,
    role: userRole,
    joinDate: serverTimestamp(),
    status: 'active',
    referralCode: generateReferralCode(),
    referredBy: referredBy,
    referralOf: options.referralCode || null,
    referralEarnings: 0,
  };

  try {
    await setDoc(userRef, newUserProfile);
  } catch (serverError: any) {
      const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: newUserProfile,
      });
      errorEmitter.emit('permission-error', permissionError);
      throw permissionError;
  }
};
