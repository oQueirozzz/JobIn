'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';

export default function PerfilCandidatoView({ params }) {
    const router = useRouter();
    const { authInfo, isLoading } = useAuth();
    const [candidato, setCandidato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Unwrap params using React.use()
    const { id } = use(params);

    useEffect(() => {
        const fetchCandidato = async () => {
            try {
                console.log('Iniciando busca do candidato:', { id, authInfo });

                // Verificar se é uma empresa
                if (!isLoading && (!authInfo || !authInfo.entity || authInfo.entity.tipo !== 'empresa')) {
                    console.log('Usuário não é uma empresa ou authInfo não disponível. Redirecionando para login:', authInfo);
                    router.push('/login');
                    return;
                }

                const token = authInfo?.token;
                if (!token) {
                    console.log('Token de autenticação não encontrado. Redirecionando para login.');
                    router.push('/login'); // Redirecionar para login se não houver token
                    return;
                }

                console.log('Fazendo requisição para:', `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${id}`, 'com token:', !!token);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Resposta recebida:', { status: response.status, ok: response.ok });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('Erro na resposta:', errorData);
                    
                    if (response.status === 401) {
                        // Token inválido ou expirado
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authEntity');
                        localStorage.removeItem('authType');
                        router.push('/dashboard');
                        return;
                    }
                    
                    throw new Error(errorData?.message || `Erro ao carregar dados do candidato: ${response.status}`);
                }

                const data = await response.json();
                console.log('Dados do candidato recebidos (RAW):', data);
                console.log('Tipo de data.certificados (RAW):', typeof data.certificados, data.certificados);

                // Robustly parse certificados to ensure it's an array
                let parsedCertificados = [];
                if (data.certificados) {
                    try {
                        // Attempt to parse as JSON (handles single stringified JSON)
                        let tempCertificados = JSON.parse(data.certificados);
                        // If it's an array, use it. If it's a string, attempt to parse again (handles double stringified JSON)
                        parsedCertificados = Array.isArray(tempCertificados) 
                            ? tempCertificados 
                            : JSON.parse(tempCertificados);
                    } catch (parseError) {
                        console.warn('Could not parse certificados as JSON. Treating as plain text or single item.', parseError);
                        // If parsing fails, treat as a single string item in an array
                        parsedCertificados = [data.certificados];
                    }
                }
                // Ensure it's always an array, even if empty or null originally
                if (!Array.isArray(parsedCertificados)) {
                    parsedCertificados = [];
                }
                console.log('Parsed certificados (after frontend parsing):', parsedCertificados);
                console.log('Tipo de parsedCertificados (after frontend parsing):', typeof parsedCertificados, Array.isArray(parsedCertificados));

                setCandidato({
                    ...data,
                    certificados: parsedCertificados
                });
            } catch (err) {
                console.error('Erro detalhado:', err);
                setError(err.message || 'Erro ao carregar dados do candidato');
            } finally {
                setLoading(false);
            }
        };

        if (!isLoading) {
            fetchCandidato();
        }
    }, [id, authInfo, isLoading, router]);

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B2D26] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando perfil do candidato...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
                <div className="text-center">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg max-w-md">
                        <h3 className="font-bold mb-2">Erro ao carregar perfil</h3>
                        <p>{error}</p>
                        <button 
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-[#9B3D26] transition-colors duration-300"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!candidato) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
                <div className="text-center">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg max-w-md">
                        <h3 className="font-bold mb-2">Candidato não encontrado</h3>
                        <p>Não foi possível encontrar os dados do candidato.</p>
                        <button 
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-[#9B3D26] transition-colors duration-300"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Ensure candidato and its properties are safely accessed
    const currentCandidato = candidato || {};

    return (
        <section className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-4 py-8 space-y-6">
            {/* Botão Voltar */}
            <div className="w-full max-w-5xl flex justify-start">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-[#7B2D26] hover:text-[#9B3D26] transition-colors duration-300"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar
                </button>
            </div>

            {/* Informações Básicas */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl flex flex-col md:flex-row p-6 space-y-4 md:space-y-0 md:space-x-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-center items-center">
                    <div className="relative">
                        {/* Always display initials instead of photo */}
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#7B2D26] bg-[#7B2D26] text-white flex items-center justify-center text-4xl font-bold shadow-xl">
                                {getInitials(currentCandidato.nome)}
                            </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">{currentCandidato.nome || 'Nome não informado'}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{currentCandidato.email || 'Email não informado'}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formatarCPF(currentCandidato.cpf) || 'CPF não informado'}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formatarData(currentCandidato.data_nascimento)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formação Acadêmica */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Formação Acadêmica</h2>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">{currentCandidato.formacao || 'Nenhuma formação acadêmica informada.'}</p>
                </div>
            </div>

            {/* Habilidades */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Habilidades</h2>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">{currentCandidato.habilidades || 'Nenhuma habilidade informada.'}</p>
                </div>
            </div>

            {/* Área de Interesse */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Área de Interesse</h2>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">{currentCandidato.area_interesse || 'Nenhuma área de interesse informada.'}</p>
                </div>
            </div>

            {/* Resumo Profissional */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Resumo Profissional</h2>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">{currentCandidato.descricao || 'Nenhuma descrição informada.'}</p>
                </div>
            </div>

            {/* Certificados */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Certificados</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {console.log('Certificados before rendering:', candidato?.certificados)}
                    {console.log('Type of certificados before rendering:', typeof candidato?.certificados, Array.isArray(candidato?.certificados))}
                    {candidato && candidato.certificados && Array.isArray(candidato.certificados) && candidato.certificados.length > 0 ? (
                        candidato.certificados.map((certificado, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <a href={`${process.env.NEXT_PUBLIC_API_URL}${certificado}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium">Certificado {index + 1}</span>
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700 col-span-full">Nenhum certificado informado.</p>
                    )}
                </div>
            </div>

            {/* Currículo */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Currículo</h2>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    {currentCandidato.curriculo ? (
                        <a 
                            href={`${process.env.NEXT_PUBLIC_API_URL}${currentCandidato.curriculo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-[#7B2D26] hover:text-[#9B3D26] transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Ver Currículo
                        </a>
                    ) : (
                        <p className="text-gray-700">Nenhum currículo informado.</p>
                    )}
                </div>
            </div>
        </section>
    );
}

// Função auxiliar para obter iniciais
function getInitials(name) {
    if (!name) return '';
    const parts = name.split(' ').filter(p => p.length > 0);
    let initials = '';
    if (parts.length > 0) {
        initials += parts[0][0]; // First initial of the first name
        if (parts.length > 1) {
            initials += parts[1][0]; // First initial of the first surname
        }
    }
    return initials.toUpperCase();
}

// Função auxiliar para formatar CPF
function formatarCPF(cpf) {
    if (!cpf) return 'CPF não informado';
    const cpfLimpo = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (cpfLimpo.length !== 11) return cpf; // Retorna o original se não tiver 11 dígitos
    return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

// Função auxiliar para formatar data
function formatarData(data) {
    if (!data) return 'Data não informada';
    const date = new Date(data);
    if (isNaN(date.getTime())) {
        // Tentar formatar se for um string no formato DD/MM/YYYY
        const parts = data.split('/');
        if (parts.length === 3) {
            const d = parseInt(parts[0]);
            const m = parseInt(parts[1]) - 1; // Mês é 0-indexed
            const y = parseInt(parts[2]);
            const reSlashedDate = new Date(y, m, d);
            if (!isNaN(reSlashedDate.getTime())) {
                return reSlashedDate.toLocaleDateString('pt-BR');
            }
        }
        return data; // Retorna o dado original se não for uma data válida nem um formato DD/MM/YYYY
    }
    return date.toLocaleDateString('pt-BR');
} 