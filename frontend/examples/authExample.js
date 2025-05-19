// Exemplo de como utilizar o serviço de API com autenticação automática
import api, { setAuthToken } from '../services/api';

// Exemplo de função de login
export const fazerLogin = async (email, senha) => {
  try {
    // Faz a requisição de login
    const response = await api.post('/usuarios/login', { email, senha });
    
    // Extrai o token da resposta
    const { token } = response.data;
    
    // Salva o token (isso configurará automaticamente o token para todas as requisições futuras)
    setAuthToken(token);
    
    // Retorna os dados do usuário
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Exemplo de função que faz uma requisição autenticada
export const obterPerfilUsuario = async () => {
  try {
    // O token será incluído automaticamente no cabeçalho da requisição
    const response = await api.get('/usuarios/perfil');
    return response.data;
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    throw error;
  }
};

// Exemplo de função de logout
export const fazerLogout = () => {
  // Remove o token
  setAuthToken(null);
};