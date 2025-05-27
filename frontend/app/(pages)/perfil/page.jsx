'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function Perfil() {
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [camposFaltantes, setCamposFaltantes] = useState([]);
    const router = useRouter();
    const { authInfo, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !authInfo) {
            router.push('/login');
            return;
        }

        if (authInfo) {
            const dadosUsuario = authInfo.entity;
            
            // Verificar campos obrigatórios
            const camposObrigatorios = {
                nome: 'Nome',
                email: 'Email',
                telefone: 'Telefone',
                formacao: 'Formação Acadêmica',
                area_interesse: 'Área de Interesse',
                habilidades: 'Habilidades',
                descricao: 'Resumo Profissional'
            };

            const camposIncompletos = Object.entries(camposObrigatorios)
                .filter(([campo]) => !dadosUsuario[campo])
                .map(([_, label]) => label);

            setCamposFaltantes(camposIncompletos);
            setPerfilCompleto(camposIncompletos.length === 0);
        }
    }, [authInfo, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B2D26] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!authInfo) {
        return null;
    }

    const usuario = authInfo.entity;

    return (
        <section className="min-h-screen flex flex-col items-center bg-[#F0F3F5] px-4 py-10 space-y-6">
            {/* Status do Perfil */}
            {!perfilCompleto && (
                <div className="w-full max-w-5xl bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-amber-800">Perfil Incompleto</h3>
                        <span className="text-amber-600 font-medium">
                            {Math.round(((7 - camposFaltantes.length) / 7) * 100)}% completo
                        </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                        <div 
                            className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${((7 - camposFaltantes.length) / 7) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-amber-700 mt-2">
                        Campos faltantes: {camposFaltantes.join(', ')}
                    </p>
                </div>
            )}

            {/* Informações Básicas */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex justify-center items-center">
                    <img 
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-red-900" 
                        src={usuario.foto_perfil || "/img/perfil/profile.svg"} 
                        alt="Foto de Perfil" 
                    />
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{usuario.nome || 'Nome não informado'}</h1>
                        <h2 className="flex items-center text-gray-700 text-sm mt-2">
                            <img className="h-5 pr-2" src="/img/perfil/email.svg" alt="Email" />
                            {usuario.email || 'Email não informado'}
                        </h2>
                        <h2 className="flex items-center text-gray-700 text-sm mt-2">
                            <img className="h-5 pr-2" src="/img/perfil/phone.svg" alt="phone" />
                            {usuario.telefone || 'Telefone não informado'}
                        </h2>
                    </div>
                    <div className="mt-4 md:mt-0 md:self-end">
                        <button className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-5 py-2 rounded-3xl shadow transition-colors duration-300 flex items-center">
                            <img className="h-5 pr-2" src="/img/perfil/pencil.svg" alt="pencil" />
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumo Profissional */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Resumo Profissional</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <p className="text-gray-700 text-sm">
                    {usuario.descricao || 'Nenhum resumo profissional informado.'}
                </p>
            </div>

            {/* Formação Acadêmica */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Formação Acadêmica</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <p className="text-gray-700 text-sm">
                    {usuario.formacao || 'Nenhuma formação acadêmica informada.'}
                </p>
            </div>

            {/* Habilidades */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Habilidades</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {usuario.habilidades ? (
                        usuario.habilidades.split(',').map((habilidade, index) => (
                            <span 
                                key={index}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                                {habilidade.trim()}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-700 text-sm">Nenhuma habilidade informada.</p>
                    )}
                </div>
            </div>

            {/* Currículo */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6 flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-base font-semibold mb-4 md:mb-0">Currículo</h2>
                <div className="flex gap-4">
                    {usuario.curriculo ? (
                        <>
                            <button className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow text-sm">
                                Visualizar PDF
                            </button>
                            <button className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-4 py-2 rounded shadow text-sm">
                                Atualizar Currículo
                            </button>
                        </>
                    ) : (
                        <button className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-4 py-2 rounded shadow text-sm">
                            Enviar Currículo
                        </button>
                    )}
                </div>
            </div>

            {/* Candidaturas */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6 mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Candidaturas</h2>
                </div>
                <div className="space-y-4">
                    {usuario.candidaturas && usuario.candidaturas.length > 0 ? (
                        usuario.candidaturas.map((candidatura, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <h3 className="font-medium">{candidatura.vaga}</h3>
                                <p className="text-sm text-gray-600">{candidatura.empresa}</p>
                                <p className="text-sm text-gray-500">{candidatura.status}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 text-sm">Nenhuma candidatura encontrada.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
