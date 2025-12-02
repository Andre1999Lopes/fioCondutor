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
    // Só redireciona se já estiver autenticado (token presente)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
