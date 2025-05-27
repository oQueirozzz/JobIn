'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <section id="hero" className="relative bg-gradient-to-b from-[#7B2D26]/5 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Encontre o Estágio Ideal para sua Carreira
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Conectamos estudantes talentosos às melhores oportunidades de estágio. Comece sua jornada profissional hoje mesmo.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cargo ou palavra-chave"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="briefcase" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z"></path>
                </svg>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Localização"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                </svg>
              </div>
              
              <div className="relative">
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent appearance-none bg-white">
                  <option value="">Área de Estudo</option>
                  <option value="ti">Tecnologia da Informação</option>
                  <option value="adm">Administração</option>
                  <option value="marketing">Marketing</option>
                  <option value="rh">Recursos Humanos</option>
                  <option value="financas">Finanças</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <button className="bg-[#7B2D26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Buscar Vagas
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/cadAlunos"
              className="bg-white text-[#7B2D26] px-8 py-3 rounded-full font-medium hover:bg-[#7B2D26]/10 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-[#7B2D26]"
            >
              Sou Aluno
            </Link>
            <Link 
              href="/cadEmpresas"
              className="bg-[#7B2D26] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Para Empresas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

