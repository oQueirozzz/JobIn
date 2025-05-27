import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requisições - adiciona o token de autenticação
api.interceptors.request.use(
  (config) => {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      // Obter o token do localStorage
      const token = localStorage.getItem('authToken');
      
      // Se o token existir, adicionar ao cabeçalho de autorização
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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

// Função para salvar o token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    return true;
  } else {
    localStorage.removeItem('authToken');
    return false;
  }
};

export default api;