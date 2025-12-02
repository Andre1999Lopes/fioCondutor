'use client';

import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // Fazer hydrate na inicialização para sincronizar com localStorage
    hydrate();
  }, [hydrate]);

  // Renderizar sempre para evitar hydration mismatch
  return children;
}
