export default function Jobs() {
  return (
    <div>
      <section id="featured-jobs" className="py-16 bg-[#F0F3F5]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-1 after:bg-[#7B2D26]">Vagas em Destaque</h2>
            <span className="text-[#7B2D26] hover:underline font-medium flex items-center cursor-pointer group transition-all duration-300">
              Ver todas
              <svg className="svg-inline--fa fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"></path>
              </svg>
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div id="job-card-1" className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-[#D7C9AA] rounded-lg flex items-center justify-center mr-4">
                    <svg className="text-[#7B2D26] w-6 h-6" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                      <path fill="currentColor" d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Estágio em Desenvolvimento Web</h3>
                    <p className="text-gray-600">TechCorp Brasil</p>
                  </div>
                  <button className="ml-auto text-gray-400 hover:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="currentColor" d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">Remoto</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">20h/semana</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">R$1.200</span>
                </div>
                <p className="text-gray-600 mb-4">Estágio para estudantes de Ciência da Computação, Sistemas de Informação ou áreas correlatas. Conhecimentos em HTML, CSS e JavaScript.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Publicado há 2 dias</span>
                  <span className="text-[#7B2D26] font-medium hover:underline cursor-pointer group flex items-center">
                    Ver detalhes
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          
            <div id="job-card-2" className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-[#D7C9AA] rounded-lg flex items-center justify-center mr-4">
                    <svg className="text-[#7B2D26] w-6 h-6" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-line" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path fill="currentColor" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Estágio em Marketing Digital</h3>
                    <p className="text-gray-600">Agência Impulso</p>
                  </div>
                  <button className="ml-auto text-gray-400 hover:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="currentColor" d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">Presencial</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">30h/semana</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">R$1.500</span>
                </div>
                <p className="text-gray-600 mb-4">Oportunidade para estudantes de Marketing, Publicidade ou Comunicação. Conhecimentos em redes sociais e ferramentas de design.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Publicado há 3 dias</span>
                  <span className="text-[#7B2D26] font-medium hover:underline cursor-pointer group flex items-center">
                    Ver detalhes
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            
            <div id="job-card-3" className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-[#D7C9AA] rounded-lg flex items-center justify-center mr-4">
                    <svg className="text-[#7B2D26] w-6 h-6" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="building" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="currentColor" d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Estágio em Administração</h3>
                    <p className="text-gray-600">Grupo Empresarial Nexus</p>
                  </div>
                  <button className="ml-auto text-gray-400 hover:text-[#7B2D26] transition-colors duration-300">
                    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="far" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="currentColor" d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">Híbrido</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">25h/semana</span>
                  <span className="bg-[#D7C9AA] text-[#7B2D26] text-sm px-3 py-1 rounded-full font-medium">R$1.350</span>
                </div>
                <p className="text-gray-600 mb-4">Vaga para estudantes de Administração, Economia ou Ciências Contábeis. Atividades relacionadas à gestão administrativa e financeira.</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Publicado há 1 dia</span>
                  <span className="text-[#7B2D26] font-medium hover:underline cursor-pointer group flex items-center">
                    Ver detalhes
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}