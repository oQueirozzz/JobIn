'use client';

import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Jobs from "../../components/landingPage/Jobs";
import HeroSection from "../../components/landingPage/HeroSection";
import Empresas from "../../components/landingPage/Empresas";
import Funcionamento from "../../components/landingPage/Funcionamento";
import HeaderLanding from "../../components/landingPage/HeaderLanding";
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Removendo o redirecionamento para login, pois o dashboard deve ser acessível para usuários não autenticados
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-branco">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinho mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderLanding />
      <HeroSection />
      
      {/* Seção de Benefícios */}
      <section className="py-20 px-4 bg-[#F5F5DC]/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#7B2D26]">Por que escolher o JobIn?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#7B2D26]">Focado em Estudantes</h3>
              <p className="text-gray-600 leading-relaxed">Plataforma especializada em conectar estudantes com oportunidades de estágio e primeiro emprego</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#7B2D26]">Vagas Personalizadas</h3>
              <p className="text-gray-600 leading-relaxed">Encontre vagas que combinam com seu perfil e área de estudo</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-[#7B2D26]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#7B2D26]">Conexão Direta</h3>
              <p className="text-gray-600 leading-relaxed">Comunique-se diretamente com recrutadores e empresas</p>
            </div>
          </div>
        </div>
      </section>

      <Jobs />
      <Empresas />
      <Funcionamento />

      {/* CTA Final */}
      <section className="py-24 px-4 bg-gradient-to-br from-[#7B2D26] to-[#8B3D36] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Comece sua jornada profissional hoje</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de estudantes que já encontraram suas oportunidades através do JobIn
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/login"
              className="px-10 py-4 bg-white text-[#7B2D26] rounded-full hover:bg-[#F5F5DC] transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Entrar
            </Link>
            <Link 
              href="/cadAlunos"
              className="px-10 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 text-lg font-medium"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}