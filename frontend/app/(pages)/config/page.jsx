'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';

export default function Config() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { logout, authInfo } = useAuth();

    async function excluirConta() {
        setMensagem('');
        setTipoMensagem('');

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            setTipoMensagem('erro');
            setMensagem('Erro: Token de autenticação ausente. Faça login novamente.');
            setTimeout(() => { logout(); }, 1500);
            return;
        }

        try {
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            if (!authEntity || !authEntity.id) {
                throw new Error('Usuário não autenticado ou ID ausente.');
            }

            let endpoint;
            if (authEntity.tipo === 'empresa') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${authEntity.id}`;
            } else {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authEntity.id}`;
            }

            let response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                if (response.status === 401 && authEntity.tipo === 'empresa') {
                    console.warn('Falha ao excluir como empresa (401), tentando como usuário...');
                    const fallbackEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authEntity.id}`;
                    response = await fetch(fallbackEndpoint, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                    });

                    if (!response.ok) {
                        const fallbackError = await response.json();
                        throw new Error(fallbackError.message || 'Erro ao excluir a conta (fallback).');
                    }
                } else {
                    throw new Error(errorData.message || 'Erro ao excluir a conta.');
                }
            }

            localStorage.removeItem('authEntity');
            setMensagem('Conta excluída com sucesso!');
            setTipoMensagem('sucesso');
        } catch (error) {
            setMensagem(error.message || 'Erro ao excluir a conta.');
            setTipoMensagem('erro');
        } finally {
            setShowConfirmModal(false);
            setTimeout(() => {
                logout();
            }, 1500);
        }
    }

    const handleExcluirContaClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmExclusao = () => {
        excluirConta();
    };

    const handleCancelExclusao = () => {
        setMensagem('Exclusão da conta cancelada.');
        setTipoMensagem('info');
        setShowConfirmModal(false);
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex justify-center items-center px-4 py-10 md:p-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl h-full flex flex-col transform transition-all duration-300">

                {/*Header */}
                <div className="h-auto md:h-2/12 rounded-t-3xl border-b border-b-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#7B2D26]/5 to-[#9B3D26]/5">
                    <h1 className="text-3xl font-extrabold text-[#7B2D26] flex items-center">
                        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.331.83 2.802 2.604a1.724 1.724 0 000 2.575c.942 1.543-.83 3.331-2.604 2.802a1.724 1.724 0 00-1.066 2.573c.942 1.543-.83 3.331-2.604 2.802a1.724 1.724 0 00-2.575 0c-1.543.942-3.331-.83-2.802-2.604a1.724 1.724 0 000-2.575c-.942-1.543.83-3.331 2.604-2.802a1.724 1.724 0 001.066-2.573z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Configurações
                    </h1>
                    <svg width="120" height="50" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block opacity-70">
                        <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="#7B2D26" />
                        <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="#7B2D26" />
                        <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="#7B2D26" />
                        <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="#7B2D26" />
                        <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="#7B2D26" />
                        <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="#7B2D26" />
                    </svg>
                </div>

                <div className="p-8 space-y-8 flex-1">
                    {/* Seção de Segurança */}
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl shadow-inner">
                        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.003 12.003 0 002.944 12c.003 2.112.668 4.112 1.83 5.811A12.003 12.003 0 0012 21.056a12.003 12.003 0 007.226-3.245c1.162-1.699 1.827-3.699 1.83-5.811a12.003 12.003 0 00-3.04-8.618z"></path>
                            </svg>
                            Segurança da Conta
                        </h2>
                        
                        <Link
                            href="/redefSenha?authenticated=true"
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 transform hover:scale-[1.01] group"
                        >
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-4 text-[#7B2D26] group-hover:text-[#9B3D26] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 10v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3"></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">Redefinir Senha</h3>
                                    <p className="text-sm text-gray-500 mt-1">Altere sua senha de acesso periodicamente para manter sua conta segura.</p>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>

                    {/* Seção de Preferências */}
                    <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.331.83 2.802 2.604a1.724 1.724 0 000 2.575c.942 1.543-.83 3.331-2.604 2.802a1.724 1.724 0 00-1.066 2.573c.942 1.543-.83 3.331-2.604 2.802a1.724 1.724 0 00-2.575 0c-1.543.942-3.331-.83-2.802-2.604a1.724 1.724 0 000-2.575c-.942-1.543.83-3.331 2.604-2.802a1.724 1.724 0 001.066-2.573z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            Preferências
                        </h2>

                        <div className="space-y-4">
                            {/* Notificações */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-4 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Notificações</h3>
                                        <p className="text-sm text-gray-500 mt-1">Receba alertas sobre novas vagas, mensagens e atualizações importantes.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="group peer bg-gray-200 rounded-full duration-300 w-14 h-7 outline-none
                                        after:duration-300 after:bg-white after:rounded-full after:absolute after:h-5 after:w-5 after:top-1 after:left-1
                                        peer-checked:after:translate-x-7 peer-checked:bg-[#7B2D26] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#7B2D26]/50">
                                    </div>
                                </label>
                            </div>

                            {/* Modo Escuro */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-4 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">Modo Escuro</h3>
                                        <p className="text-sm text-gray-500 mt-1">Alterne entre o tema claro e escuro para uma melhor experiência visual.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="group peer bg-gray-200 rounded-full duration-300 w-14 h-7 outline-none
                                        after:duration-300 after:bg-white after:rounded-full after:absolute after:h-5 after:w-5 after:top-1 after:left-1
                                        peer-checked:after:translate-x-7 peer-checked:bg-[#7B2D26] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#7B2D26]/50">
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Gerenciamento da Conta */}
                    <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Gerenciamento da Conta
                        </h2>
                        
                        {/* Excluir Conta */}
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 transform hover:scale-[1.01]">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">Excluir Conta</h3>
                                    <p className="text-sm text-gray-500 mt-1">Apague permanentemente sua conta e todos os seus dados.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleExcluirContaClick}
                                className="px-5 py-2 cursor-pointer bg-red-600 text-white rounded-lg font-medium shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center border border-gray-200 animate-scale-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">Tem certeza que deseja excluir sua conta? Esta ação é irreversível e removerá todos os seus dados.</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleCancelExclusao}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmExclusao}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
