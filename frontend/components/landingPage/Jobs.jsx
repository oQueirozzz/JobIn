import Link from 'next/link'

export default function Jobs() {
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
          {/* Job Card 1 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Há 2 dias</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Desenvolvedor Frontend Júnior</h3>
              <p className="text-gray-600 mb-4">TechCorp Brasil</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">Remoto</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">20h/semana</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">R$1.200</span>
              </div>
              <Link 
                href="/vagas/1"
                className="block w-full text-center bg-[#7B2D26] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300"
              >
                Ver detalhes
              </Link>
            </div>
          </div>

          {/* Job Card 2 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Há 1 dia</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analista de Marketing Digital</h3>
              <p className="text-gray-600 mb-4">Agência Impulso</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">Híbrido</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">30h/semana</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">R$1.500</span>
              </div>
              <Link 
                href="/vagas/2"
                className="block w-full text-center bg-[#7B2D26] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300"
              >
                Ver detalhes
              </Link>
            </div>
          </div>

          {/* Job Card 3 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Há 3 dias</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Assistente de RH</h3>
              <p className="text-gray-600 mb-4">Grupo Empresarial Nexus</p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">Presencial</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">30h/semana</span>
                <span className="px-3 py-1 bg-[#7B2D26]/10 text-[#7B2D26] rounded-full text-sm">R$1.300</span>
              </div>
              <Link 
                href="/vagas/3"
                className="block w-full text-center bg-[#7B2D26] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7B2D26]/90 transition-colors duration-300"
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}