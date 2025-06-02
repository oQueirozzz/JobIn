'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useLoading } from '../app/ClientLayout';

// Criando o contexto de autenticação
const AuthContext = createContext(null);

// Função auxiliar para verificar localStorage de forma segura
function getInitialAuthInfo() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const token = localStorage.getItem('authToken');
    const entityData = localStorage.getItem('authEntity');
    const authType = localStorage.getItem('authType');

    if (token && entityData && authType) {
      const entity = JSON.parse(entityData);
      if (entity && typeof entity === 'object') {
        return { type: authType, entity };
      }
    }
    return null;
  } catch (error) {
    console.error('useAuth - getInitialAuthInfo: Erro ao ler localStorage:', error);
    return null;
  }
}

// Componente Provider
export function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // Efeito para verificar autenticação inicial
  useEffect(() => {
    try {
      // Ativar o loader global durante a verificação de autenticação
      setIsLoading(true);
      const initialAuth = getInitialAuthInfo();
      setAuthInfo(initialAuth);
    } catch (error) {
      console.error('Erro ao verificar autenticação inicial:', error);
      setAuthInfo(null);
    } finally {
      setIsAuthLoading(false);
      // O loader global será controlado pelos componentes individuais
    }
  }, [setIsLoading]);

  const login = async (email, senha, authType = 'user') => {
    try {
      // Ativar o loader global durante o processo de login
      setIsLoading(true);
      
      const apiUrl = authType === 'user' 
        ? 'http://localhost:3001/api/usuarios/login'
        : 'http://localhost:3001/api/empresas/login';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha }),
        credentials: 'include' // Incluir cookies na requisição
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer login');
      }

      const data = await response.json();
      console.log('Resposta do login:', data);
      
      const { token } = data;
      const entity = authType === 'user' ? data.usuario : data.empresa;

      if (!token || !entity) {
        console.error('Dados de login inválidos:', { token: !!token, entity: !!entity, data });
        throw new Error('Dados de login inválidos');
      }

      // Salvar no localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authEntity', JSON.stringify(entity));
      localStorage.setItem('authType', authType);

      // Salvar no cookie
      Cookies.set('authToken', token, { expires: 7 });

      setAuthInfo({ type: authType, entity });
      router.push('/');
    } catch (error) {
      console.error('Erro durante o login:', error);
      // Desativar o loader global em caso de erro
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Ativar o loader global durante o processo de logout
    setIsLoading(true);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authEntity');
      localStorage.removeItem('authType');
      Cookies.remove('authToken');
    }
    setAuthInfo(null);
    router.push('/dashboard');
  };

  const isAuthenticated = !!authInfo;

  // Valor do contexto
  const value = {
    isAuthenticated,
    isLoading: isAuthLoading,
    authInfo,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}