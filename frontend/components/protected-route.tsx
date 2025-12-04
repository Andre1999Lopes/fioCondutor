'use client';

import { authApi } from '@/lib/api/api';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { setUser, logout } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await authApi.getProfile();
        setUser(response.data.usuario);
        setIsChecking(false);
      } catch (err) {
        logout();
        router.push('/login');
        setIsChecking(false);
      }
    })();
  }, [router, logout, setUser]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
