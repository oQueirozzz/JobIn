'use client';

import { useState } from 'react';

export default function CriarVaga() {
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

    async function cadVagas(event) {
        event.preventDefault();
        setCarregando(true);
        setMensagem('');

        const formData = new FormData(event.target);

        try {
            const dadosVagas = {
                nome: formData.get('nome'),
                nome_empresa: formData.get('nome_empresa'),
                descricao: formData.get('descricao'),
                tipo_vaga: formData.get('tipo_vaga'),
                local_vaga: formData.get('local_vaga'),
                categoria: formData.get('categoria')
            };

            console.log('Enviando dados de Nova Vaga:', dadosVagas);

            const response = await fetch('http://localhost:3001/api/vagas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosVagas),
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', Object.fromEntries(response.headers));

            const data = await response.json();
            console.log('Dados da resposta:', data);

            if (response.ok) {
                setTipoMensagem('sucesso');
                setMensagem('Vaga Cadastrada com sucesso');


                console.log('Dados do usuário para armazenar:', data);
                localStorage.setItem('vagas', JSON.stringify(data));


            } else {
                setTipoMensagem('erro');
                console.error('Erro na criação de vagas:', data);
                // Exibir mensagem de erro mais detalhada
                if (data.error && typeof data.error === 'object') {
                    const errorMessages = Object.values(data.error).join(', ');
                    setMensagem(errorMessages || data.message || data.mensagem || 'Erro ao Criar vaga. Tente novamente.');
                } else {
                    setMensagem(data.message || data.mensagem || data.error || 'Erro ao Criar vaga. Tente novamente.');
                }
            }
        } catch (error) {
            setTipoMensagem('erro');
            console.error('Exceção durante a criação de vagas:', error);
            if (error.message) {
                setMensagem(`Erro ao conectar com o servidor: ${error.message}`);
            } else {
                setMensagem('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className='w-full min-h-screen flex items-center justify-center px-4 bg-branco'>
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 sm:p-10 my-20 sm:my-20">
                <div className="flex justify-center mb-6">
                    <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
                </div>

                {mensagem && (
                    <div className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mensagem}
                    </div>
                )}

                <form className="w-full" id="novaVaga" onSubmit={cadVagas} >
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="nome" id="nome" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome da vaga</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="nome_empresa" id="empresa" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome da empresa</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="tipo_vaga" id="tipo" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tipo da vaga ex: presencial</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="local_vaga" id="local" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Localização</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="categoria" id="categoria" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Categoria</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <textarea name="descricao" id="descricao" maxLength="200" rows="3" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent resize-none border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required></textarea>
                        <label htmlFor="descricao" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Descrição da vaga</label>
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer text-white bg-[#7B2D26] hover:bg-red-800 font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center"
                        disabled={carregando}
                    >
                        {carregando ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                            </>
                        ) : 'Criar Vaga'}
                    </button>
                    <div className="flex items-center justify-center">
                        <a href='/perfil' className="text-xs hover:text-[#7B2D26] text-gray-500 text-center mt-4 cursor-pointer ">Voltar</a>
                    </div>
                </form>
            </div>
        </section>

    );
}

