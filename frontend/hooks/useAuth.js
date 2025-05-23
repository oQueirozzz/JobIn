import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    // Limpa o localStorage
    localStorage.clear();
    
    // Limpa os cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Atualiza o estado
    setIsAuthenticated(false);
    
    // Força o redirecionamento
    router.push('/dashboard');
    router.refresh();
  };

  return {
    isAuthenticated,
    isLoading,
    logout
  };
} 