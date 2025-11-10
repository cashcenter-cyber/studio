import { adminDb } from '@/lib/firebase/admin';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { UserTable } from '@/components/admin/user-table';

async function getUsers(): Promise<UserProfile[]> {
  if (!adminDb) {
    return [];
  }
  const usersCol = collection(adminDb, 'users');
  const q = query(usersCol, orderBy('joinDate', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      uid: doc.id,
      joinDate: data.joinDate.toDate(), 
    } as unknown as UserProfile;
  });
}


export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">User Management</h1>
            <p className="text-muted-foreground">View, manage, and take action on user accounts.</p>
        </div>
      </div>

      <div className="glass-card">
        <UserTable users={users} />
      </div>
    </div>
  );
}
