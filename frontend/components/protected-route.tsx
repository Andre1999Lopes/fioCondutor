'use client';

import { authApi } from '@/lib/api/api';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      router.push('/login');
      setIsChecking(false);
      return;
    }
    (async () => {
      try {
        await authApi.getProfile();
        setIsChecking(false);
      } catch (err) {
        logout();
        router.push('/login');
        setIsChecking(false);
      }
    })();
  }, [token, router, logout]);

  if (isChecking) {
    return null;
  }

  return children;
}
