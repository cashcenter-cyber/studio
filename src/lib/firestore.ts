'use client';
import { doc, setDoc, serverTimestamp, Firestore, collection, query, where, getDocs, limit, updateDoc, getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { UserProfile } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


/**
 * @deprecated This function is being replaced by a server-side action.
 */
export const ensureUserProfile = async (
  db: Firestore, 
  userAuth: User, 
  options: any = {}
): Promise<void> => {
    // This client-side function is deprecated. The logic has been moved to 
    // `ensureUserProfileExistsAction` to be handled securely on the server.
    // This function can be removed in a future cleanup.
    console.warn("`ensureUserProfile` is deprecated and should not be used. Use the server action instead.");
};
