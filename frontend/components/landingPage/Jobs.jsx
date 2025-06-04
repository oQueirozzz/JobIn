'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Jobs() {
  const [vagas, setVagas] = useState([]);

  console.log('Componente Jobs montado, estado atual das vagas:', vagas);

  useEffect(() => {
    async function fetchVagas() {
      try {
        console.log('Iniciando busca de vagas no frontend...');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas`);
        console.log('Status da resposta:', res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados recebidos da API:', data);
        
        // Verificar se data é um array
        if (!Array.isArray(data)) {
          console.error('Dados recebidos não são um array:', data);
          setVagas([]);
          return;
        }

        // Ordenar e selecionar vagas aleatórias
        const vagasAleatorias = [...data]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        console.log('Vagas selecionadas:', vagasAleatorias);
        setVagas(vagasAleatorias);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
        setVagas([]);
      }
    }

    fetchVagas();
  }, []);

  // Adicionar um log para verificar o estado das vagas antes do render
  console.log('Estado das vagas antes do render:', vagas);

  return (
    <section id="jobs" className="py-32 bg-gradient-to-b from-white to-[#F5F5DC]/30 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-[#7B2D26]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#7B2D26]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-[#7B2D26] font-semibold tracking-wider uppercase text-sm mb-4 block">Oportunidades</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Vagas em Destaque</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] mx-auto md:mx-0 rounded-full"></div>
          </div>
          <Link
            href="/vagas"
            className="group inline-flex items-center px-8 py-4 bg-[#7B2D26] text-white rounded-full hover:bg-[#9B3D26] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Ver todas as vagas
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vagas && vagas.length > 0 ? (
            vagas.map((vaga) => (
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100" key={vaga.id}>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{vaga.nome_vaga}</h3>
                      <h2 className="text-xl text-[#7B2D26] font-semibold">{vaga.nome_empresa}</h2>
                    </div>
                    <div className="bg-[#7B2D26]/10 rounded-xl p-3 transform group-hover:rotate-6 transition-transform duration-500">
                      <svg className="w-8 h-8 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <svg className="h-6 w-6 text-[#7B2D26] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg">{vaga.local_vaga}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg className="h-6 w-6 text-[#7B2D26] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg">{vaga.categoria}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg className="h-6 w-6 text-[#7B2D26] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg">{vaga.tipo_vaga}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <svg className="h-6 w-6 text-[#7B2D26] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-semibold text-[#7B2D26]">R$ {vaga.salario}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                      href={`/vagas?vaga=${vaga.id}`}
                      className="block w-full text-center bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-gray-600">Nenhuma vaga disponível no momento.</p>
                <p className="text-gray-500 mt-2">Volte mais tarde para conferir novas oportunidades.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
