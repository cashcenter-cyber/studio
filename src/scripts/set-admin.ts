// Usage: ts-node --require dotenv/config src/scripts/set-admin.ts <user-email>
import { adminAuth, adminDb } from '../lib/firebase/admin';
import { doc, updateDoc } from 'firebase/firestore';

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address.');
  process.exit(1);
}

const setAdminRole = async (email: string) => {
  try {
    const user = await adminAuth.getUserByEmail(email);
    const uid = user.uid;

    // Set custom claim in Auth
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    
    // Update role in Firestore
    const userRef = doc(adminDb, 'users', uid);
    await updateDoc(userRef, { role: 'admin' });

    console.log(`Success! ${email} has been made an admin.`);
    process.exit(0);
  } catch (error: any) {
    console.error('Error setting admin role:', error.message);
    process.exit(1);
  }
};

setAdminRole(email);
