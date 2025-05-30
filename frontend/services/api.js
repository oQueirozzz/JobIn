import axios from 'axios';

// Criar instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Incluir cookies nas requisições
});

// Função para configurar o token de autenticação
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Se o erro for 401 (Não autorizado), pode significar que o token expirou
    if (error.response && error.response.status === 401) {
      // Limpar dados de autenticação
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authEntity');
        localStorage.removeItem('authType');
        
        // Redirecionar para a página de login
        window.location.href = '/dashboard';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;