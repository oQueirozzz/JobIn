'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Cookies from 'js-cookie';
import Alert from '../../../components/Alert';

export default function CadastroEmpresas() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cnpj: '',
        local: '',
        descricao: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const router = useRouter();
    const { login, refreshAuthInfo } = useAuth();

    // Função de validação de CNPJ
    const validarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14) {
            return false;
        }

        // Elimina CNPJs com todos os dígitos iguais
        if (/^(\d)\1{13}$/.test(cnpj)) {
            return false;
        }

        // Valida os dígitos verificadores
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0))) {
            return false;
        }

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(1))) {
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cnpj') {
            // Remove caracteres não numéricos
            const cnpjLimpo = value.replace(/\D/g, '');
            
            const cnpjLimitado = cnpjLimpo.slice(0, 14);
            
           
            let cnpjFormatado = cnpjLimitado;
            if (cnpjLimitado.length > 2) {
                cnpjFormatado = cnpjLimitado.slice(0, 2) + '.' + cnpjLimitado.slice(2);
            }
            if (cnpjLimitado.length > 5) {
                cnpjFormatado = cnpjFormatado.slice(0, 6) + '.' + cnpjFormatado.slice(6);
            }
            if (cnpjLimitado.length > 8) {
                cnpjFormatado = cnpjFormatado.slice(0, 10) + '/' + cnpjFormatado.slice(10);
            }
            if (cnpjLimitado.length > 12) {
                cnpjFormatado = cnpjFormatado.slice(0, 15) + '-' + cnpjFormatado.slice(15);
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: cnpjFormatado
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCloseAlert = () => {
        setMensagem('');
        setTipoMensagem('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        setMensagem('');
        setTipoMensagem('');

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            setIsLoading(false);
            return;
        }

        if (formData.senha.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        // Validar CNPJ antes de enviar
        const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
        if (!validarCNPJ(cnpjLimpo)) {
            setError('CNPJ inválido. Por favor, verifique o número e tente novamente.');
            setIsLoading(false);
            return;
        }

        try {
            // Formatar o CNPJ para ter 14 dígitos (adicionar zeros à esquerda se necessário)
            if (cnpjLimpo.length !== 14) { // Esta validação agora é redundante com validarCNPJ, mas mantida por segurança
                setError('CNPJ deve conter 14 dígitos');
                setIsLoading(false);
                return;
            }

            console.log('Enviando dados para registro:', {
                nome: formData.nome,
                email: formData.email,
                cnpj: cnpjLimpo,
                local: formData.local || '',
                descricao: formData.descricao,
                tipo: 'empresa'
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/empresas/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    cnpj: cnpjLimpo,
                    local: formData.local || '',
                    descricao: formData.descricao,
                    tipo: 'empresa'
                })
            });

            const data = await response.json();
            console.log('Resposta do servidor:', data);
            console.log('Status da resposta:', response.status);

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar empresa');
            }

            setTipoMensagem('success');
            setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');

            // Usar os dados retornados do registro para login automático
            const { token, empresa } = data;

            if (token && empresa) {
                localStorage.setItem('authToken', token);
                localStorage.setItem('authEntity', JSON.stringify({
                    ...empresa,
                    tipo: 'empresa'
                }));
                localStorage.setItem('authType', 'empresa');
                Cookies.set('authToken', token, { expires: 7 }); // Ajuste conforme a duração do token

                refreshAuthInfo(); // Atualiza o estado global de autenticação

                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                console.error('Dados de autenticação incompletos na resposta de registro:', data);
                setMensagem('Cadastro realizado com sucesso! Redirecionando para o login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Erro detalhado:', error);
            setError(error.message || 'Erro ao cadastrar empresa');
            setTipoMensagem('error');
            setMensagem(error.message || 'Erro ao cadastrar empresa. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Alert
                message={mensagem}
                type={tipoMensagem}
                onClose={handleCloseAlert}
                duration={5000}
            />
            <div className="w-full max-w-4xl mb-10 mt-20">
                {/* Logo e Título */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#7B2D26]">Expanda sua empresa</h1>
                    <p className="text-gray-600 mt-2">Cadastre-se e encontre os melhores talentos</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Coluna da Esquerda - Informações da Empresa */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-[#7B2D26] mb-6 pb-2 border-b border-gray-200">
                                    Informações da Empresa
                                </h2>

                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome da Empresa
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            required
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Nome da sua empresa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Corporativo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="contato@empresa.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2 ">
                                        CNPJ
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="cnpj"
                                            name="cnpj"
                                            required
                                            value={formData.cnpj}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="00.000.000/0000-00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-2">
                                        Localização
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="local"
                                            name="local"
                                            required
                                            value={formData.local}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Cidade, Estado"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coluna da Direita - Descrição e Segurança */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-[#7B2D26] mb-6 pb-2 border-b border-gray-200">
                                    Sobre a Empresa
                                </h2>

                                <div>
                                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição da Empresa
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="descricao"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            rows="6"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Descreva brevemente sua empresa, sua missão e valores"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-[#7B2D26] mb-4">Segurança da Conta</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                                                Senha
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="password"
                                                    id="senha"
                                                    name="senha"
                                                    required
                                                    value={formData.senha}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Senha
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="password"
                                                    id="confirmarSenha"
                                                    name="confirmarSenha"
                                                    required
                                                    value={formData.confirmarSenha}
                                                    onChange={handleChange}
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col items-center space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto px-8 py-4 bg-[#7B2D26] text-white rounded-xl font-medium shadow-lg shadow-[#7B2D26]/20 hover:bg-[#9B3D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7B2D26] transition-all duration-300 flex items-center justify-center cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processando...
                                    </>
                                ) : 'Criar Conta'}
                            </button>

                            <p className="text-sm text-gray-600">
                                Já possui uma conta?{' '}
                                <a href="/login" className="text-[#7B2D26] font-medium hover:text-[#9B3D36] transition-colors duration-300">
                                    Faça login
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}