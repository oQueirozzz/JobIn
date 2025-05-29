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
    setTipoMensagem('');

    const formData = new FormData(event.target);
    const dadosLogin = {
      email: formData.get('email'),
      senha: formData.get('senha'),
    };

    try {
      const userData = await login(dadosLogin.email, dadosLogin.senha, authType);

      if (!userData) {
        throw new Error('Dados de login inválidos');
      }

      if (authType === 'company' && userData.empresa_id) {
        localStorage.setItem('authEntity', JSON.stringify({
          id: userData.empresa_id,
          tipo: 'empresa'
        }));
      } else if (authType === 'user' && userData.usuario_id) {
        localStorage.setItem('authEntity', JSON.stringify({
          id: userData.usuario_id,
          tipo: 'usuario'
        }));
      }

      setTipoMensagem('sucesso');
      setMensagem(`Login de ${authType === 'user' ? 'usuário' : 'empresa'} realizado com sucesso!`);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setTipoMensagem('erro');
      setMensagem(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/img/global/logo_completa.svg" alt="JobIn Logo" className="h-16" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Acesse sua conta</h2>

          {/* Botões de Tipo de Login */}
          <div className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setAuthType('user')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                authType === 'user'
                  ? 'bg-[#7B2D26] text-white shadow-lg shadow-[#7B2D26]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={carregando}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Candidato</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAuthType('company')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                authType === 'company'
                  ? 'bg-[#7B2D26] text-white shadow-lg shadow-[#7B2D26]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={carregando}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Empresa</span>
              </div>
            </button>
          </div>

          {mensagem && (
            <div className={`mb-6 p-4 rounded-xl text-center ${
              tipoMensagem === 'sucesso' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  disabled={carregando}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="senha"
                  id="senha"
                  required
                  disabled={carregando}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="/novaSenha" className="text-sm text-[#7B2D26] hover:text-[#9B3D36] transition-colors duration-300">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 px-4 bg-[#7B2D26] text-white rounded-xl font-medium shadow-lg shadow-[#7B2D26]/20 hover:bg-[#9B3D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B2D26] transition-all duration-300 flex items-center justify-center"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Não possui uma conta?{' '}
              <a href={authType === 'user' ? "/cadAlunos" : "/cadEmpresas"} className="text-[#7B2D26] font-medium hover:text-[#9B3D36] transition-colors duration-300">
                Cadastre-se como {authType === 'user' ? 'Candidato' : 'Empresa'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
