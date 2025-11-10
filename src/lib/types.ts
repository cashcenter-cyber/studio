import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string | null;
  currentBalance: number;
  lifetimeEarnings: number;
  role: 'user' | 'admin';
  profilePicture?: string;
  joinDate: Timestamp | Date; // Can be Timestamp from Firestore or Date after parsing
  status: 'active' | 'suspended' | 'anonymized';
  referralCode?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'payout' | 'bonus' | 'adjustment';
  externalTransactionId?: string;
  description: string;
  createdAt: Timestamp;
  status: 'completed' | 'pending' | 'failed';
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
    category: 'Game' | 'Survey' | 'App' | 'Quiz';
    partner: string;
    imageUrl: string;
    status: 'active' | 'inactive';
    externalId?: string;
    offerUrl: string;
}

export interface OfferwallTransaction {
    userId: string;
    amount: number;
    offerId: string;
    offerName?: string;
}
