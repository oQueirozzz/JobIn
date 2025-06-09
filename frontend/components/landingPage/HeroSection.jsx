'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HeroSection() {
  const [empresa, setEmpresa] = useState('');
  const [vagas, setVagas] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState({
    area: '',
    tipo: '',
    empresa: ''
  });

  

  async function handleSearch() {
    {
      try {
        const queryParams = new URLSearchParams();

        if (searchQuery.area) queryParams.append('area', searchQuery.area);
        if (searchQuery.tipo) queryParams.append('tipo', searchQuery.tipo);
        if (searchQuery.empresa) queryParams.append('empresa', searchQuery.empresa);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas?${queryParams}`);
        const data = await res.json();

        console.log('Resultados:', data);

        window.location.href = '/vagas';
      } catch (error) {
        console.error('Erro ao buscar vagas:', error);
      }
    };

  

  }
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
                <select  
                value={categoria}
                    onChange={(e) => setCategoria(e.target.value)} 
                     className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent appearance-none bg-white">
                  <option value="">Área</option>
                  <option value="TI">Tecnologia da Informação</option>
                  <option value="Mecânica">Mecânica</option>
                  <option value="Design">Design</option>
                  <option value="Administração">Administração</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Outros">Outros</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </div>

              <div className="relative">
                <select  
                   value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent appearance-none bg-white">
                  <option value="">Tipo</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                  <option value="remoto">Remoto</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </div>

              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent appearance-none bg-white"
                  onChange={(e) => setEmpresa(e.target.value)}
                
                >
                  <option value="">Todas as empresas</option>
                  {[...new Set(vagas.map(vaga => vaga.nome_empresa))].map((empresaNome) => (
                    <option key={empresaNome} value={empresaNome} >
                      {empresaNome}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                </svg>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button onClick={handleSearch} className="bg-[#7B2D26] cursor-pointer text-white px-8 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
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

