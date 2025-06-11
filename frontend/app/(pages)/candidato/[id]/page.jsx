'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';

export default function PerfilCandidatoView({ params }) {
    const router = useRouter();
    const { authInfo, isLoading } = useAuth();
    const [candidato, setCandidato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const notificationSentRef = useRef(false); // Ref para controlar se a notificação foi enviada no ciclo de renderização atual
    
    // Unwrap params using React.use()
    const { id } = use(params);

    useEffect(() => {
        const fetchCandidatoData = async () => {
            try {
                // TEMPORARIO PARA DEBUG: Limpar sessionStorage para garantir teste limpo
                if (authInfo?.entity?.tipo === 'empresa' && authInfo.entity.id) {
                    const sessionNotificationKey = `notified_profile_visit_${id}_${authInfo.entity.id}`;
                    sessionStorage.removeItem(sessionNotificationKey);
                    console.log(`[DEBUG_TEMP] sessionStorage limpo para a chave: ${sessionNotificationKey}`);
                }

                console.log('[DEBUG] Iniciando busca do candidato:', { id, authInfo });

                // Verificar se é uma empresa
                if (!isLoading && (!authInfo || !authInfo.entity || authInfo.entity.tipo !== 'empresa')) {
                    console.log('[DEBUG] Usuário não é uma empresa ou authInfo não disponível. Redirecionando para login:', authInfo);
                    router.push('/login');
                    return;
                }

                const token = authInfo?.token;
                if (!token) {
                    console.log('[DEBUG] Token de autenticação não encontrado. Redirecionando para login.');
                    router.push('/login'); // Redirecionar para login se não houver token
                    return;
                }

                console.log('[DEBUG] Fazendo requisição para:', `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${id}`, 'com token:', !!token);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('[DEBUG] Resposta recebida:', { status: response.status, ok: response.ok });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('[DEBUG] Erro na resposta:', errorData);
                    
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
                console.log('[DEBUG] Dados do candidato recebidos (RAW):', data);

                // Lógica de notificação de perfil visitado com sessionStorage e useRef
                if (authInfo?.entity?.tipo === 'empresa' && authInfo.entity.id) {
                    const sessionNotificationKey = `notified_profile_visit_${id}_${authInfo.entity.id}`;
                    const hasNotifiedInSession = sessionStorage.getItem(sessionNotificationKey) === 'true';

                    console.log(`[DEBUG] NOTIFICACAO CHECK (antes do envio) - notificationSentRef.current: ${notificationSentRef.current}, hasNotifiedInSession: ${hasNotifiedInSession}`);

                    if (!notificationSentRef.current && !hasNotifiedInSession) {
                        console.log(`[DEBUG] NOTIFICACAO: id do candidato: ${id}, id da empresa: ${authInfo.entity.id}, token presente: ${!!token} - ENVIANDO NOTIFICAÇÃO`);
                        try {
                            const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes/perfil-visitado`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    usuarioId: id,
                                    empresaId: authInfo.entity.id
                                })
                            });

                            if (notificationResponse.ok) {
                                console.log('[DEBUG] Notificação enviada com sucesso. Status:', notificationResponse.status);
                                notificationSentRef.current = true; // Define o ref como true para o ciclo de vida do componente atual
                                sessionStorage.setItem(sessionNotificationKey, 'true'); // Persiste no session storage
                                console.log(`[DEBUG] Notificação enviada e flags atualizadas. notificationSentRef: ${notificationSentRef.current}, sessionStorage: ${sessionStorage.getItem(sessionNotificationKey)}`);
                            } else {
                                const errorText = await notificationResponse.text();
                                console.error('[DEBUG] Erro ao enviar notificação. Status:', notificationResponse.status, 'Erro:', errorText);
                            }
                        } catch (error) {
                            console.error('[DEBUG] Erro ao criar notificação:', error);
                        }
                    } else {
                        console.log(`[DEBUG] NOTIFICACAO: Condição de envio não atendida. notificationSentRef.current: ${notificationSentRef.current}, hasNotifiedInSession: ${hasNotifiedInSession}`);
                    }
                } else {
                    console.log('[DEBUG] Condições para notificação NÃO atendidas. Tipo:', authInfo?.entity?.tipo, 'ID:', authInfo?.entity?.id);
                }

                console.log('[DEBUG] Tipo de data.certificados (RAW):', typeof data.certificados, data.certificados);

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
                        console.warn('[DEBUG] Could not parse certificados as JSON. Treating as plain text or single item.', parseError);
                        // If parsing fails, treat as a single string item in an array
                        parsedCertificados = [data.certificados];
                    }
                }
                // Ensure it's always an array, even if empty or null originally
                if (!Array.isArray(parsedCertificados)) {
                    parsedCertificados = [];
                }
                console.log('[DEBUG] Parsed certificados (after frontend parsing):', parsedCertificados);
                console.log('[DEBUG] Tipo de parsedCertificados (after frontend parsing):', typeof parsedCertificados, Array.isArray(parsedCertificados));

                setCandidato({
                    ...data,
                    certificados: parsedCertificados
                });
            } catch (err) {
                console.error('[DEBUG] Erro detalhado:', err);
                setError(err.message || 'Erro ao carregar dados do candidato');
            } finally {
                setLoading(false);
            }
        };

        if (!isLoading && authInfo && authInfo.entity && authInfo.entity.tipo === 'empresa') {
            console.log('[DEBUG] Condições para buscar dados atendidas. Chamando fetchCandidatoData...');
            fetchCandidatoData();
        } else {
            console.log('[DEBUG] Condições para buscar dados NÃO atendidas:', { isLoading, authInfo });
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
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-100 flex items-center justify-center text-5xl font-bold text-[#7B2D26] border-4 border-[#7B2D26] object-cover shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
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
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Função auxiliar para formatar CPF
function formatarCPF(cpf) {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length <= 11) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf; // Retorna o original se não for um CPF válido
}

// Função auxiliar para formatar data
function formatarData(data) {
    if (!data) return 'Não informada';
    try {
        return new Date(data).toLocaleDateString('pt-BR');
    } catch (e) {
        console.error('Erro ao formatar data:', e);
        return 'Data inválida';
    }
} 