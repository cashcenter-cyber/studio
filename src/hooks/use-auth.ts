'use client';

import { useContext } from 'react';
import { AuthContext } from '@/context/auth-provider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // The context now directly provides the User object and profile
  return {
    user: context.user,
    userProfile: context.userProfile,
    isUserLoading: context.loading, // Renamed for clarity
  };
};
