import axios from 'axios';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requisições - modificado para funcionar sem token
api.interceptors.request.use(
  (config) => {
    // Versão simplificada que não exige token
    // Não adiciona cabeçalho de autorização
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros - simplificado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Tratamento de erro simplificado que não verifica token
    console.log('Erro na requisição:', error.message);
    return Promise.reject(error);
  }
);


// Função para salvar o token - simplificada para funcionar sem autenticação
export const setAuthToken = (token) => {
  // Versão simplificada que não armazena o token
  // Mantida para compatibilidade com o código existente
  console.log('Sistema funcionando sem autenticação por token');
  return true;
};

export default api;