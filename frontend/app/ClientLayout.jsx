'use client';

import "../public/css/globals.css";
import Footer from "../components/Footer/Footer";
import { usePathname } from 'next/navigation';
import Header from "../components/Header/Header";
import HeaderLanding from "../components/landingPage/HeaderLanding";
import { AuthProvider } from '../hooks/useAuth';
import Loader from "../components/Loader/Loader";
import { useState, useEffect, createContext, useContext } from 'react';

// Criando um contexto para o estado de carregamento global
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {}
});

// Hook personalizado para usar o contexto de carregamento
export function useLoading() {
  return useContext(LoadingContext);
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  // Escondemos o header na página de dashboard, pois ela já tem seu próprio HeaderLanding
  const hideHeaderRoutes = ["/dashboard"];
  const shouldHideHeader = hideHeaderRoutes.includes(pathname);
  
  // Rotas que devem usar o HeaderLanding em vez do Header padrão
  const landingHeaderRoutes = ["/login", "/cadAlunos", "/cadEmpresas", "/novaSenha"];
  const shouldUseLandingHeader = landingHeaderRoutes.includes(pathname);
  
  // Simular carregamento inicial da aplicação
  useEffect(() => {
    // Iniciar com carregamento
    setIsLoading(true);
    
    // Simular tempo de carregamento (pode ser removido em produção)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [pathname]); // Recarregar quando mudar de página

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AuthProvider>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {!shouldHideHeader && (
              shouldUseLandingHeader ? <HeaderLanding /> : <Header />
            )}
            {children}
            <Footer />
          </>
        )}
      </AuthProvider>
    </LoadingContext.Provider>
  );
}
