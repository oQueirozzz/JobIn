'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Image from 'next/image';
import { Link } from 'lucide-react';

export default function PerfilEmpresa() {
    const router = useRouter();
    const { authInfo, isLoading, refreshAuthInfo } = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        descricao: '',
        cnpj: '',
        local: '',
        site: '',
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [camposFaltantes, setCamposFaltantes] = useState([]);
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [camposObrigatoriosDefinidos, setCamposObrigatoriosDefinidos] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Função utilitária para calcular a porcentagem do perfil
    const calcularPorcentagemPerfil = (dados, camposObrigatorios) => {
        const totalCampos = Object.keys(camposObrigatorios).length;
        const camposPreenchidos = Object.entries(camposObrigatorios)
            .filter(([campo]) => {
                const valor = dados[campo];
                if (Array.isArray(valor)) {
                    return valor.length > 0; // Campo de array é preenchido se não estiver vazio
                }
                return valor && (typeof valor === 'string' ? valor.trim() !== '' : true); // Outros tipos: preenchido se não nulo/vazio
            })
            .length;
        return Math.round((camposPreenchidos / totalCampos) * 100);
    };

    const [vagas, setVagas] = useState([]);



    useEffect(() => {
        async function fetchVagas() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas`);
                const data = await res.json();

                // Ordenar por data de criação, se quiser
                const ordenadas = data.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
                setVagas(ordenadas);
            } catch (err) {
                console.error('Erro ao buscar vagas:', err);
            }
        }

        fetchVagas();
    }, []);

    useEffect(() => {
        if (!isLoading && !authInfo?.entity) {
            router.push('/login');
            return;
        }

        if (authInfo?.entity) {
            const dadosEmpresa = authInfo.entity;

            // Verificar se é realmente uma empresa
            if (dadosEmpresa.tipo !== 'empresa') {
                router.push('/perfil');
                return;
            }

            const obrigatorios = {
                nome: 'Nome da Empresa',
                email: 'Email Corporativo',
                cnpj: 'CNPJ',
                local: 'Localização',
                descricao: 'Descrição da Empresa'
            };
            setCamposObrigatoriosDefinidos(obrigatorios);

            const dadosIniciais = {
                nome: dadosEmpresa.nome || '',
                email: dadosEmpresa.email || '',
                descricao: dadosEmpresa.descricao || '',
                cnpj: dadosEmpresa.cnpj ? formatarCNPJ(dadosEmpresa.cnpj) : '',
                local: dadosEmpresa.local || '',
                site: dadosEmpresa.site || '',
                linkedin: dadosEmpresa.linkedin || '',
                instagram: dadosEmpresa.instagram || '',
                facebook: dadosEmpresa.facebook || '',
                twitter: dadosEmpresa.twitter || ''
            };

            console.log('[DEPURACAO LOCALIZACAO] dadosEmpresa.local ANTES de setFormData:', dadosEmpresa.local);
            setFormData(dadosIniciais);
            console.log('[DEPURACAO LOCALIZACAO] formData.local DEPOIS de setFormData (sincrono):', dadosIniciais.local);
            verificarCamposObrigatorios(dadosIniciais, obrigatorios);

            console.log('--- Depuração da Porcentagem Perfil Empresa ---');
            console.log('Empresa (authInfo.entity):', dadosEmpresa);
            console.log('Campos Obrigatórios Definidos (perfil-empresa):', obrigatorios);

            const porcentagemCompletaPerfilEmpresa = calcularPorcentagemPerfil(dadosEmpresa, obrigatorios);
            console.log('Porcentagem Completa Calculada (perfil-empresa):', porcentagemCompletaPerfilEmpresa);
            console.log('---------------------------------------');
        }
    }, [authInfo, isLoading, router]);

    const verificarCamposObrigatorios = (dadosEmpresa, camposObrigatorios) => {
        const camposIncompletos = Object.entries(camposObrigatorios)
            .filter(([campo]) => {
                const valor = dadosEmpresa[campo];
                if (Array.isArray(valor)) {
                    return valor.length === 0; // Se for um array, é faltante se estiver vazio
                }
                return !valor || (typeof valor === 'string' && valor.trim() === ''); // Para outros tipos, a lógica existente
            })
            .map(([_, label]) => label);

        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let valorProcessado = value;

        if (name === 'cnpj') {
            valorProcessado = formatarCNPJ(value);
        }

        const newData = {
            ...formData,
            [name]: valorProcessado
        };
        setFormData(newData);
        verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);

        const authEntity = JSON.parse(localStorage.getItem('authEntity'));
        const updatedEntity = {
            ...authEntity,
            [name]: valorProcessado
        };
        localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

        if (authInfo && authInfo.entity) {
            authInfo.entity = updatedEntity;
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'cnpj') {
            const cnpjFormatado = formatarCNPJ(value);
            setFormData(prev => ({
                ...prev,
                [name]: cnpjFormatado
            }));
        }
    };

    const formatarCNPJ = (cnpj) => {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length <= 2) return cnpjLimpo;
        if (cnpjLimpo.length <= 5) return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2)}`;
        if (cnpjLimpo.length <= 8) return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5)}`;
        if (cnpjLimpo.length <= 12) return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8)}`;
        return `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8, 12)}-${cnpjLimpo.slice(12, 14)}`;
    };

    // Função para converter base64 em File (copiada de perfil/page.jsx)
    const base64ToFile = (base64String, filename) => {
        return new Promise((resolve, reject) => {
            try {
                const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    reject(new Error('Formato inválido de base64'));
                    return;
                }

                const mimeType = matches[1];
                const base64Data = matches[2];

                const byteCharacters = atob(base64Data);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);

                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, { type: mimeType });
                const file = new File([blob], filename, { type: mimeType });
                resolve(file);
            } catch (error) {
                reject(error);
            }
        });
    };

    const compressImage = (base64String, maxWidth = 800) => {
        return new Promise((resolve, reject) => {
            const img = typeof window !== 'undefined' ? new window.Image() : null;

            if (!img) {
                console.warn("Image constructor not available, skipping image compression.");
                resolve(base64String);
                return;
            }

            img.src = base64String;

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (maxWidth * height) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    const quality = width > 400 ? 0.7 : 0.8;
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

                    const originalSize = base64String.length;
                    const compressedSize = compressedBase64.length;

                    resolve(compressedSize >= originalSize ? base64String : compressedBase64);
                } catch (error) {
                    console.error('Erro ao comprimir imagem:', error);
                    resolve(base64String);
                }
            };
            img.onerror = reject;
        });
    };



    const showMessage = (message, type) => {
        if (type === 'error') {
            setError(message);
            setTimeout(() => setError(null), 3000);
        } else {
            setSuccess(message);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            const formDataToSend = new FormData();

            // Adicionar campos de texto
            for (const key in formData) {
                if (key !== 'logo' && formData[key] !== null) {
                    if (key === 'cnpj') {
                        formDataToSend.append(key, formData[key].replace(/\D/g, ''));
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            }

            // Adicionar foto (logo) convertendo de base64 para File
            if (formData.logo && typeof formData.logo === 'string' && formData.logo.startsWith('data:image')) {
                const logoFile = await base64ToFile(formData.logo, 'company_logo.jpeg');
                formDataToSend.append('logo', logoFile); // Campo agora é 'logo', não 'image'
            }

            console.log('FormData preparado para envio', formDataToSend);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${authInfo.entity.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao atualizar perfil da empresa');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data);

            // Atualizar dados no localStorage
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            const updatedEntity = {
                ...authEntity,
                ...data.empresa
            };
            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

            // Atualizar o contexto de autenticação
            if (authInfo && authInfo.entity) {
                authInfo.entity = updatedEntity;
            }

            // Atualizar o estado local e verificar campos obrigatórios
            setFormData(prev => {
                const newData = { ...prev, ...data.empresa };
                verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
                return newData;
            });

            refreshAuthInfo();

            setSuccess('Perfil da empresa atualizado com sucesso!');
            setIsModalOpen(false);

            setTimeout(() => {
                setSuccess(null);
            }, 3000);

        } catch (error) {
            console.error('Erro ao atualizar perfil da empresa:', error);
            setError(error.message || 'Erro ao atualizar perfil da empresa');
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveLogo = async () => {
        if (!formData.logo) return; // Só permite remover se houver logo
        // Lógica para remover a logo (se aplicável, ou apenas resetar no frontend)
        setFormData(prev => ({ ...prev, logo: null }));
        // Se a remoção envolver o backend, faça a requisição aqui.
        // Por exemplo, uma requisição PUT para /api/empresas/:id com { logo: null }
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${authInfo.entity.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ logo: null }) // Envia null para remover a logo
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao remover logo');
            }

            const data = await response.json();
            // Atualizar localStorage e contexto de autenticação
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            const updatedEntity = {
                ...authEntity,
                ...data.empresa
            };
            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));
            if (authInfo && authInfo.entity) {
                authInfo.entity = updatedEntity;
            }
            refreshAuthInfo();
            setSuccess('Logo removida com sucesso!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Erro ao remover logo:', error);
            setError(error.message || 'Erro ao remover logo');
            setTimeout(() => setError(null), 3000);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'E';
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B2D26] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando perfil da empresa...</p>
                </div>
            </div>
        );
    }

    if (!authInfo || !authInfo.entity) {
        console.log('Redirecionando para login - authInfo ou entity não disponíveis');
        router.push('/login');
        return null;
    }

    // Adicionar uma verificação para garantir que formData não é null/undefined
    if (!formData) {
        console.log('[DEBUG] formData is null/undefined during render. Returning null.');
        return null;
    }

    const empresa = authInfo.entity;

    return (
        <section className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-4 py-8 space-y-6">
            {/* Mensagens de Erro/Sucesso */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg z-50 animate-fade-in backdrop-blur-sm">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg z-50 animate-fade-in backdrop-blur-sm">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p>{success}</p>
                    </div>
                </div>
            )}

            {/* Status do Perfil */}
            {!perfilCompleto && (
                <div className="w-full max-w-5xl bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-6 border border-amber-300 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-amber-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="font-bold text-amber-800 text-lg">Perfil Incompleto</h3>
                        </div>
                        <span className="text-amber-700 font-semibold bg-amber-300 px-4 py-2 rounded-full shadow-sm">
                            {Math.round(Math.max(0, (Object.keys(camposObrigatoriosDefinidos).length - camposFaltantes.length) / Object.keys(camposObrigatoriosDefinidos).length * 100))}% completo
                        </span>
                    </div>
                    <div className="w-full bg-amber-300 rounded-full h-3 shadow-inner">
                        <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md"
                            style={{ width: `${Math.round(Math.max(0, (Object.keys(camposObrigatoriosDefinidos).length - camposFaltantes.length) / Object.keys(camposObrigatoriosDefinidos).length * 100))}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-amber-700 mt-3 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Campos faltantes: {camposFaltantes.join(', ')}
                    </p>
                </div>
            )}

            {/* Informações Básicas */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl flex flex-col md:flex-row p-6 space-y-4 md:space-y-0 md:space-x-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-center items-center">
                    <div className="relative group">
                        {formData.logo ? (
                            <img
                                src={formData?.logo?.startsWith('data:image')
                                    ? formData.logo
                                    : (formData?.logo ? `${process.env.NEXT_PUBLIC_API_URL}${formData.logo}` : '')
                                }
                                alt="Logo da empresa"
                                width={144}
                                height={144}
                                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#7B2D26] object-contain bg-white p-2 shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                            />
                        ) : (
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#7B2D26] bg-white p-2 shadow-xl flex items-center justify-center">
                                <span className="text-4xl font-bold text-[#7B2D26]">
                                    {getInitials(formData.nome)}
                                </span>
                            </div>
                        )}

                        {formData.logo && (
                            <button
                                onClick={handleRemoveLogo}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">{formData.nome || 'Nome da Empresa não informado'}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formData.email || 'Email não informado'}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formData.cnpj || 'CNPJ não informado'}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formData.local || 'Localização não informada'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:self-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] hover:from-[#9B3D26] hover:to-[#7B2D26] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center transform hover:scale-105 font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumo Profissional (Descrição da Empresa) */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Sobre a Empresa</h2>
                        <p className="text-gray-600 mt-1">Descrição detalhada da sua empresa</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">
                        {formData.descricao || 'Nenhuma descrição da empresa informada.'}
                    </p>
                </div>
            </div>

            {/* Redes Sociais */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Redes Sociais e Contato</h2>
                        <p className="text-gray-600 mt-1">Links para seu site e redes sociais</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                    {formData.site && (
                        <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <a href={formData.site} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="font-medium">Site</span>
                            </a>
                        </div>
                    )}
                    {formData.linkedin && (
                        <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 13h4v8H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                                <span className="font-medium">LinkedIn</span>
                            </a>
                        </div>
                    )}
                    {formData.instagram && (
                        <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <a href={formData.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <span className="font-medium">Instagram</span>
                            </a>
                        </div>
                    )}
                    {formData.facebook && (
                        <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <a href={formData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                </svg>
                                <span className="font-medium">Facebook</span>
                            </a>
                        </div>
                    )}
                    {formData.twitter && (
                        <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <a href={formData.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#7B2D26]">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c1.7 1.2 3.7 2 5.7 2a11.64 11.64 0 0011.64-11.64c0-.2-.01-.4-.02-.6A8.75 8.75 0 0023 3z"></path>
                                </svg>
                                <span className="font-medium">Twitter</span>
                            </a>
                        </div>
                    )}
                    {!formData.site && !formData.linkedin && !formData.instagram && !formData.facebook && !formData.twitter && (
                        <div className="text-gray-700">Nenhuma rede social informada.</div>
                    )}
                </div>
            </div>

            {/* Minhas vagas*/}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Minhas vagas</h2>
                    </div>
                </div>

                <div className='md:grid md:grid-cols-2 flex flex-col'>
                    {vagas.length > 0 ? (
                        
                            vagas.map((vaga) => (
                                <div
                                    key={vaga.id}
                                    className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex m-2 items-center justify-between"
                                >
                                    <div className='flex'>
                                        <svg className="w-6 h-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <h1 className='mr-5 font-semibold'>
                                            {vaga.nome_vaga.length > 30
                                                ? vaga.nome_vaga.substring(0, 30) + '...'
                                                : vaga.nome_vaga}
                                        </h1>
                                        <h2 className='mr-5 text-gray-600'>Área - {vaga.categoria}</h2>
                                    </div>
                                    <div className=''>
                                        <a href={`/vagas?vaga=${vaga.id}`}> <svg className="w-10 h-6 text-[#7B2D26] " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg></a>
                                    </div>
                                </div>
                            ))
                        
                    ): (<h1 className="text-gray-700 leading-relaxed">Nenhuma vaga criada!</h1>) }
                </div>
            </div>

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8 border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Editar Perfil da Empresa</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                                    <input
                                        type="text"
                                        name="cnpj"
                                        value={formData.cnpj || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        maxLength={18}
                                        placeholder="00.000.000/0000-00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                                    <input
                                        type="text"
                                        name="local"
                                        value={formData.local || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Empresa</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao || ''}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    ></textarea>
                                </div>



                                {/* Campos de Redes Sociais no Modal */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                                        <input
                                            type="url"
                                            name="site"
                                            value={formData.site || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={formData.linkedin || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                        <input
                                            type="url"
                                            name="instagram"
                                            value={formData.instagram || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            value={formData.facebook || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={formData.twitter || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-red-800 transition-colors duration-300 flex items-center"
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Salvando...
                                            </>
                                        ) : 'Salvar Alterações'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
} 