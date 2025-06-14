'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';

export default function CadastroAlunos() {
    const cpf = (e) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            const cpfLimpo = value.replace(/\D/g, '').slice(0, 11); // Apenas números, até 11 dígitos

            let cpfFormatado = cpfLimpo;

            if (cpfLimpo.length > 9) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if (cpfLimpo.length > 6) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
            } else if (cpfLimpo.length > 3) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{1,3})/, "$1.$2");
            }

            setFormData(prev => ({
                ...prev,
                [name]: cpfFormatado
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cpf: '',
        data_nascimento: '',
        formacao: '',
        area_interesse: '',
        habilidades: '',
        descricao: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cpf') {
            const cpfLimpo = value.replace(/\D/g, '').slice(0, 11); // Apenas números, até 11 dígitos

            let cpfFormatado = cpfLimpo;

            if (cpfLimpo.length > 9) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if (cpfLimpo.length > 6) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
            } else if (cpfLimpo.length > 3) {
                cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{1,3})/, "$1.$2");
            }

            setFormData(prev => ({
                ...prev,
                [name]: cpfFormatado
            }));
        } else if (name === 'data_nascimento') {
            if (!validarDataNascimento(value, false)) {
                return;
            }
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        if (name === 'data_nascimento') {
            if (!validarDataNascimento(value, true)) {
                setError('Data de nascimento inválida. Deve ser entre 1950 e a data atual.');
                // Resetar para a data anterior válida
                const dataAnterior = formData.data_nascimento;
                setFormData(prev => ({
                    ...prev,
                    [name]: dataAnterior
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

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

        // Validar CPF
        const cpfLimpo = formData.cpf.replace(/\D/g, '');
        if (!validarCPF(cpfLimpo)) {
            setError('CPF inválido');
            setIsLoading(false);
            return;
        }

        // Validar data de nascimento
        if (!formData.data_nascimento) {
            setError('Data de nascimento é obrigatória');
            setIsLoading(false);
            return;
        }

        if (!validarDataNascimento(formData.data_nascimento, true)) {
            setError('Data de nascimento inválida. Deve ser entre 1950 e a data atual.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    cpf: cpfLimpo,
                    data_nascimento: formData.data_nascimento,
                    formacao: formData.formacao,
                    area_interesse: formData.area_interesse,
                    habilidades: formData.habilidades,
                    descricao: formData.descricao
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Erro ao processar resposta do servidor:', jsonError);
                throw new Error('Erro ao processar resposta do servidor. Verifique se o servidor está rodando.');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar usuário');
            }

            setSuccess('Cadastro realizado com sucesso! Redirecionando...');

            try {
                await login(formData.email, formData.senha, 'user');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } catch (loginError) {
                console.error('Erro no login automático:', loginError);
                router.push('/login');
            }

        } catch (error) {
            console.error('Erro detalhado:', error);
            setError(error.message || 'Erro ao cadastrar usuário. Verifique se o servidor está rodando.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-4xl mb-10 mt-20">
                {/* Logo e Título */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#7B2D26]">Comece sua jornada profissional</h1>
                    <p className="text-gray-600 mt-2">Preencha seus dados para criar sua conta</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Coluna da Esquerda - Informações Pessoais */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-[#7B2D26] mb-6 pb-2 border-b border-gray-200">
                                    Informações Pessoais
                                </h2>

                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                                            placeholder="Seu nome completo"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
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
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                                        CPF
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="cpf"
                                            name="cpf"
                                            required
                                            value={formData.cpf}
                                            onChange={cpf}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="000.000.000-00"

                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-2">
                                        Data de Nascimento
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="date"
                                            id="data_nascimento"
                                            name="data_nascimento"
                                            max="2025-12-31"
                                            min="1950-01-01"
                                            required
                                            value={formData.data_nascimento}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Coluna da Direita - Informações Profissionais */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-[#7B2D26] mb-6 pb-2 border-b border-gray-200">
                                    Informações Profissionais
                                </h2>

                                <div>
                                    <label htmlFor="formacao" className="block text-sm font-medium text-gray-700 mb-2">
                                        Formação Acadêmica
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="formacao"
                                            name="formacao"
                                            value={formData.formacao}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Sua formação acadêmica"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="area_interesse" className="block text-sm font-medium text-gray-700 mb-2">
                                        Área de Interesse
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="area_interesse"
                                            name="area_interesse"
                                            required
                                            value={formData.area_interesse}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Sua área de interesse profissional"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="habilidades" className="block text-sm font-medium text-gray-700 mb-2">
                                        Habilidades
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="habilidades"
                                            name="habilidades"
                                            value={formData.habilidades}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Suas habilidades (ex: JavaScript, Python, Design)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                                        Resumo Profissional
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="descricao"
                                            name="descricao"
                                            value={formData.descricao}
                                            onChange={handleChange}
                                            rows="4"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                                            placeholder="Descreva brevemente sua experiência e objetivos profissionais"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção de Senha */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-[#7B2D26] mb-6">Segurança da Conta</h2>
                            <div className="grid md:grid-cols-2 gap-6">
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

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-center">
                                {success}
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