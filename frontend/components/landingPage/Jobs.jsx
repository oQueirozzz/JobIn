'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Jobs() {
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    async function fetchVagas() {
      try {
        const res = await fetch('http://localhost:3001/api/vagas');
        const data = await res.json();
        console.log(data);
        setVagas(data);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
      }
    }

    fetchVagas();
  }, []);

  return (
    <section id="jobs" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Vagas em Destaque</h2>
            <div className="w-20 h-1 bg-[#7B2D26]"></div>
          </div>
          <Link
            href="/login"
            className="text-[#7B2D26] hover:text-[#7B2D26]/80 transition-colors duration-300 font-medium flex items-center group"
          >
            Ver todas
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vagas.map((vaga) => (
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100" key={vaga.id}>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800  flex justify-between">
                  {vaga.nome_vaga}
                  <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </h3>
                <p className="text-gray-600 mb-4">{vaga.nome_vaga}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">{vaga.modalidade}</span>
                  <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">{vaga.salario}</span>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center bg-[#7B2D26] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
