'use client';

import { useState } from 'react';

export default function Login() {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

  async function login(event) {
    event.preventDefault();
    setCarregando(true);
    setMensagem('');

    const formData = new FormData(event.target);
    const dadosLogin = {
      email: formData.get('email'),
      senha: formData.get('senha')
    };

    try {
      console.log('Enviando dados de login:', dadosLogin);
      
      const response = await fetch('http://localhost:3001/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin),
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers));
      
      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (response.ok) {
        setTipoMensagem('sucesso');
        setMensagem('Login realizado com sucesso!');
        
        // Armazenar token e informações do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Redirecionar após um breve delay para mostrar a mensagem de sucesso
        setTimeout(() => {
          window.location.href = '/feed';
        }, 1500);
      } else {
        setTipoMensagem('erro');
        console.error('Erro no login:', data);
        setMensagem(data.mensagem || 'Usuário não encontrado ou senha incorreta');
      }
    } catch (error) {
      setTipoMensagem('erro');
      console.error('Exceção durante o login:', error);
      setMensagem('Erro ao conectar com o servidor.');
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

        <form className="w-full" id="loginForm" onSubmit={login}>

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
            ) : 'Login'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">Não possui conta?</p>

        <p className="text-sm text-center text-gray-700 mt-2">Cadastrar-se como{' '}
          <a href="/cadAlunos" className="text-vinho hover:underline">Candidato</a>{' '}ou{' '}
          <a href="/cadEmpresas" className="text-vinho hover:underline">Empresa</a>
          <a href="/novaSenha" className="block text-xs text-gray-500 mt-4 hover:underline">Esqueci a senha</a>
        </p>

        

      </div>
    </section>
  );
}