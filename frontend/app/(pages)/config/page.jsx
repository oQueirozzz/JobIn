'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';

export default function Config() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const { logout, authInfo } = useAuth();
    async function excluirConta() {
        setMensagem('');
        setTipoMensagem('');

        try {
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            if (!authEntity || !authEntity.id) {
                throw new Error('Usuário não autenticado.');
            }

            // Tenta excluir como empresa 
            let endpoint;
            if (authEntity.tipo === 'empresa') {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${authEntity.id}`;
            } else{
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authEntity.id}`;
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok && authEntity.tipo === 'empresa') {
            
                const fallbackEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authEntity.id}`;
                const fallbackResponse = await fetch(fallbackEndpoint, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!fallbackResponse.ok) {
                    const fallbackError = await fallbackResponse.json();
                    throw new Error(fallbackError.message || 'Erro ao excluir como usuário.');
                }
            } else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir a conta.');
            }

          
            localStorage.removeItem('authEntity');
            setMensagem('Conta excluída com sucesso!');
            setTipoMensagem('sucesso');
        } catch (error) {
            setMensagem(error.message || 'Erro ao excluir a conta.');
            setTipoMensagem('erro');
        } finally {
            setTimeout(() => {
                logout();
            }, 500);
        }
    }


    return (
        <section className="min-h-screen bg-gray-50 flex  justify-center px-4 py-10 md:p-20">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-5xl h-full flex flex-col">

                {/*Header */}
                <div className="h-auto md:h-2/12 rounded-tr-xl rounded-tl-xl border-b border-b-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 p-5">
                    <h1 className="text-xl font-bold">Configurações</h1>
                    <svg width="100" height="40" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block">
                        <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="#7B2D26" />
                        <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="#7B2D26" />
                        <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="#7B2D26" />
                        <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="#7B2D26" />
                        <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="#7B2D26" />
                        <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="#7B2D26" />
                    </svg>
                </div>

                {/* Redefinir Senha */}
                <Link href="/redefSenha" className="w-full h-auto md:h-3/12 border-b border-b-gray-100 p-5 flex items-center hover:bg-gray-50">
                    <h1 className="font-bold">Redefinir Senha</h1>
                </Link>

                {/* Notificações */}
                <div className="w-full h-auto md:h-3/12 border-b border-b-gray-100 p-5 flex items-center justify-between">
                    <h1 className="font-bold">Notificações</h1>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="group peer bg-white rounded-full duration-300 w-14 h-6 ring-2 ring-[#7B2D26]
                            after:duration-300 after:bg-[#7B2D26] peer-checked:after:bg-green-500 peer-checked:ring-green-500
                            after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1
                            after:flex after:justify-center after:items-center peer-checked:after:translate-x-8
                            peer-hover:after:scale-95">
                        </div>
                    </label>
                </div>

                {/*Possivemente excluir dark mode/ audio 

                
                <div className="w-full h-auto md:h-3/12 border-b border-b-gray-100 p-5 flex items-center justify-between">
                    <h1 className="font-bold">Modo Escuro</h1>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="group peer bg-white rounded-full duration-300 w-14 h-6 ring-2 ring-[#7B2D26]
                            after:duration-300 after:bg-[#7B2D26] peer-checked:after:bg-green-500 peer-checked:ring-green-500
                            after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1
                            after:flex after:justify-center after:items-center peer-checked:after:translate-x-8
                            peer-hover:after:scale-95">
                        </div>
                    </label>
                </div>

                
                <div className="w-full h-auto md:h-3/12 border-b border-b-gray-100 p-5 flex items-center justify-between">
                    <h1 className="font-bold">Áudio</h1>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="group peer bg-white rounded-full duration-300 w-14 h-6 ring-2 ring-[#7B2D26]
                            after:duration-300 after:bg-[#7B2D26] peer-checked:after:bg-green-500 peer-checked:ring-green-500
                            after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1
                            after:flex after:justify-center after:items-center peer-checked:after:translate-x-8
                            peer-hover:after:scale-95">
                        </div>
                    </label>
                </div>
                */}

                {/* Excluir Conta */}
                <div className="w-full h-auto md:h-3/12 border-b border-b-gray-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h1 className="font-bold">Excluir Conta</h1>
                    <button
                        type="button"
                        onClick={excluirConta}
                        className="w-full sm:w-auto px-6 py-3 bg-[#7B2D26] text-white rounded-xl font-normal shadow-lg shadow-[#7B2D26]/20 hover:bg-[#9B3D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B2D26] transition-all duration-300 cursor-pointer"
                    >

                        Excluir
                    </button>
                </div>
            </div>
        </section>
    );
}
