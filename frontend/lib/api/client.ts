import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true // Removido para evitar conflito com header Authorization
});

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na resposta:', error.response?.status, error.response?.data);

    // Redirecionar para login em caso de 401 (não autorizado)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Limpar autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirecionar apenas se não estiver já na página de login ou registro
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
// Interceptor para adicionar token JWT no header Authorization
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
