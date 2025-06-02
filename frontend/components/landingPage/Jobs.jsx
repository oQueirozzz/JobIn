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

        const vagasAleatorias = data
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        setVagas(vagasAleatorias);
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
            href="/vagas"
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
                  <div className=" bg-[#7B2D26]/10 rounded-lg flex items-center justify-center w-10 h-10">
                    <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </h3>
                <h2 className="text-xl text-[#7B2D26] mt-1">{vaga.nome_empresa}</h2>
                <div className="flex flex-wrap pt-2 text-gray-700 text-2sm gap-2">

                  <span className='flex'>
                    <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vaga.local_vaga}
                  </span>

                  <span className="text-[#7B2D26]">|</span>
                  <span>{vaga.tipo_vaga}</span>
                </div>

                <div className="flex pt-2 text-gray-700 text-lg">
                  <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Área<span className="pl-2 text-lg">{vaga.categoria}</span>
                </div>

                <div className="flex pt-2 text-lg text-gray-700">
                  <svg width="25" height="25" viewBox="0 0 200 113" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                    <path d="M165.646 0C174.296 0 181.354 7.05848 181.354 15.708V65.2793H167.932V32.6807C166.708 33.0071 165.361 33.1699 164.015 33.1699C155.243 33.1699 148.103 26.0297 148.103 17.2578C148.103 15.9116 148.266 14.6057 148.593 13.3818H31.8643C32.0683 14.361 32.1504 15.3003 32.1504 16.3203C32.1502 25.092 25.0101 32.2314 16.2383 32.2314C15.2999 32.2314 14.3614 32.1505 13.4639 31.9873V80.2529C14.3615 80.0897 15.2999 80.0078 16.2383 80.0078C25.0102 80.0078 32.1503 87.148 32.1504 95.9199C32.1504 96.9399 32.0274 97.9191 31.8643 98.8574H125.051V112.28H15.708C7.05861 112.28 0.000221916 105.223 0 96.5732V15.708C0 7.05848 7.05848 0 15.708 0H165.646ZM179.355 101.02C180.457 101.02 181.354 101.918 181.354 103.02V110.281C181.354 111.383 180.457 112.28 179.355 112.28H131.212C130.11 112.28 129.213 111.383 129.213 110.281V103.02C129.213 101.918 130.11 101.02 131.212 101.02H179.355ZM188.698 85.2305C189.8 85.2305 190.697 86.128 190.697 87.2295V94.4922C190.697 95.5937 189.8 96.4912 188.698 96.4912H140.555C139.453 96.4911 138.556 95.5937 138.556 94.4922V87.2295C138.556 86.1281 139.453 85.2306 140.555 85.2305H188.698ZM90.6973 21.7051C109.71 21.7051 125.133 37.128 125.133 56.1406C125.133 75.1531 109.71 90.5752 90.6973 90.5752C71.6849 90.575 56.2628 75.153 56.2627 56.1406C56.2627 37.1281 71.644 21.7053 90.6973 21.7051ZM89.7998 30.5586C89.188 30.5587 88.7393 31.049 88.7393 31.6201V36.3115C85.7609 36.7603 83.3125 37.821 81.4766 39.6162C79.4366 41.5746 78.417 44.0641 78.417 47.124C78.4171 50.4692 79.3961 53.0394 81.3135 54.7529C83.231 56.4665 86.332 58.18 90.5342 59.8936C92.2886 60.6279 93.4724 61.4035 94.166 62.1787C94.8595 62.9539 95.1855 64.0556 95.1855 65.4834C95.1855 66.7074 94.8588 67.6867 94.2061 68.4619C93.5533 69.1962 92.574 69.6045 91.2686 69.6045C89.7185 69.6044 88.4539 69.1147 87.5156 68.1357C86.7405 67.3198 86.2504 66.0957 86.1279 64.4639C86.0871 63.8111 85.5161 63.3215 84.8633 63.3623L78.417 63.4844C77.7234 63.4844 77.1523 64.0964 77.1523 64.79C77.3156 68.2171 78.4171 70.8283 80.457 72.7051C82.6602 74.7042 85.4346 75.9277 88.7393 76.2949V80.7021C88.7395 81.3138 89.2289 81.7625 89.7998 81.7627H93.7168C94.3286 81.7627 94.7771 81.2732 94.7773 80.7021V76.1318C97.4293 75.6422 99.5919 74.5814 101.265 72.9902C103.223 71.0727 104.202 68.5839 104.202 65.4424C104.202 62.1786 103.223 59.6486 101.265 57.8535C99.3063 56.0992 96.2463 54.3041 92.085 52.5498C90.2899 51.7747 89.0659 50.9997 88.4131 50.2246C87.7603 49.4494 87.4336 48.4291 87.4336 47.2051C87.4336 45.9814 87.7193 45.0024 88.3311 44.1865C88.943 43.4113 89.8817 43.0029 91.1465 43.0029C92.4113 43.0029 93.3908 43.4923 94.166 44.4307C94.7779 45.2058 95.1451 46.2666 95.2676 47.6943C95.3084 48.3471 95.9202 48.7969 96.5322 48.7969L102.979 48.7148C103.672 48.7148 104.284 48.1027 104.243 47.4092C104.08 44.5942 103.182 42.2281 101.51 40.3105C99.7963 38.3115 97.5523 37.0458 94.7373 36.4746V31.6201C94.7781 31.0081 94.288 30.5586 93.7168 30.5586H89.7998ZM198.001 69.4414C199.102 69.4415 200 70.3389 200 71.4404V78.7021C200 79.8037 199.102 80.7021 198.001 80.7021H149.857C148.756 80.7021 147.858 79.8037 147.858 78.7021V71.4404C147.858 70.3388 148.756 69.4414 149.857 69.4414H198.001ZM40.5957 46.5928C45.8588 46.5928 50.1426 50.8775 50.1426 56.1406C50.1424 61.4037 45.8588 65.6875 40.5957 65.6875C35.3326 65.6875 31.049 61.4037 31.0488 56.1406C31.0488 50.8775 35.3325 46.5928 40.5957 46.5928ZM140.759 46.5928C146.022 46.5928 150.306 50.8775 150.306 56.1406C150.306 61.4037 146.022 65.6875 140.759 65.6875C135.496 65.6875 131.212 61.4036 131.212 56.1406C131.212 50.8775 135.496 46.5928 140.759 46.5928Z" fill="#7B2D26" />
                  </svg>

                  R$
                  <span className=" text-lg font-semibold text-[#7B2D26] pl-2">{vaga.salario}</span>
                </div>
                <hr className="bg-red-900 h-0.5 my-3" />

                <Link
                  href="/vagas"
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
