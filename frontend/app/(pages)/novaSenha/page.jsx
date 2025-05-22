'use client';

import { useState } from 'react';

export default function NovaSenha() {
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState('');

    async function redefinirSenha(event) {
        event.preventDefault();

        if (!email || !novaSenha) {
            setTipoMensagem('erro');
            setMensagem('Preencha todos os campos');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            const response = await fetch('http://localhost:3001/api/usuarios/redefinirSenha', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    novaSenha: novaSenha
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao atualizar senha');
            }

            setTipoMensagem('sucesso');
            setMensagem(data.message);
            setEmail('');
            setNovaSenha('');

        } catch (error) {
            setTipoMensagem('erro');
            setMensagem(error.message);
            console.error('Redefinição falhou:', error);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
            <div className="w-[500px] bg-white rounded-lg shadow-xl p-10">

                <div className="flex justify-center mb-6">
                    <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
                </div>

                {mensagem && (
                    <div className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mensagem}
                    </div>
                )}

                <form className="w-full" onSubmit={redefinirSenha}>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required disabled={carregando} />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="password" name="novaSenha" id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required disabled={carregando} />
                        <label htmlFor="novaSenha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nova Senha</label>
                        <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres recomendado</p>
                    </div>

                    <button type="submit" className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" disabled={carregando}>
                        {carregando ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processando...
                            </>
                        ) : 'Redefinir Senha'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-700 mt-6">
                    <a href="/login" className="text-vinho hover:underline">Voltar para o login</a>
                </p>

            </div>
        </section>
    );
}
