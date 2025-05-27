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
    const router = useRouter();
    const { authInfo, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !authInfo) {
            router.push('/login');
            return;
        }

        if (authInfo) {
            const dadosUsuario = authInfo.entity;
            setFormData(dadosUsuario);
            verificarCamposObrigatorios(dadosUsuario);
        }
    }, [authInfo, isLoading, router]);

    const verificarCamposObrigatorios = (dadosUsuario) => {
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
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Garantir que o ID do usuário esteja incluído no corpo da requisição
            const dadosParaEnviar = {
                ...formData,
                id: authInfo.entity.id // Incluir o ID do usuário
            };

            const response = await fetch('http://localhost:3001/api/usuarios/atualizar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(dadosParaEnviar)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil');
            }

            const dadosAtualizados = await response.json();
            verificarCamposObrigatorios(dadosAtualizados);
            setIsModalOpen(false);
            
            // Atualizar o localStorage com os novos dados
            const authEntity = JSON.parse(localStorage.getItem('authEntity'));
            localStorage.setItem('authEntity', JSON.stringify({
                ...authEntity,
                ...dadosAtualizados
            }));

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
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
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-5 py-2 rounded-3xl shadow transition-colors duration-300 flex items-center"
                        >
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
                </div>
                <p className="text-gray-700 text-sm">
                    {usuario.descricao || 'Nenhum resumo profissional informado.'}
                </p>
            </div>

            {/* Formação Acadêmica */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Formação Acadêmica</h2>
                </div>
                <p className="text-gray-700 text-sm">
                    {usuario.formacao || 'Nenhuma formação acadêmica informada.'}
                </p>
            </div>

            {/* Habilidades */}
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Habilidades</h2>
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

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        value={formData.nome || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input
                                        type="tel"
                                        name="telefone"
                                        value={formData.telefone || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Formação Acadêmica</label>
                                    <input
                                        type="text"
                                        name="formacao"
                                        value={formData.formacao || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Área de Interesse</label>
                                    <input
                                        type="text"
                                        name="area_interesse"
                                        value={formData.area_interesse || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades (separadas por vírgula)</label>
                                    <input
                                        type="text"
                                        name="habilidades"
                                        value={formData.habilidades || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Resumo Profissional</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao || ''}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
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
