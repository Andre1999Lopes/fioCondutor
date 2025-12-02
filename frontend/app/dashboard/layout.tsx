'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { authApi } from '@/lib/api/api';

export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica autenticação ao montar
    (async () => {
      try {
        await authApi.getProfile();
        setIsLoading(false);
      } catch {
        router.push('/login');
      }
    })();
  }, [router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Carregando...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
