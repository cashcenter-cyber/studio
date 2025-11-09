'use client';

import { useContext } from 'react';
import { FirebaseContext, useUser } from '@/firebase';
import type { AuthContextType } from '@/context/auth-provider-not-used';

export const useAuth = () => {
  return useUser();
};
