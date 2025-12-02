"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação apenas no cliente
    const token = localStorage.getItem("token");
    console.log("Dashboard Layout - Token:", token ? "presente" : "ausente");
    
    if (!token) {
      console.log("Redirecionando para login");
      router.push("/login");
    } else {
      console.log("Token encontrado, renderizando dashboard");
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
