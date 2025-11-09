import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string | null;
  currentBalance: number;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  anonymized?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'payout' | 'adjustment';
  description: string;
  createdAt: Timestamp;
}

export interface Payout {
  id: string;
  userId: string;
  username: string | null;
  amount: number;
  method: string;
  payoutAddress: string;
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Timestamp;
  processedAt?: Timestamp;
}
