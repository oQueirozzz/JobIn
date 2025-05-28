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
      // Chama o método login do seu hook useAuth
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

      // Redireciona após breve delay para o usuário ver a mensagem
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

        {mensagem && (
          <div className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {mensagem}
          </div>
        )}

        <form className="w-full" id="loginForm" onSubmit={handleLogin}>
          <div className="relative z-0 w-full mb-5 group">
            <input 
              type="email" 
              name="email" 
              id="email" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
              placeholder=" " 
              required 
              disabled={carregando}
            />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input 
              type="password" 
              name="senha" 
              id="senha" 
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
              placeholder=" " 
              required 
              disabled={carregando}
            />
            <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
          </div>

          <button 
            type="submit" 
            className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" 
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
            ) : `Login como ${authType === 'user' ? 'Candidato' : 'Empresa'}`}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-xs text-gray-500 text-center">Não possui conta?</p>

        <p className="text-sm text-center text-gray-700 mt-2">Cadastrar-se como{' '}
          <a href="/cadAlunos" className="text-vinho hover:underline">Candidato</a>{' '}
          ou{' '}
          <a href="/cadEmpresas" className="text-vinho hover:underline">Empresa</a>
        </p>
        
        <p className="text-center mt-4">
          <a href="/novaSenha" className="text-xs text-vinho hover:underline">Esqueci a senha</a>
        </p>

      </div>
      </div>
    </section>
  );
}
