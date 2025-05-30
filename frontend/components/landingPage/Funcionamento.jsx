import Link from 'next/link'

export default function Funcionamento() {
    return (
        <section id="como-funciona" className="py-20 bg-[#F0F3F5]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Como Funciona</h2>
                    <div className="w-20 h-1 bg-[#7B2D26] mx-auto"></div>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Conectamos estudantes talentosos às melhores oportunidades de estágio. Veja como é fácil começar sua jornada profissional.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 p-8">
                        <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Crie seu Perfil</h3>
                        <p className="text-gray-600 mb-6">
                            Cadastre-se como estudante e preencha seu perfil com suas habilidades, experiências e objetivos profissionais.
                        </p>
                        <Link 
                            href="/cadAlunos"
                            className="inline-flex items-center text-[#7B2D26] font-medium hover:text-[#7B2D26]/80 transition-colors duration-300 group"
                        >
                            Criar perfil
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 p-8">
                        <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Busque Vagas</h3>
                        <p className="text-gray-600 mb-6">
                            Explore oportunidades de estágio em diversas áreas e empresas. Filtre por localização, área de atuação e mais.
                        </p>
                        <Link 
                            href="/login"
                            className="inline-flex items-center text-[#7B2D26] font-medium hover:text-[#7B2D26]/80 transition-colors duration-300 group"
                        >
                            Buscar vagas
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 p-8">
                        <div className="w-16 h-16 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Candidate-se</h3>
                        <p className="text-gray-600 mb-6">
                            Envie sua candidatura para as vagas que mais combinam com seu perfil e acompanhe o status das suas aplicações.
                        </p>
                        <Link 
                            href="/cadAlunos"
                            className="inline-flex items-center text-[#7B2D26] font-medium hover:text-[#7B2D26]/80 transition-colors duration-300 group"
                        >
                            Começar agora
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}