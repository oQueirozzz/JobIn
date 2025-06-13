'use client';

import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Alert from '../../../components/Alert';

export default function Login() {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [authType, setAuthType] = useState('user');
  const { login } = useAuth();
  const router = useRouter();

  const handleCloseAlert = () => {
    setMensagem('');
    setTipoMensagem('');
  };

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

      if (authType === 'company' && userData.cnpj) {
        localStorage.setItem('authEntity', JSON.stringify({
          ...userData,
          tipo: 'empresa'
        }));
      } else if (authType === 'user' && userData.cpf) {
        localStorage.setItem('authEntity', JSON.stringify({
          ...userData,
          tipo: 'usuario'
        }));
      }

      setTipoMensagem('success');
      setMensagem(`Login de ${authType === 'user' ? 'usuário' : 'empresa'} realizado com sucesso!`);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setTipoMensagem('error');
      setMensagem(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Alert
        message={mensagem}
        type={tipoMensagem}
        onClose={handleCloseAlert}
        duration={5000}
        className="z-50"
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <svg width="full" height="55" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="#7B2D26" />
            <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="#7B2D26" />
            <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="#7B2D26" />
            <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="#7B2D26" />
            <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="#7B2D26" />
            <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="#7B2D26" />
          </svg>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Acesse sua conta</h2>

          {/* Botões de Tipo de Login */}
          <div className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setAuthType('user')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${authType === 'user'
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
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${authType === 'company'
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
