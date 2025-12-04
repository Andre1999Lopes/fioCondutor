"use client";

import { AuthInitializer } from "@/components/auth-provider";
import { ToastViewport } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </AuthProvider>
      </ThemeProvider>
      <ToastViewport />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}