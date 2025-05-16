import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Recupera o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se o token existir, adiciona ao cabeçalho de autorização
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
    // Se o erro for 401 (Não autorizado), pode ser token expirado
    if (error.response && error.response.status === 401) {
      // Limpa o token inválido
      localStorage.removeItem('token');
      
      // Redireciona para a página de login se necessário
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Função para salvar o token após login bem-sucedido
export const setAuthToken = (token) => {
  if (token) {
    // Salva o token no localStorage
    localStorage.setItem('token', token);
  } else {
    // Remove o token do localStorage
    localStorage.removeItem('token');
  }
};

export default api;