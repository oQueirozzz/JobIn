'use client';

import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Jobs from "../../components/landingPage/Jobs";
import HeroSection from "../../components/landingPage/HeroSection";
import Funcionamento from "../../components/landingPage/Funcionamento";
import HeaderLanding from "../../components/landingPage/HeaderLanding";
import Link from 'next/link';
import { useLoading } from '../ClientLayout';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { setIsLoading } = useLoading();
  const router = useRouter();

  // Desativar o loader global quando a página de dashboard for carregada
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="min-h-screen bg-white">
      <HeaderLanding />
      <HeroSection />
      
      {/* Seção de Benefícios */}
      <section className="py-32 px-4 bg-gradient-to-b from-[#F5F5DC]/30 to-white relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#7B2D26]/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#7B2D26]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#7B2D26]/10 to-[#9B3D26]/10 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <span className="text-[#7B2D26] font-semibold tracking-wider uppercase text-sm mb-4 block">Nossos Diferenciais</span>
            <h2 className="text-4xl md:text-6xl font-bold text-[#7B2D26] mb-6 leading-tight">Por que escolher o JobIn?</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] mx-auto rounded-full mb-8"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Uma plataforma completa para impulsionar sua carreira e conectar talentos às melhores oportunidades do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B2D26]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7B2D26] to-[#9B3D26] rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-[#7B2D26] group-hover:text-[#9B3D26] transition-colors duration-300 text-center">Focado em Estudantes</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Plataforma especializada em conectar estudantes com oportunidades de estágio e primeiro emprego, com foco em desenvolvimento profissional e crescimento contínuo
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B2D26]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7B2D26] to-[#9B3D26] rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-[#7B2D26] group-hover:text-[#9B3D26] transition-colors duration-300 text-center">Vagas Personalizadas</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Sistema inteligente que encontra vagas perfeitamente alinhadas com seu perfil, habilidades e objetivos de carreira, maximizando suas chances de sucesso
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B2D26]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#7B2D26] to-[#9B3D26] rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-[#7B2D26] group-hover:text-[#9B3D26] transition-colors duration-300 text-center">Conexão Direta</h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  Comunicação direta e eficiente com recrutadores e empresas, agilizando todo o processo de contratação e facilitando sua entrada no mercado
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Jobs />
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