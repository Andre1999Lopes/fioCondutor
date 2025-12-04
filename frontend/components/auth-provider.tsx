'use client';

import { useAuthStore } from '@/store/auth-store';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Com cookies HttpOnly, não precisamos mais de hydrate
  // O estado será carregado automaticamente quando ProtectedRoute chamar getProfile
  return <>{children}</>;
}
