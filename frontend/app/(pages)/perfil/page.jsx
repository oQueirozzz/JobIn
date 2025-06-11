'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function Perfil() {
    const [perfilCompleto, setPerfilCompleto] = useState(false);
    const [camposFaltantes, setCamposFaltantes] = useState([]);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const router = useRouter();
    const { authInfo, isLoading, refreshAuthInfo } = useAuth();

    // Definindo os campos obrigatórios dinamicamente
    const camposObrigatoriosDefinidos = useMemo(() => ({
        nome: 'Nome',
        email: 'Email',
        formacao: 'Formação Acadêmica',
        area_interesse: 'Área de Interesse',
        habilidades: 'Habilidades',
        descricao: 'Resumo Profissional',
        curriculo: 'Currículo',
        certificados: 'Certificados',
        cpf: 'CPF',
        data_nascimento: 'Data de Nascimento'
    }), []);

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

    useEffect(() => {
        if (!isLoading && !authInfo?.entity) {
            setTimeout(() => {
                router.push('/login');
            }, 0);
            return;
        }

        if (authInfo?.entity) {
            const dadosUsuario = authInfo.entity;
            
            // Verificar se é uma empresa e redirecionar se necessário
            if (dadosUsuario.tipo === 'empresa') {
                setTimeout(() => {
                    router.push('/perfil-empresa');
                }, 0);
                return;
            }

            const obrigatorios = {
                nome: 'Nome',
                email: 'Email',
                formacao: 'Formação Acadêmica',
                area_interesse: 'Área de Interesse',
                habilidades: 'Habilidades',
                descricao: 'Resumo Profissional',
                curriculo: 'Currículo',
                certificados: 'Certificados',
                cpf: 'CPF',
                data_nascimento: 'Data de Nascimento'
            };

            // Garantir que todos os campos necessários existam
            const dadosIniciais = {
                nome: dadosUsuario.nome || '',
                email: dadosUsuario.email || '',
                descricao: dadosUsuario.descricao || '',
                formacao: dadosUsuario.formacao || '',
                area_interesse: dadosUsuario.area_interesse || '',
                habilidades: dadosUsuario.habilidades || '',
                curriculo: dadosUsuario.curriculo || null,
                certificados: Array.isArray(dadosUsuario.certificados) ? dadosUsuario.certificados : 
                            (dadosUsuario.certificados ? [dadosUsuario.certificados] : []),
                local: '', // Removido, mas mantido vazio para evitar erro de desestruturação se a API ainda retornar
                cpf: dadosUsuario.cpf ? formatarCPF(dadosUsuario.cpf) : '',
                cnpj: '', // Removido, mas mantido vazio
                data_nascimento: dadosUsuario.data_nascimento || '',
            };
            console.log('Dados iniciais formatados:', dadosIniciais);
            setFormData(dadosIniciais);
            verificarCamposObrigatorios(dadosIniciais, obrigatorios);

            console.log('--- Depuração da Porcentagem Perfil ---');
            console.log('Usuário (authInfo.entity):', dadosUsuario);
            console.log('Campos Obrigatórios Definidos (perfil):', obrigatorios);
            console.log('Total de Campos Obrigatórios (perfil - length of obrigatorios):', Object.keys(obrigatorios).length);
            console.log('Total de Chaves em dadosUsuario (entity):', Object.keys(dadosUsuario).length);
            
            const porcentagemCompletaPerfil = calcularPorcentagemPerfil(dadosUsuario, obrigatorios);
            console.log('Porcentagem Completa Calculada (perfil):', porcentagemCompletaPerfil);
            console.log('---------------------------------------');
            console.log('authInfo.entity.curriculo on load:', authInfo.entity.curriculo);
        }
    }, [authInfo, isLoading, router]);

    const verificarCamposObrigatorios = (dadosUsuario, camposObrigatorios) => {
        // A variável isEmpresa e a definição de camposObrigatorios foram movidas para o useEffect
        // para serem definidas apenas uma vez e passadas para esta função.
        
        const camposIncompletos = Object.entries(camposObrigatorios)
            .filter(([campo]) => {
                const valor = dadosUsuario[campo];
                if (Array.isArray(valor)) {
                    return valor.length === 0; // Se for um array, é faltante se estiver vazio
                }
                return !valor || (typeof valor === 'string' && valor.trim() === ''); // Para outros tipos, a lógica existente
            })
            .map(([_, label]) => label);

        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
    };

    const validarCPF = (cpf) => {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto > 9 ? 0 : resto;
        if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto > 9 ? 0 : resto;
        if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;

        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        try {
            let valorProcessado = value;

            // Formatar e validar CPF
            if (name === 'cpf') {
                const cpfLimpo = value.replace(/\D/g, '');
                if (cpfLimpo.length === 11 && !validarCPF(cpfLimpo)) {
                    showMessage('CPF inválido', 'error');
                    return;
                }
                valorProcessado = formatarCPF(value);
            }

            // Validar data de nascimento apenas se for blur
            if (name === 'data_nascimento') {
                if (!validarDataNascimento(value, false)) {
                    return;
                }
            }

            // Processar área de interesse
            if (name === 'area_interesse') {
                valorProcessado = value;
            }

            // Atualizar o estado local
            const newData = {
                ...formData,
                [name]: valorProcessado
            };
            setFormData(newData);
            verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);

            // Atualizar o localStorage
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            const updatedEntity = {
                ...authEntity,
                [name]: valorProcessado
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

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        if (name === 'data_nascimento') {
            if (!validarDataNascimento(value, true)) {
                showMessage('Data de nascimento inválida. Deve ser entre 1950 e a data atual.', 'error');
                // Resetar para a data anterior válida
                const dataAnterior = formData.data_nascimento;
                const newData = {
                    ...formData,
                    [name]: dataAnterior
                };
                setFormData(newData);
                verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
            }
        }
    };

    // Função para atualizar o estado local quando o arquivo é carregado
    const handleFileChange = async (e, field) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Validar tipo de arquivo para currículo e certificados
            if ((field === 'curriculo' || field === 'certificados') && 
                !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
                showMessage('Por favor, selecione um arquivo PDF ou Word válido.', 'error');
                return;
            }

            // Validar tamanho do arquivo (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('O arquivo deve ter no máximo 5MB.', 'error');
                return;
            }

            // Para arquivos que não são imagens, apenas armazenar o arquivo
            if (field === 'curriculo') {
                setIsSaving(true);
                try {
                    const userId = authInfo?.entity?.id;
                    if (!userId) {
                        showMessage('ID do usuário não encontrado!', 'error');
                        setIsSaving(false);
                        return;
                    }

                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        showMessage('Token de autenticação não encontrado', 'error');
                        setIsSaving(false);
                        return;
                    }

                    const formDataToSend = new FormData();
                    formDataToSend.append('curriculo', file);
                    // Se o seu backend espera outros campos mesmo para uploads de arquivo único,
                    // você pode adicionar os campos necessários do formData aqui.
                    // Exemplo: formDataToSend.append('nome', formData.nome);

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            // 'Content-Type': 'multipart/form-data' é automaticamente definido pelo navegador para FormData
                        },
                        body: formDataToSend
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Erro ao enviar currículo');
                    }

                    const data = await response.json();
                    console.log('Resposta do backend após upload de currículo:', data);

                    // Atualizar o estado local com o novo caminho do currículo retornado pelo backend
                    setFormData(prev => {
                        const newData = { ...prev, curriculo: data.curriculo || file }; // Use o caminho do backend se disponível
                        verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
                        return newData;
                    });

                    // Atualizar localStorage e contexto de autenticação
                    const authEntity = JSON.parse(localStorage.getItem('authEntity'));
                    const updatedEntity = {
                        ...authEntity,
                        curriculo: data.curriculo || null // Garante que o path do currículo seja salvo
                    };
                    localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

                    if (authInfo && authInfo.entity) {
                        authInfo.entity = updatedEntity;
                    }
                    refreshAuthInfo(); // Forçar atualização do authInfo para refletir os dados mais recentes

                    showMessage('Currículo enviado com sucesso e perfil atualizado!', 'success');
                } catch (error) {
                    console.error('Erro no upload automático do currículo:', error);
                    showMessage(error.message || 'Erro ao fazer upload do currículo. Tente novamente.', 'error');
                } finally {
                    setIsSaving(false);
                }
                return;
            }

            // Para certificados, substituir o arquivo atual
            if (field === 'certificados') {
                setFormData(prev => {
                    const newData = { ...prev, certificados: file };
                    verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
                    return newData;
                });
                showMessage('Certificado adicionado com sucesso!', 'success');
                return;
            }

            // Para imagens, criar URL temporária para preview
            if (field === 'foto') {
                const fileUrl = URL.createObjectURL(file);
                setFormData(prev => {
                    const newData = { ...prev, [field]: fileUrl };
                    verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
                    return newData;
                });
                localStorage.setItem('userPhoto', fileUrl);
                showMessage('Foto selecionada com sucesso! Clique em "Salvar Alterações" para confirmar.', 'success');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            showMessage(error.message || 'Erro ao fazer upload do arquivo. Por favor, tente novamente.', 'error');
        }
    };

    // Função para baixar arquivo
    const downloadFile = (data, filename) => {
        try {
            console.log('Tentando baixar arquivo:', { data: data?.substring?.(0, 100) + '...', filename });
            
            // Se for uma URL, baixa diretamente
            if (data?.startsWith?.('http')) {
                window.open(data, '_blank');
                return;
            }

            // Se for um caminho relativo (começa com /)
            if (data?.startsWith?.('/')) {
                window.open(`${process.env.NEXT_PUBLIC_API_URL}${data}`, '_blank');
                return;
            }

            // Se for um caminho completo do Windows
            if (data?.includes?.('\\')) {
                const fileName = data.split('\\').pop();
                window.open(`${process.env.NEXT_PUBLIC_API_URL}/uploads/usuarios/${fileName}`, '_blank');
                return;
            }

            // Se for base64, converte e baixa
            if (data?.startsWith?.('data:')) {
                // Extrair o tipo MIME e os dados base64
                const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    console.error('Formato inválido de base64:', data?.substring?.(0, 100));
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
                return;
            }

            console.error('Formato de dados não reconhecido:', data?.substring?.(0, 50));
            throw new Error('Formato de arquivo não suportado');
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            showMessage(error.message || 'Erro ao baixar arquivo. Tente novamente.', 'error');
        }
    };

    // Função para mostrar mensagens de erro/sucesso
    const showMessage = (message, type) => {
        if (type === 'error') {
            setError(message);
            setTimeout(() => setError(null), 2000);
        } else {
            setSuccess(message);
            setTimeout(() => setSuccess(null), 2000);
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

            let response;
            let bodyData;
            let headers = {
                'Authorization': `Bearer ${token}`
            };

            // Se houver um arquivo de currículo (objeto File), usar FormData
            if (formData.curriculo instanceof File) {
                const formDataToSend = new FormData();
                // Adicionar todos os campos do formData ao FormData
        for (const key in formData) {
                    // Excluir a foto se ela for uma URL temporária (data:image/)
                    if (key === 'foto' && typeof formData[key] === 'string' && formData[key].startsWith('data:image/')) {
                        // Não adicionar a foto temporária aqui, ela será tratada separadamente
                    } else if (key === 'curriculo' && formData[key] instanceof File) {
                        formDataToSend.append(key, formData[key]);
                    } else if (key === 'certificados' && formData[key] instanceof File) {
                        // Se houver um novo certificado, tratá-lo aqui (se necessário, ou um array de arquivos)
                        formDataToSend.append(key, formData[key]);
                    } else if (formData[key] !== null) {
                        // Garantir que arrays (habilidades, certificados) sejam stringified se não forem arquivos
                        if (Array.isArray(formData[key])) {
                            formDataToSend.append(key, JSON.stringify(formData[key]));
                        } else if (key === 'cpf') {
                            formDataToSend.append(key, formData[key].replace(/\D/g, ''));
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }
                }
                bodyData = formDataToSend;
                // Não definir Content-Type para FormData, o navegador faz isso
            } else {
                // Caso contrário, enviar como JSON
                bodyData = {
                    ...formData,
                    cpf: formData.cpf.replace(/\D/g, ''), // Remover formatação do CPF
                    area_interesse: formData.area_interesse // Já está no formato correto
                };

                // Certificados que já estão no servidor ou foram adicionados como URL
                if (Array.isArray(bodyData.certificados)) {
                    bodyData.certificados = bodyData.certificados.map(c => typeof c === 'object' && c !== null && 'url' in c ? c.url : c);
                }

                // Se a foto for uma URL temporária, não a envie no JSON
                if (typeof bodyData.foto === 'string' && bodyData.foto.startsWith('data:image/')) {
                    delete bodyData.foto;
                }
                headers['Content-Type'] = 'application/json';
                bodyData = JSON.stringify(bodyData);
            }

            // Enviar a requisição para o servidor
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authInfo.entity.id}`, {
                method: 'PUT',
                headers: headers,
                body: bodyData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao atualizar perfil');
            }

            const data = await response.json();
            console.log('Dados do usuário recebidos do servidor após atualização:', data.usuario);

            // Atualizar dados no localStorage
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            const updatedEntity = {
                ...authEntity,
                ...data.usuario
            };
            localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

            // Atualizar o contexto de autenticação
            if (authInfo && authInfo.entity) {
                authInfo.entity = updatedEntity;
            }

            // Atualizar o estado local e verificar campos obrigatórios
            setFormData(prev => {
                const newData = { ...prev, ...data.usuario };
                verificarCamposObrigatorios(newData, camposObrigatoriosDefinidos);
                return newData;
            });

            // Forçar atualização do authInfo para refletir os dados mais recentes, incluindo o currículo
            refreshAuthInfo();

            // Criar notificação de atualização de perfil usando o serviço
            const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${authInfo.entity.id}/notificar-perfil-atualizado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!notificationResponse.ok) {
                const errorData = await notificationResponse.json();
                console.error('Erro ao criar notificação:', errorData);
            }

            // Mostrar mensagem de sucesso e fechar o modal
            setSuccess('Perfil atualizado com sucesso!');
            setIsModalOpen(false);

            // Remover a mensagem de sucesso após 3 segundos
            setTimeout(() => {
                setSuccess(null);
            }, 3000);

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setError(error.message || 'Erro ao atualizar perfil');
            // Remover a mensagem de erro após 3 segundos
            setTimeout(() => {
                setError(null);
            }, 3000);
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

    const formatarData = (data) => {
        if (!data) return 'Data de nascimento não informada';
        try {
            if (data.includes('/')) {
                return data;
            }
            
            if (data.includes('-')) {
                const [ano, mes, dia] = data.split('-');
                return `${dia}/${mes}/${ano}`;
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return data;
        }
    };

    const [candidaturas, setcandidaturas] = useState([]);
    const [loadingCandidaturas, setLoadingCandidaturas] = useState(true);

    useEffect(() => {
        async function fetchcandidaturas() {
            if (!authInfo?.entity?.id) {
                setLoadingCandidaturas(false);
                return;
            }
            try {
                setLoadingCandidaturas(true);
                // Endpoint para buscar candidaturas do usuário logado
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas/usuario/${authInfo.entity.id}`);
                const data = await res.json();

                const ordenadas = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setcandidaturas(ordenadas);
            } catch (err) {
                console.error('Erro ao buscar candidaturas:', err);
                // Opcional: mostrar mensagem de erro para o usuário
            } finally {
                setLoadingCandidaturas(false);
            }
        }

        // Busca candidaturas apenas se o usuário for do tipo 'usuario' e não estiver carregando info de autenticação
        if (!isLoading && authInfo?.entity?.id && authInfo.entity.tipo === 'usuario') {
            fetchcandidaturas();
        }
    }, [authInfo, isLoading]);

    const formatarCPF = (cpf) => {
        if (!cpf) return '';
        // Remove tudo que não for número
        const cpfLimpo = cpf.replace(/\D/g, '');
        // Limita a 11 dígitos
        const cpfLimitado = cpfLimpo.slice(0, 11);
        // Aplica a máscara
        return cpfLimitado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const validarDataNascimento = (data, isBlur = false) => {
        if (!data) return true;
        
        // Se não for blur (estiver digitando), apenas verifica se a data é válida
        if (!isBlur) {
            const dataNascimento = new Date(data);
            return !isNaN(dataNascimento.getTime());
        }
        
        // Validação completa apenas quando o campo perder o foco
        const dataAtual = new Date();
        const dataNascimento = new Date(data);
        const anoMinimo = 1950;
        
        // Verifica se a data é válida
        if (isNaN(dataNascimento.getTime())) return false;
        
        // Verifica se a data é anterior à data atual
        if (dataNascimento > dataAtual) return false;
        
        // Verifica se o ano é maior que 1950
        if (dataNascimento.getFullYear() < anoMinimo) return false;
        
        return true;
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

    // Verifica se authInfo e authInfo.entity existem
    if (!authInfo || !authInfo.entity) {
        console.log('Redirecionando para login - authInfo ou entity não disponíveis');
        router.push('/login');
        return null;
    }

    // Define usuario após todas as verificações
    const usuario = authInfo.entity;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-4 py-8 space-y-6">
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
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-100 flex items-center justify-center text-5xl font-bold text-[#7B2D26] border-4 border-[#7B2D26] object-cover shadow-xl transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                            {getInitials(formData.nome)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">{formData.nome || 'Nome não informado'}</h1>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formData.cpf || 'CPF não informado'}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium text-gray-700">{formatarData(formData.data_nascimento)}</span>
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

            {/* Resumo Profissional */}
            <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Resumo Profissional</h2>
                        <p className="text-gray-600 mt-1">Sua apresentação profissional</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-700 leading-relaxed">
                        {formData.descricao || 'Nenhum resumo profissional informado.'}
                    </p>
                </div>
            </div>

            {/* Formação Acadêmica */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Formação Acadêmica</h2>
                            <p className="text-gray-600 mt-1">Sua trajetória educacional</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <p className="text-gray-700 leading-relaxed">
                            {formData.formacao || 'Nenhuma formação acadêmica informada.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Áreas de Interesse */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Áreas de Interesse</h2>
                            <p className="text-gray-600 mt-1">Temas e setores que você deseja atuar</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-wrap gap-3">
                            {formData.area_interesse ? (
                                formData.area_interesse.split(',').map((area, index) => (
                                    <span
                                        key={index}
                                        className="bg-gradient-to-r from-[#7B2D26]/10 to-[#9B3D26]/10 text-[#7B2D26] px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        {area.trim()}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-700">Nenhuma área de interesse informada.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Habilidades */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Habilidades</h2>
                            <p className="text-gray-600 mt-1">Suas competências profissionais</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-100 to-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex flex-wrap gap-3">
                            {formData.habilidades ? (
                                formData.habilidades.split(',').map((habilidade, index) => (
                                    <span 
                                        key={index}
                                        className="bg-gradient-to-r from-[#7B2D26]/10 to-[#9B3D26]/10 text-[#7B2D26] px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                                    >
                                        {habilidade.trim()}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-700">Nenhuma habilidade informada.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Currículo */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Currículo</h2>
                            <p className="text-gray-600 mt-1">Seu currículo profissional</p>
                        </div>
                        <div className="flex gap-3">
                            {formData.curriculo ? (
                                <>
                                    <button 
                                        onClick={() => {
                                            if (formData.curriculo instanceof File) {
                                                const url = URL.createObjectURL(formData.curriculo);
                                                window.open(url, '_blank');
                                            } else if (formData.curriculo) {
                                                downloadFile(formData.curriculo, 'curriculo');
                                            } else {
                                                showMessage('Nenhum currículo disponível para download', 'error');
                                            }
                                        }}
                                        className="cursor-pointer bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] hover:from-[#9B3D26] hover:to-[#7B2D26] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center transform hover:scale-105 font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Baixar Currículo
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                const userId = authInfo?.entity?.id;
                                                if (!userId) {
                                                    showMessage('ID do usuário não encontrado!', 'error');
                                                    return;
                                                }

                                                const token = localStorage.getItem('authToken');
                                                if (!token) {
                                                    showMessage('Token de autenticação não encontrado', 'error');
                                                    return;
                                                }

                                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${userId}`, {
                                                    method: 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        ...formData,
                                                        curriculo: null
                                                    })
                                                });

                                                if (!response.ok) {
                                                    throw new Error('Erro ao remover currículo');
                                                }

                                                const data = await response.json();

                                                // Atualizar estado local
                                                setFormData(prev => ({
                                                    ...prev,
                                                    curriculo: null
                                                }));

                                                // Atualizar localStorage
                                                const authEntity = JSON.parse(localStorage.getItem('authEntity'));
                                                const updatedEntity = {
                                                    ...authEntity,
                                                    curriculo: null
                                                };
                                                localStorage.setItem('authEntity', JSON.stringify(updatedEntity));

                                                // Atualizar o contexto de autenticação
                                                if (authInfo && authInfo.entity) {
                                                    authInfo.entity = updatedEntity;
                                                }

                                                showMessage('Currículo removido com sucesso!', 'success');
                                                
                                                // Forçar atualização do authInfo
                                                refreshAuthInfo();
                                            } catch (error) {
                                                console.error('Erro ao remover currículo:', error);
                                                showMessage('Erro ao remover currículo. Tente novamente.', 'error');
                                            }
                                        }}
                                        className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center transform hover:scale-105 font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remover Currículo
                                    </button>
                                </>
                            ) : (
                                <label
                                    htmlFor="curriculo-input"
                                    className="cursor-pointer bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] hover:from-[#9B3D26] hover:to-[#7B2D26] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm transform hover:scale-105 font-medium"
                                >
                                    Enviar Currículo
                                </label>
                            )}
                            <input
                                type="file"
                                id="curriculo-input"
                                onChange={(e) => {
                                    handleFileChange(e, 'curriculo');
                                    e.target.value = null; // Clear the input value
                                }}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Certificados */}
            {authInfo?.type !== 'company' && (
                <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Certificados</h2>
                            <p className="text-gray-600 mt-1">Suas certificações profissionais</p>
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                id="certificados-input"
                                onChange={(e) => handleFileChange(e, 'certificados')}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                            />
                            <button 
                                onClick={() => document.getElementById('certificados-input').click()}
                                className="cursor-pointer bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] hover:from-[#9B3D26] hover:to-[#7B2D26] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center transform hover:scale-105 font-medium"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Adicionar Certificado
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {formData.certificados ? (
                            <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-6 border border-gray-200 hover:border-[#7B2D26] transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <div className="flex flex-col">
                                    {/* Cabeçalho do documento */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                            <h3 className="text-xl font-semibold text-gray-800">Certificado Profissional</h3>
                                                <p className="text-gray-600 mt-1">Documento de qualificação profissional</p>
                                            </div>
                                        </div>
                                    
                                    {/* Informações do documento */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-3 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Nome do Arquivo</p>
                                                        <p className="text-base text-gray-700 font-medium">
                                                        {formData.certificados instanceof File ? 
                                                            formData.certificados.name : 
                                                            'Nenhum certificado'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-3 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Tamanho do Arquivo</p>
                                                        <p className="text-base text-gray-700 font-medium">
                                                        {formData.certificados instanceof File ? 
                                                            `${(formData.certificados.size / 1024 / 1024).toFixed(2)} MB` : 
                                                                '0.00mb'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    {/* Botões de ação */}
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => {
                                                if (formData.certificados instanceof File) {
                                                    const url = URL.createObjectURL(formData.certificados);
                                                        window.open(url, '_blank');
                                                    } else {
                                                    downloadFile(formData.certificados, 'certificado');
                                                    }
                                                }}
                                                className="flex-1 cursor-pointer bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] hover:from-[#9B3D26] hover:to-[#7B2D26] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center transform hover:scale-105 font-medium"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                Baixar Certificado
                                            </button>
                                            <button 
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    certificados: null
                                                }));
                                                showMessage('Certificado removido com sucesso!', 'success');
                                            }}
                                                className="flex-1 cursor-pointer bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center border border-gray-200 transform hover:scale-105 font-medium"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        ) : (
                            <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-6 border border-gray-200 text-center">
                                <p className="text-gray-600">Nenhum certificado adicionado ainda.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

              {/* Minhas candidaturas*/}
              <div className="w-full max-w-5xl bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] bg-clip-text text-transparent">Minhas candidaturas</h2>
                    </div>
                </div>

                <div className='md:grid md:grid-cols-2 flex flex-col'>
                    {loadingCandidaturas ? (
                        <div className="text-center py-8 col-span-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7B2D26] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Carregando candidaturas...</p>
                        </div>
                    ) : candidaturas.length > 0 ? (
                        <>
                            {candidaturas.map((candidatura) => (
                                <div
                                    key={candidatura.id}
                                    className="bg-gradient-to-br from-gray-100 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col m-2"
                                >
                                    <div className='flex items-center justify-between mb-2'>
                                        <div className='flex items-center'>
                                            <svg className="w-6 h-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <h1 className='font-semibold text-lg'>
                                                {candidatura.nome_vaga?.length > 30
                                                    ? candidatura.nome_vaga.substring(0, 30) + '...'
                                                    : candidatura.nome_vaga || 'Nome da Vaga Não Informado'}
                                            </h1>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                candidatura.status === 'APROVADO' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : candidatura.status === 'REJEITADO'
                                                    ? 'bg-red-100 text-red-800'
                                                    : candidatura.status === 'EM_ESPERA'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {candidatura.status === 'APROVADO' 
                                                    ? 'Aprovado'
                                                    : candidatura.status === 'REJEITADO'
                                                    ? 'Rejeitado'
                                                    : candidatura.status === 'EM_ESPERA'
                                                    ? 'Em Análise'
                                                    : 'Pendente'}
                                            </div>
                                            <a href={`/vagas?vaga=${candidatura.id_vaga}`} className="text-[#7B2D26] hover:text-[#9B3D26] transition-colors duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-1 text-sm text-gray-600'>
                                        <div className='flex items-center'>
                                            <svg className="w-4 h-4 mr-2 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>Empresa: {candidatura.nome_empresa || 'Não informada'}</span>
                                        </div>
                                        <div className='flex items-center'>
                                            <svg className="w-4 h-4 mr-2 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span>Área: {candidatura.categoria || 'Não informada'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <h1 className="text-gray-700 leading-relaxed col-span-full">Nenhuma candidatura feita!</h1>
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
                                    <>
                                        <div className="mb-6">
                                            <label htmlFor="formacao" className="block text-sm font-medium text-gray-700 mb-2">
                                                Formação Acadêmica
                                            </label>
                                            <input
                                                type="text"
                                                id="formacao"
                                                name="formacao"
                                                value={formData.formacao}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                                placeholder="Ex: Ensino Médio Completo, Graduação em..."
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="area_interesse" className="block text-sm font-medium text-gray-700 mb-2">
                                                Áreas de Interesse
                                            </label>
                                            <input
                                                type="text"
                                                id="area_interesse"
                                                name="area_interesse"
                                                value={formData.area_interesse}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                                placeholder="Ex: Desenvolvimento Web, Marketing Digital, Design Gráfico"
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Separe as áreas por vírgula
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="habilidades" className="block text-sm font-medium text-gray-700 mb-2">
                                                Habilidades
                                            </label>
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                            <input
                                                type="text"
                                                name="cpf"
                                                value={formData.cpf || ''}
                                                onChange={handleInputChange}
                                                maxLength={14}
                                                placeholder="000.000.000-00"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                id="data_nascimento"
                                                name="data_nascimento"
                                                max="2025-12-31"
                                                min="1950-01-01"
                                                required
                                                value={formData.data_nascimento}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            />
                                        </div>
                                    </>
                                ) : null}

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
        </div>
    );
}