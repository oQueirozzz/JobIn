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
    console.log('[useAuth] getInitialAuthInfo: window is undefined');
    return null;
  }

  try {
    const token = localStorage.getItem('authToken');
    const entityData = localStorage.getItem('authEntity');
    const authType = localStorage.getItem('authType');

    console.log('[useAuth] getInitialAuthInfo: Verificando dados de autenticação', {
      temToken: !!token,
      temEntityData: !!entityData,
      temAuthType: !!authType
    });

    if (!token || !entityData || !authType) {
      console.log('[useAuth] getInitialAuthInfo: Dados de autenticação incompletos');
      return null;
    }

    let entity;
    try {
      entity = JSON.parse(entityData);
      console.log('[useAuth] getInitialAuthInfo: Entity parseada com sucesso:', entity);
    } catch (parseError) {
      console.error('[useAuth] getInitialAuthInfo: Erro ao fazer parse da entity:', parseError);
      return null;
    }

    if (!entity || typeof entity !== 'object') {
      console.log('[useAuth] getInitialAuthInfo: Entity inválida');
      return null;
    }

    const authInfo = { type: authType, entity };
    console.log('[useAuth] getInitialAuthInfo: AuthInfo válido retornado:', authInfo);
    return authInfo;
  } catch (error) {
    console.error('[useAuth] getInitialAuthInfo: Erro ao ler localStorage:', error);
    return null;
  }
}

// Componente Provider
export function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { setIsLoading: setGlobalIsLoading } = useLoading();
  const router = useRouter();

  // Efeito para verificar autenticação inicial
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[useAuth] Iniciando verificação de autenticação');
      try {
        const initialAuth = getInitialAuthInfo();
        console.log('[useAuth] Resultado da verificação inicial:', initialAuth);
        
        if (initialAuth) {
          setAuthInfo(initialAuth);
        } else {
          console.log('[useAuth] Limpando dados de autenticação inválidos');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authEntity');
          localStorage.removeItem('authType');
          Cookies.remove('authToken');
          setAuthInfo(null);
        }
      } catch (error) {
        console.error('[useAuth] Erro ao verificar autenticação inicial:', error);
        setAuthInfo(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, senha, authType = 'user') => {
    try {
      setGlobalIsLoading(true);
      
      const apiUrl = authType === 'user' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/login`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha }),
        credentials: 'include'
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

      localStorage.setItem('authToken', token);
      localStorage.setItem('authEntity', JSON.stringify({
        ...entity,
        tipo: authType === 'user' ? 'usuario' : 'empresa'
      }));
      localStorage.setItem('authType', authType);

      Cookies.set('authToken', token, { expires: 7 });

      setAuthInfo({ type: authType, entity });
      router.push('/');
    } catch (error) {
      console.error('Erro durante o login:', error);
      setGlobalIsLoading(false);
      throw error;
    } finally {
      setGlobalIsLoading(false);
    }
  };

  const logout = () => {
    setGlobalIsLoading(true);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authEntity');
      localStorage.removeItem('authType');
      Cookies.remove('authToken');
    }
    setAuthInfo(null);
    router.push('/dashboard');
    setGlobalIsLoading(false);
  };

  const refreshAuthInfo = () => {
    try {
      const updatedAuth = getInitialAuthInfo();
      setAuthInfo(updatedAuth);
    } catch (error) {
      console.error('Erro ao refrescar autenticação:', error);
      setAuthInfo(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const isAuthenticated = !!authInfo;

  const value = {
    isAuthenticated,
    isLoading: isAuthLoading,
    authInfo,
    login,
    logout,
    refreshAuthInfo
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