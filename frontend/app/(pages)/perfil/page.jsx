'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function Perfil() {
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [camposFaltantes, setCamposFaltantes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const router = useRouter();
    const { authInfo, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !authInfo) {
            router.push('/login');
            return;
        }

        if (authInfo) {
            const dadosUsuario = authInfo.entity;
            // Garantir que todos os campos necessários existam
            const dadosIniciais = {
                nome: dadosUsuario.nome || '',
                email: dadosUsuario.email || '',
                foto: dadosUsuario.foto || null,
                descricao: dadosUsuario.descricao || '',
                formacao: dadosUsuario.formacao || '',
                area_interesse: dadosUsuario.area_interesse || '',
                habilidades: dadosUsuario.habilidades || '',
                curriculo: dadosUsuario.curriculo || null,
                certificados: dadosUsuario.certificados || null,
                local: dadosUsuario.local || '',
                cpf: dadosUsuario.cpf || '',
                cnpj: dadosUsuario.cnpj || '',
                data_nascimento: dadosUsuario.data_nascimento || ''
            };
            setFormData(dadosIniciais);
            verificarCamposObrigatorios(dadosIniciais);
        }
    }, [authInfo, isLoading, router]);

    const verificarCamposObrigatorios = (dadosUsuario) => {
        const isEmpresa = authInfo?.type === 'company';
        
        const camposObrigatorios = isEmpresa ? {
            nome: 'Nome',
            descricao: 'Descrição da Empresa',
            local: 'Local'
        } : {
            nome: 'Nome',
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        try {
            // Atualizar o estado local
            const newData = {
                ...formData,
                [name]: value
            };
            setFormData(newData);

            // Atualizar o localStorage
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            const updatedEntity = {
                ...authEntity,
                [name]: value
            };
            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

            // Atualizar o contexto de autenticação
            if (authInfo && authInfo.entity) {
                authInfo.entity = updatedEntity;
            }
        } catch (error) {
            console.error('Erro ao atualizar campo:', error);
            showMessage('Erro ao atualizar campo. Tente novamente.', 'error');
        }
    };

    // Função para converter base64 em File
    const base64ToFile = (base64String, filename) => {
        return new Promise((resolve, reject) => {
            try {
                // Extrair o tipo MIME e os dados base64
                const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    reject(new Error('Formato inválido de base64'));
                    return;
                }

                const mimeType = matches[1];
                const base64Data = matches[2];

                // Converter base64 para blob
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

    // Função para comprimir imagem
    const compressImage = (base64String, maxWidth = 800) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64String;
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calcular as novas dimensões mantendo a proporção
                    if (width > maxWidth) {
                        height = (maxWidth * height) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');

                    // Melhorar a qualidade da imagem
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Desenhar a imagem com fundo branco para imagens PNG com transparência
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    // Comprimir a imagem com qualidade ajustada
                    const quality = width > 400 ? 0.7 : 0.8; // Qualidade maior para imagens menores
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    
                    // Verificar se a compressão reduziu o tamanho
                    const originalSize = base64String.length;
                    const compressedSize = compressedBase64.length;
                    
                    // Se a compressão não reduziu o tamanho, retorna a imagem original
                    if (compressedSize >= originalSize) {
                        resolve(base64String);
                    } else {
                        resolve(compressedBase64);
                    }
                } catch (error) {
                    console.error('Erro ao comprimir imagem:', error);
                    resolve(base64String); // Em caso de erro, retorna a imagem original
                }
            };

            img.onerror = () => {
                console.error('Erro ao carregar imagem');
                resolve(base64String); // Em caso de erro, retorna a string original
            };
        });
    };

    // Função para atualizar o estado local quando o arquivo é carregado
    const handleFileChange = async (e, field) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Validar tipo de arquivo
            if (field === 'foto' && !file.type.startsWith('image/')) {
                showMessage('Por favor, selecione uma imagem válida.', 'error');
                return;
            }

            // Validar tamanho do arquivo (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('O arquivo deve ter no máximo 5MB.', 'error');
                return;
            }

            // Criar FormData para upload
            const formData = new FormData();
            formData.append(field, file);

            const token = localStorage.getItem('authToken');
            if (!token) {
                showMessage('Token de autenticação não encontrado', 'error');
                return;
            }

            const userId = authInfo?.entity?.id;
            if (!userId) {
                showMessage('ID do usuário não encontrado!', 'error');
                return;
            }

            const isEmpresa = authInfo?.type === 'company';
            const apiUrl = isEmpresa 
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${userId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userId}`;

            // Fazer upload do arquivo
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erro ao fazer upload do arquivo');
            }

            const data = await response.json();
            
            // Atualizar estado com a resposta do servidor
            if (data.usuario) {
                setFormData(prev => ({ ...prev, ...data.usuario }));
                
                // Atualizar a URL do arquivo no estado local
                if (field === 'foto' && data.usuario.foto) {
                    const photoUrl = `${process.env.NEXT_PUBLIC_API_URL}/${data.usuario.foto}`;
                    setFormData(prev => ({ ...prev, foto: photoUrl }));
                    localStorage.setItem('userPhoto', photoUrl);
                } else if (field === 'curriculo' && data.usuario.curriculo) {
                    const curriculoUrl = `${process.env.NEXT_PUBLIC_API_URL}/${data.usuario.curriculo}`;
                    setFormData(prev => ({ ...prev, curriculo: curriculoUrl }));
                } else if (field === 'certificados' && data.usuario.certificados) {
                    const certificadosUrl = `${process.env.NEXT_PUBLIC_API_URL}/${data.usuario.certificados}`;
                    setFormData(prev => ({ ...prev, certificados: certificadosUrl }));
                }
            }

            showMessage(`${field === 'foto' ? 'Foto' : field === 'curriculo' ? 'Currículo' : 'Certificado'} atualizado com sucesso!`, 'success');
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            showMessage(error.message || 'Erro ao fazer upload do arquivo. Por favor, tente novamente.', 'error');
        }
    };

    // Função para baixar arquivo
    const downloadFile = (data, filename) => {
        try {
            console.log('Tentando baixar arquivo:', { data: data.substring(0, 100) + '...', filename });
            
            // Se for uma URL, baixa diretamente
            if (data.startsWith('http')) {
                window.open(data, '_blank');
                return;
            }

            // Se for um caminho de arquivo, baixa do servidor
            if (data.startsWith('/')) {
                window.open(`${process.env.NEXT_PUBLIC_API_URL}${data}`, '_blank');
                return;
            }

            // Se for base64, converte e baixa
            if (data.startsWith('data:')) {
                // Extrair o tipo MIME e os dados base64
                const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    console.error('Formato inválido de base64:', data.substring(0, 100));
                    throw new Error('Formato de arquivo inválido');
                }

                const mimeType = matches[1];
                const base64Data = matches[2];

                console.log('MIME type detectado:', mimeType);

                // Verificar se o tipo MIME é válido
                const validMimeTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'image/jpeg',
                    'image/png',
                    'image/gif'
                ];

                if (!validMimeTypes.includes(mimeType)) {
                    console.error('Tipo MIME não suportado:', mimeType);
                    throw new Error(`Tipo de arquivo não suportado: ${mimeType}`);
                }

                // Converter base64 para blob
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
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                
                // Determinar a extensão correta baseada no tipo MIME
                let extension = 'pdf';
                if (mimeType.includes('word')) {
                    extension = 'docx';
                } else if (mimeType.includes('pdf')) {
                    extension = 'pdf';
                } else if (mimeType.includes('jpeg')) {
                    extension = 'jpg';
                } else if (mimeType.includes('png')) {
                    extension = 'png';
                } else if (mimeType.includes('gif')) {
                    extension = 'gif';
                }
                
                link.download = `${filename}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Formato de dados não reconhecido:', data.substring(0, 50));
                throw new Error('Formato de arquivo não suportado');
            }
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            showMessage(error.message || 'Erro ao baixar arquivo. Tente novamente.', 'error');
        }
    };

    // Função para mostrar mensagens de erro/sucesso
    const showMessage = (message, type) => {
        if (type === 'error') {
            setError(message);
            setTimeout(() => setError(null), 5000);
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
            const userId = authInfo?.entity?.id;
            if (!userId) {
                showMessage('ID do usuário não encontrado!', 'error');
                setIsSaving(false);
                return;
            }
            
            const isEmpresa = authInfo?.type === 'company';
            const apiUrl = isEmpresa 
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${userId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userId}`;

            // Preparar dados para envio
            const dadosParaEnviar = {
                ...formData,
                foto: null
            };
            
            // Remover o ID do corpo da requisição pois já está na URL
            delete dadosParaEnviar.id;

            const token = localStorage.getItem('authToken');
            if (!token) {
                showMessage('Token de autenticação não encontrado', 'error');
                setIsSaving(false);
                return;
            }

            // Filtrar campos vazios ou nulos
            const dadosFiltrados = Object.fromEntries(
                Object.entries(dadosParaEnviar).filter(([_, value]) => value !== null && value !== '')
            );

            let response;
            if (formData.foto?.startsWith?.('data:') || formData.curriculo?.startsWith?.('data:') || formData.certificados?.startsWith?.('data:')) {
                // Usar FormData para arquivos
                const formDataToSend = new FormData();
                Object.entries(dadosFiltrados).forEach(([key, value]) => {
                    if (value?.startsWith?.('data:')) {
                        // Converter base64 para blob
                        const base64Data = value.split(',')[1];
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
                        const blob = new Blob(byteArrays, { type: 'image/jpeg' });
                        formDataToSend.append(key, blob, `${key}.jpg`);
                    } else {
                        formDataToSend.append(key, value);
                    }
                });

                response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataToSend
                });
            } else {
                // Usar JSON para dados sem arquivos
                console.log('Enviando com JSON:', dadosFiltrados);
                
                response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dadosFiltrados)
                });
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erro ao atualizar perfil');
            }

            const dadosAtualizados = await response.json();
            console.log('Dados atualizados recebidos do servidor:', dadosAtualizados);

            // Criar um objeto atualizado combinando os dados existentes com os retornados pelo servidor
            const updatedEntity = {
                ...authInfo.entity,
                ...dadosAtualizados.usuario // Usar dados do servidor como prioridade
            };
            
            // Para arquivos, manter a versão base64 local se o servidor não retornou o caminho
            if (dadosFiltrados.foto?.startsWith?.('data:') && !updatedEntity.foto) {
                updatedEntity.foto = dadosFiltrados.foto;
            }
            if (dadosFiltrados.curriculo?.startsWith?.('data:') && !updatedEntity.curriculo) {
                updatedEntity.curriculo = dadosFiltrados.curriculo;
            }
            if (dadosFiltrados.certificados?.startsWith?.('data:') && !updatedEntity.certificados) {
                updatedEntity.certificados = dadosFiltrados.certificados;
            }

            // Atualizar o localStorage
            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

            // Atualizar o estado local com todos os campos necessários
            const dadosAtualizadosCompletos = {
                nome: updatedEntity.nome || '',
                email: updatedEntity.email || '',
                foto: updatedEntity.foto || null,
                descricao: updatedEntity.descricao || '',
                formacao: updatedEntity.formacao || '',
                area_interesse: updatedEntity.area_interesse || '',
                habilidades: updatedEntity.habilidades || '',
                curriculo: updatedEntity.curriculo || null,
                certificados: updatedEntity.certificados || null,
                local: updatedEntity.local || '',
                cpf: updatedEntity.cpf || '',
                cnpj: updatedEntity.cnpj || '',
                data_nascimento: updatedEntity.data_nascimento || ''
            };
            setFormData(dadosAtualizadosCompletos);
            verificarCamposObrigatorios(dadosAtualizadosCompletos);

            // Atualizar o contexto de autenticação
            if (authInfo?.entity) {
                authInfo.entity = updatedEntity;
            }

            // Fechar o modal
            setIsModalOpen(false);

            // Mostrar mensagem de sucesso
            showMessage('Perfil atualizado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showMessage(error.message || 'Erro ao atualizar perfil. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
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
            {/* Mensagens de Erro/Sucesso */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg z-50 animate-fade-in">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in">
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
                <div className="w-full max-w-5xl bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-amber-800 text-lg">Perfil Incompleto</h3>
                        <span className="text-amber-600 font-medium bg-amber-200 px-3 py-1 rounded-full">
                            {Math.round(((authInfo?.type === 'company' ? 3 : 5) - camposFaltantes.length) / (authInfo?.type === 'company' ? 3 : 5) * 100)}% completo
                        </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-3">
                        <div 
                            className="bg-amber-600 h-3 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${((authInfo?.type === 'company' ? 3 : 5) - camposFaltantes.length) / (authInfo?.type === 'company' ? 3 : 5) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-amber-700 mt-3">
                        Campos faltantes: {camposFaltantes.join(', ')}
                    </p>
                </div>
            )}

            {/* Informações Básicas */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row p-8 space-y-6 md:space-y-0 md:space-x-8 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex justify-center items-center">
                    <div className="relative group">
                        {authInfo?.type === 'company' ? (
                            // Exibição para empresa
                            formData.logo ? (
                                <img 
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#7B2D26] object-contain bg-white p-2 shadow-lg transform transition-transform duration-300 group-hover:scale-105" 
                                    src={formData.logo} 
                                    alt="Logo da Empresa" 
                                />
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#7B2D26] bg-[#7B2D26] text-white text-center text-4xl font-bold flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                                    {getInitials(formData.nome || 'E')}
                                </div>
                            )
                        ) : (
                            // Exibição para usuário
                            formData.foto ? (
                                <img 
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#7B2D26] object-cover shadow-lg transform transition-transform duration-300 group-hover:scale-105" 
                                    src={formData.foto} 
                                    alt="Foto de Perfil" 
                                />
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#7B2D26] bg-[#7B2D26] text-white text-center text-4xl font-bold flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105">
                                    {getInitials(formData.nome || 'U')}
                                </div>
                            )
                        )}
                        <div className="absolute inset-0 rounded-full bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-full shadow-lg"
                            >
                                
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{formData.nome || 'Nome não informado'}</h1>
                        <div className="space-y-2">
                            <h2 className="flex items-center text-gray-700">
                                <img className="h-5 pr-2" src="/img/perfil/email.svg" alt="Email" />
                                {formData.email || 'Email não informado'}
                            </h2>
                            {authInfo?.type === 'company' && (
                                <>
                                    <h2 className="flex items-center text-gray-700">
                                        <img className="h-5 pr-2" src="/img/perfil/cnpj.svg" alt="CNPJ" />
                                        {formData.cnpj || 'CNPJ não informado'}
                                    </h2>
                                    {formData.local && (
                                        <h2 className="flex items-center text-gray-700">
                                            <img className="h-5 pr-2" src="/img/perfil/location.svg" alt="Local" />
                                            {formData.local}
                                        </h2>
                                    )}
                                </>
                            )}
                            {authInfo?.type !== 'company' && (
                                <>
                                    <h2 className="flex items-center text-gray-700">
                                        <img className="h-5 pr-2" src="/img/perfil/cpf.svg" alt="CPF" />
                                        {formData.cpf || 'CPF não informado'}
                                    </h2>
                                    <h2 className="flex items-center text-gray-700">
                                        <img className="h-5 pr-2" src="/img/perfil/calendar.svg" alt="Data de Nascimento" />
                                        {formData.data_nascimento || 'Data de nascimento não informada'}
                                    </h2>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:self-end">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center transform hover:scale-105"
                        >
                            <img className="h-5 pr-2" src="/img/perfil/pencil.svg" alt="pencil" />
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumo Profissional */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Resumo Profissional</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                    {formData.descricao || 'Nenhum resumo profissional informado.'}
                </p>
            </div>

            {/* Formação Acadêmica */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Formação Acadêmica</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {formData.formacao || 'Nenhuma formação acadêmica informada.'}
                    </p>
                </div>
            )}

            {/* Habilidades */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Habilidades</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {formData.habilidades ? (
                            formData.habilidades.split(',').map((habilidade, index) => (
                                <span 
                                    key={index}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    {habilidade.trim()}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-700">Nenhuma habilidade informada.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Currículo */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Currículo</h2>
                        <div className="flex gap-4">
                            {formData.curriculo && formData.curriculo !== "" ? (
                                <>
                                    <button 
                                        onClick={() => downloadFile(formData.curriculo, 'curriculo')}
                                        className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Baixar Currículo
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => document.getElementById('curriculo-input').click()}
                                    className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm"
                                >
                                    Enviar Currículo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Certificados */}
            {authInfo?.type !== 'company' && formData.certificados && formData.certificados !== "" && (
                <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Certificados</h2>
                        <button 
                            onClick={() => document.getElementById('certificados-input').click()}
                            className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Adicionar Certificado
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.certificados && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#7B2D26] transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-800">Certificado</h3>
                                        <span className="text-sm text-gray-500">PDF</span>
                                    </div>
                                    <button 
                                        onClick={() => downloadFile(formData.certificados, 'certificado')}
                                        className="w-full cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Baixar Certificado
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

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

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8 border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                {authInfo?.type !== 'company' ? (
                                    // Campos editáveis para alunos
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Formação Acadêmica</label>
                                            <input
                                                type="text"
                                                name="formacao"
                                                value={formData.formacao || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Área de Interesse</label>
                                            <input
                                                type="text"
                                                name="area_interesse"
                                                value={formData.area_interesse || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades (separadas por vírgula)</label>
                                            <input
                                                type="text"
                                                name="habilidades"
                                                value={formData.habilidades || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Resumo Profissional</label>
                                            <textarea
                                                name="descricao"
                                                value={formData.descricao || ''}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            ></textarea>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                                        {formData.foto ? (
                                                            <img 
                                                                src={formData.foto} 
                                                                alt="Preview" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#7B2D26] text-white text-center text-2xl font-bold flex items-center justify-center">
                                                                {getInitials(formData.nome || 'U')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col space-y-2">
                                                            <div className="relative">
                                                                <input
                                                                    type="file"
                                                                    name="foto"
                                                                    onChange={(e) => handleFileChange(e, 'foto')}
                                                                    className="hidden"
                                                                    id="foto-input"
                                                                    accept="image/*"
                                                                />
                                                                <label
                                                                    htmlFor="foto-input"
                                                                    className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center transition-all duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    {formData.foto ? 'Alterar Foto' : 'Escolher Foto'}
                                                                </label>
                                                            </div>
                                                            {formData.foto && (
                                                                <button
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        try {
                                                                            const userId = authInfo?.entity?.id;
                                                                            if (!userId) {
                                                                                showMessage('ID do usuário não encontrado!', 'error');
                                                                                return;
                                                                            }

                                                                            const isEmpresa = authInfo?.type === 'company';
                                                                            const apiUrl = isEmpresa 
                                                                                ? `${process.env.NEXT_PUBLIC_API_URL}/api/empresas/${userId}`
                                                                                : `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userId}`;

                                                                            // Preparar dados para envio
                                                                            const dadosParaEnviar = {
                                                                                ...formData,
                                                                                foto: null
                                                                            };

                                                                            const token = localStorage.getItem('authToken');
                                                                            if (!token) {
                                                                                showMessage('Token de autenticação não encontrado', 'error');
                                                                                return;
                                                                            }

                                                                            const response = await fetch(apiUrl, {
                                                                                method: 'PUT',
                                                                                headers: {
                                                                                    'Content-Type': 'application/json',
                                                                                    'Authorization': `Bearer ${token}`
                                                                                },
                                                                                body: JSON.stringify(dadosParaEnviar)
                                                                            });

                                                                            if (!response.ok) {
                                                                                throw new Error('Erro ao remover foto');
                                                                            }

                                                                            // Atualizar estado local
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                foto: null
                                                                            }));

                                                                            // Atualizar localStorage
                                                                            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
                                                                            const updatedEntity = {
                                                                                ...authEntity,
                                                                                foto: null
                                                                            };
                                                                            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

                                                                            // Atualizar contexto de autenticação
                                                                            if (authInfo && authInfo.entity) {
                                                                                authInfo.entity = updatedEntity;
                                                                            }

                                                                            showMessage('Foto removida com sucesso!', 'success');
                                                                            
                                                                            // Forçar atualização da página após 1.5 segundos
                                                                            setTimeout(() => {
                                                                                window.location.reload();
                                                                            }, 1500);
                                                                        } catch (error) {
                                                                            console.error('Erro ao remover foto:', error);
                                                                            showMessage('Erro ao remover foto. Tente novamente.', 'error');
                                                                        }
                                                                    }}
                                                                    className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg border border-red-300 flex items-center justify-center transition-all duration-300"
                                                                >
                                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Remover Foto
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Currículo</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        name="curriculo"
                                                        onChange={(e) => handleFileChange(e, 'curriculo')}
                                                        className="hidden"
                                                        id="curriculo-input"
                                                        accept=".pdf,.doc,.docx"
                                                    />
                                                    <label
                                                        htmlFor="curriculo-input"
                                                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center transition-all duration-300"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        {formData.curriculo ? 'Atualizar Currículo' : 'Enviar Currículo'}
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, DOC, DOCX</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificados</label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        name="certificados"
                                                        onChange={(e) => handleFileChange(e, 'certificados')}
                                                        className="hidden"
                                                        id="certificados-input"
                                                        accept=".pdf,.doc,.docx"
                                                    />
                                                    <label
                                                        htmlFor="certificados-input"
                                                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center transition-all duration-300"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        {formData.certificados ? 'Atualizar Certificados' : 'Enviar Certificados'}
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PDF, DOC, DOCX</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Campos editáveis para empresas
                                    <>
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                                            <input
                                                type="text"
                                                name="local"
                                                value={formData.local || ''}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Empresa</label>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                                                    {formData.logo ? (
                                                        <img 
                                                            src={formData.logo} 
                                                            alt="Logo Preview" 
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            name="logo"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            logo: reader.result
                                                                        }));
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                            id="logo-input"
                                                            accept="image/*"
                                                        />
                                                        <label
                                                            htmlFor="logo-input"
                                                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center transition-all duration-300"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {formData.logo ? 'Atualizar Logo' : 'Escolher Logo'}
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

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