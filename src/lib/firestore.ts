'use client';
import { doc, setDoc, serverTimestamp, Firestore, collection, query, where, getDocs, limit, updateDoc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

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

/**
 * Ensures a user profile exists, creating or updating it as necessary.
 * If the user profile does not exist, it creates one.
 * If it exists but is missing a referral code, it adds one.
 * @param db Firestore instance.
 * @param userAuth The authenticated user object from Firebase Auth.
 * @param options Optional data from the sign-up process.
 */
export const ensureUserProfile = async (
  db: Firestore, 
  userAuth: User, 
  options: CreateUserOptions = {}
): Promise<void> => {
  if (!userAuth) throw new Error("User object is missing.");

  const userRef = doc(db, 'users', userAuth.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // --- Create New User Profile ---
      let referredBy: string | null = null;
      if (options.referralCode) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', options.referralCode.toUpperCase()), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          referredBy = querySnapshot.docs[0].id;
        }
      }

      const newUserProfile: Omit<UserProfile, 'joinDate'> & { joinDate: any } = {
        uid: userAuth.uid,
        email: userAuth.email,
        username: options.username || userAuth.displayName || userAuth.email?.split('@')[0] || `user_${userAuth.uid.substring(0, 6)}`,
        currentBalance: 0,
        lifetimeEarnings: 0,
        role: 'user',
        joinDate: serverTimestamp(),
        status: 'active',
        referralCode: generateReferralCode(), // Generate code for new user
        referredBy: referredBy,
        referralOf: options.referralCode || null,
        referralEarnings: 0,
      };
      
      // Use setDoc which can trigger a permission error if rules are incorrect
      await setDoc(userRef, newUserProfile);

    } else {
      // --- User Exists, Check for Missing Fields (like referralCode) ---
      const userProfile = docSnap.data() as UserProfile;
      if (!userProfile.referralCode) {
        // User exists but is from old system, add a referral code non-blockingly
        updateDocumentNonBlocking(userRef, {
            referralCode: generateReferralCode()
        });
      }
    }
  } catch (serverError: any) {
    // If getDoc, setDoc, or getDocs fails due to permissions, create and emit a contextual error.
    const operation = serverError.message.includes("permission-denied") || serverError.message.includes("permission denied")
        ? (docSnap?.exists() ? 'update' : 'create')
        : 'get';

    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: operation,
      requestResourceData: operation === 'create' ? { uid: userAuth.uid } : undefined,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  }
};
