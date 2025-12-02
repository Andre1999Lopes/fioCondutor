"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar token no Zustand primeiro
    const authToken = token;
    const storedToken = localStorage.getItem("token");
    
    // Se não tem token em nenhum lugar, redirecionar
    if (!authToken && !storedToken) {
      router.push("/login");
    }
    
    setIsChecking(false);
  }, [token, router]);

  if (isChecking) {
    return null;
  }

  return children;
}
