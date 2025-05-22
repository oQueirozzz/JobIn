'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState({
    keyword: '',
    location: '',
    area: ''
  });

  const handleSearch = () => {
    // Implementar lógica de busca
    console.log('Searching with:', searchQuery);
  };

  return (
    <div className="relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[#D7C9AA] opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <section id="hero" className="pt-32 pb-20 bg-gradient-to-b from-[#D7C9AA] to-[#F0F3F5] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in-up">
                Comece sua carreira <span className="text-[#7B2D26] italic relative">
                  aqui e agora
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#7B2D26] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in-up animation-delay-200">
                Conectamos estudantes talentosos às melhores oportunidades de estágio. Dê o primeiro passo na sua carreira profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
                <button 
                  onClick={() => router.push('/feed')}
                  className="bg-[#7B2D26] text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all duration-300 text-center cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  <span>Buscar Vagas</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
                <button 
                  onClick={() => router.push('/cadEmpresas')}
                  className="border-2 border-[#7B2D26] text-[#7B2D26] px-8 py-3 rounded-full font-medium hover:bg-[#D7C9AA] hover:bg-opacity-30 transition-all duration-300 text-center cursor-pointer transform hover:-translate-y-1 flex items-center justify-center group"
                >
                  <span>Para Empresas</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in-up animation-delay-600">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#7B2D26] rounded-2xl transform rotate-3 opacity-10"></div>
                <img 
                  className="w-full max-w-md rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 relative z-10" 
                  src="/img/landing/banner.png" 
                  alt="Estudantes profissionais em trajes casuais de negócios olhando para um laptop em um escritório moderno" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="search" className="py-10 bg-[#F0F3F5]">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 -mt-16 relative z-10 border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-fade-in-up animation-delay-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Cargo ou palavra-chave"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition-all duration-300"
                    value={searchQuery.keyword}
                    onChange={(e) => setSearchQuery({...searchQuery, keyword: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Localização"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition-all duration-300"
                    value={searchQuery.location}
                    onChange={(e) => setSearchQuery({...searchQuery, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    </svg>
                  </div>
                  <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] appearance-none bg-white transition-all duration-300"
                    value={searchQuery.area}
                    onChange={(e) => setSearchQuery({...searchQuery, area: e.target.value})}
                  >
                    <option value="">Área de Estudo</option>
                    <option value="administracao">Administração</option>
                    <option value="tecnologia">Tecnologia</option>
                    <option value="engenharia">Engenharia</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#7B2D26] text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center group"
              >
                <span>Pesquisar</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  );
}

