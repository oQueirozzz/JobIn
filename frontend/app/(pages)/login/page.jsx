'use client';

import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [authType, setAuthType] = useState('user');
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();
    setCarregando(true);
    setMensagem('');

    const formData = new FormData(event.target);
    const dadosLogin = {
      email: formData.get('email'),
      senha: formData.get('senha')
    };

    try {
      await login(dadosLogin.email, dadosLogin.senha, authType);
      setTipoMensagem('sucesso');
      setMensagem(`Login de ${authType === 'user' ? 'usuário' : 'empresa'} realizado com sucesso!`);
      router.push('/');
    } catch (error) {
      setTipoMensagem('erro');
      setMensagem(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
      <div className="w-[500px] bg-white rounded-lg shadow-xl p-10">

        {/* Botões para selecionar tipo de login */}
        <div className="flex justify-center mb-6 space-x-4">
            <button
                type="button"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    authType === 'user' 
                        ? 'bg-[#7B2D26] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setAuthType('user')}
                disabled={carregando}
            >
                Sou Candidato
            </button>
            <button
                type="button"
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    authType === 'company' 
                        ? 'bg-[#7B2D26] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setAuthType('company')}
                 disabled={carregando}
            >
                Sou Empresa
            </button>
        </div>

        <form className="w-full" id="loginForm" onSubmit={handleLogin}>
          <div className="w-full">
            {mensagem && (
              <div className={`mb-6 p-4 rounded-lg border ${
                tipoMensagem === 'sucesso' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {tipoMensagem === 'sucesso' ? (
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                  <p className="text-sm font-medium">{mensagem}</p>
                </div>
              </div>
            )}

            <div className="relative z-0 w-full mb-5 group">
              <input 
                type="email" 
                name="email" 
                id="email" 
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                  tipoMensagem === 'erro' ? 'border-red-300' : 'border-gray-300'
                } appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer`}
                placeholder=" " 
                required 
                disabled={carregando}
              />
              <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Email
              </label>
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input 
                type="password" 
                name="senha" 
                id="senha" 
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                  tipoMensagem === 'erro' ? 'border-red-300' : 'border-gray-300'
                } appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer`}
                placeholder=" " 
                required 
                disabled={carregando}
              />
              <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Senha
              </label>
            </div>

            <button 
              type="submit" 
              className={`w-full px-5 py-3 text-sm font-medium text-white rounded-3xl shadow-md transition-all duration-300 flex justify-center items-center ${
                carregando 
                  ? 'bg-vinho/80 cursor-not-allowed' 
                  : 'bg-vinho hover:bg-vinho/90 active:bg-vinho/95'
              }`}
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
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  {`Login como ${authType === 'user' ? 'Candidato' : 'Empresa'}`}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-xs text-gray-500 text-center">Não possui conta?</p>

          <div className="flex justify-center space-x-4">
            <a 
              href="/cadAlunos" 
              className="text-sm text-vinho hover:text-vinho/80 transition-colors duration-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Cadastrar como Candidato
            </a>
            <a 
              href="/cadEmpresas" 
              className="text-sm text-vinho hover:text-vinho/80 transition-colors duration-300 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Cadastrar como Empresa
            </a>
          </div>
          
          <p className="text-center">
            <a 
              href="/novaSenha" 
              className="text-xs text-vinho hover:text-vinho/80 transition-colors duration-300 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              Esqueci a senha
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}