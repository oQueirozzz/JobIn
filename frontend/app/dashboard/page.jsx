'use client';

import { useAuth } from '../../hooks/useAuth';
import Jobs from "../../components/landingPage/Jobs";
import HeroSection from "../../components/landingPage/HeroSection";
import Empresas from "../../components/landingPage/Empresas";
import Funcionamento from "../../components/landingPage/Funcionamento";
import HeaderLanding from "../../components/landingPage/HeaderLanding";
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostra um loading enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B2D26]"></div>
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

      {/* Seção de Benefícios */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o JobIn?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Focado em Estudantes</h3>
              <p className="text-gray-600">Plataforma especializada em conectar estudantes com oportunidades de estágio e primeiro emprego</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vagas Personalizadas</h3>
              <p className="text-gray-600">Encontre vagas que combinam com seu perfil e área de estudo</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Conexão Direta</h3>
              <p className="text-gray-600">Comunique-se diretamente com recrutadores e empresas</p>
            </div>
          </div>
        </div>
      </section>

      <Jobs />
      <Empresas />
      <Funcionamento />

      {/* CTA Final */}
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