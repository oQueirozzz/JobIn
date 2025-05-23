import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const usuario = localStorage.getItem('usuario');
      
      if (token && usuario) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Limpa dados residuais
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
      setIsLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    router.replace('/feed');
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.replace('/');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };
} 