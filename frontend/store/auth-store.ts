import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  nome: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          // Salvar token em cookie para o middleware
          document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Remover token do cookie
          document.cookie = "token=; path=/; max-age=0";
        }
      },
      hydrate: () => {
        // Sincronizar com localStorage na inicialização
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem("token");
          const userStr = localStorage.getItem("user");
          
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ token, user, isAuthenticated: true });
            } catch (err) {
              console.error("Erro ao fazer hydrate:", err);
            }
          }
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);