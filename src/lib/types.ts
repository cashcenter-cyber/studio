import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string | null;
  currentBalance: number;
  lifetimeEarnings: number;
  role: 'user' | 'admin';
  profilePicture?: string;
  joinDate: Timestamp;
  status: 'active' | 'suspended' | 'anonymized';
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'offer_completed' | 'payout' | 'bonus' | 'adjustment';
  externalTransactionId?: string;
  description: string;
  transactionDate: Timestamp;
  status: 'completed' | 'pending' | 'failed';
}

export interface Payout {
  id: string;
  userId: string;
  username: string | null;
  amount: number;
  method: 'paypal' | 'crypto' | 'giftcard';
  payoutAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: Timestamp;
  completionDate?: Timestamp;
}

export interface Point {
    id: string;
    userId: string;
    pointsAmount: number;
    pointsType: 'daily_streak' | 'level_up' | 'treasure' | 'spin';
    earnDate: Timestamp;
    expiryDate?: Timestamp;
}

export interface Offer {
    id: string;
    name: string;
    description: string;
    reward: number;
    category: string;
    partnerId: string;
    status: 'active' | 'inactive';
    externalId?: string;
}
