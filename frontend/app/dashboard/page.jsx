'use client';

import { useAuth } from '../../hooks/useAuth';
import Jobs from "../../components/landingPage/Jobs";
import HeroSection from "../../components/landingPage/HeroSection";
import Empresas from "../../components/landingPage/Empresas";
import Funcionamento from "../../components/landingPage/Funcionamento";
import HeaderLanding from "../../components/landingPage/HeaderLanding";
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed');
    }
  }, [isAuthenticated, router]);

  // Se estiver carregando, mostra um loading simples
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B2D26]"></div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra a landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeaderLanding />
      <HeroSection />
      <Jobs />
      <Empresas />
      <Funcionamento />
      <section className="py-20 px-4 bg-[#7B2D26] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Comece sua jornada profissional hoje</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já encontraram suas oportunidades através do JobIn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cadAlunos"
              className="px-8 py-3 bg-white text-[#7B2D26] rounded-full hover:bg-gray-100 transition-all duration-300 text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Cadastrar-se
            </Link>
            <Link 
              href="/cadEmpresas"
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 text-lg font-medium"
            >
              Cadastrar empresa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 