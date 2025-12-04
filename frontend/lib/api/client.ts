import { toast } from '@/lib/hooks/toast';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na resposta:', error.response?.status, error.response?.data);

    // Exibir toast de erro com mensagem do backend (se houver)
    const backendMsg = error.response?.data?.message || error.response?.data?.error || error.message;
    if (backendMsg) {
      toast.error(String(backendMsg), 'Erro');
    }

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
