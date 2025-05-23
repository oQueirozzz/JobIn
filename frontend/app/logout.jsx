'use client';

import { useAuth } from '../hooks/useAuth';
import Jobs from "../components/landingPage/Jobs";
import HeroSection from "../components/landingPage/HeroSection";
import Empresas from "../components/landingPage/Empresas";
import Funcionamento from "../components/landingPage/Funcionamento";
import HeaderLanding from "../components/landingPage/HeaderLanding";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra um loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vinho"></div>
      </div>
    );
  }

  // Se estiver autenticado, não renderiza nada (o middleware cuidará do redirecionamento)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderLanding />
      <HeroSection />
      <Jobs />
      <Empresas />
      <Funcionamento />
    </div>
  );
} 