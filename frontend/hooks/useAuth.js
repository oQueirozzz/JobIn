import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica autenticação apenas uma vez ao montar o componente
    const token = Cookies.get('token') || localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    if (token && usuario) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Limpa dados residuais
      Cookies.remove('token');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    
    setIsLoading(false);
  }, []); // Array de dependências vazio para executar apenas uma vez

  const login = (userData, token) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', token);
    Cookies.set('token', token);
    setIsAuthenticated(true);
    router.push('/feed');
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    Cookies.remove('token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
} 