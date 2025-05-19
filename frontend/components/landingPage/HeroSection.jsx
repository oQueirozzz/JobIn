export default function HeroSection() {
    return(
        <div>
        <section id="hero" className="pt-28 pb-16 bg-gradient-to-b from-[#F8F1E9] to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Comece sua carreira <span className="text-[#8C1C13]">aqui e agora</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Conectamos estudantes talentosos às melhores oportunidades de estágio. Dê o primeiro passo na sua carreira profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <span className="bg-[#8C1C13] text-white px-6 py-3 rounded-full font-medium hover:bg-[#6b150e] transition-colors text-center cursor-pointer">
                  Buscar Vagas
                </span>
                <span className="border border-[#8C1C13] text-[#8C1C13] px-6 py-3 rounded-full font-medium hover:bg-[#F8F1E9] transition-colors text-center cursor-pointer">
                  Para Empresas
                </span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              { <img className="w-full max-w-md rounded-lg shadow-lg" src="./landing/banner.png" alt="professional students in business casual clothes looking at laptop in modern office, illustration in flat style, white, beige and burgundy color palette" />}
            </div>
          </div>
        </div>
      </section>

      <section id="search" className="py-10 bg-white">
  <div className="container mx-auto px-4">
    <div className="bg-white rounded-xl shadow-md p-6 -mt-16 relative z-10 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <i className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="svg-inline--fa fa-magnifying-glass" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
              </svg>
            </i>
            <input
              type="text"
              placeholder="Cargo ou palavra-chave"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1C13]"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <i className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
              </svg>
            </i>
            <input
              type="text"
              placeholder="Localização"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1C13]"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <i className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="svg-inline--fa fa-graduation-cap" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="graduation-cap" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path fill="currentColor" d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"></path>
              </svg>
            </i>
            <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8C1C13] appearance-none bg-white">
              <option value="">Área de Estudo</option>
              <option value="administracao">Administração</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="engenharia">Engenharia</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
            <i className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="svg-inline--fa fa-chevron-down" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </i>
          </div>
        </div>
        <button className="bg-[#8C1C13] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6b150e] transition-colors">
          Pesquisar
        </button>
      </div>
    </div>
    </div>
    </section>
  </div>
  );
}

