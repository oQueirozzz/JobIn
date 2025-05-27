'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function NovaSenha() {
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [codigoVerificacao, setCodigoVerificacao] = useState('');
    const [codigoGerado, setCodigoGerado] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [etapa, setEtapa] = useState(1); // 1: Email, 2: Código de verificação, 3: Nova senha
    const [tempoRestante, setTempoRestante] = useState(0); // Tempo restante em segundos
    const [tokenRedefinicao, setTokenRedefinicao] = useState('')
    const [intervaloId, setIntervaloId] = useState(null); // Novo estado para armazenar o ID do intervalo
    
    // Initialize EmailJS when component mounts
    useEffect(() => {
        try {
            emailjs.init({
                publicKey: 'kCTXmfOIgvcDrME1W'
            });
            console.log('EmailJS inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar EmailJS:', error);
        }

        // Cleanup function para limpar o intervalo quando o componente for desmontado
        return () => {
            if (intervaloId) {
                clearInterval(intervaloId);
            }
        };
    }, [intervaloId]);

    // Função para validar email
    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Função para gerar um código de verificação alfanumérico de 6 caracteres
    const gerarCodigoVerificacao = () => {
        const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluindo caracteres ambíguos como I, O, 0, 1
        let codigo = '';
        for (let i = 0; i < 6; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
    };

    // Função para verificar o código de verificação
    async function verificarCodigo(event) {
        event.preventDefault();

        if (!codigoVerificacao) {
            setTipoMensagem('erro');
            setMensagem('Por favor, informe o código de verificação');
            return;
        }

        // Verificar se o código expirou
        if (tempoRestante <= 0) {
            setTipoMensagem('erro');
            setMensagem('O código de verificação expirou. Por favor, solicite um novo código.');
            return;
        }

        // Verificar se há um código gerado
        if (!codigoGerado) {
            setTipoMensagem('erro');
            setMensagem('Nenhum código foi solicitado. Por favor, solicite um novo código.');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            const codigoDigitado = codigoVerificacao.toUpperCase().trim();
            const codigoCorreto = codigoGerado.toUpperCase().trim();

            // Primeiro verificar se o código está correto localmente
            if (codigoDigitado !== codigoCorreto) {
                setTipoMensagem('erro');
                setMensagem('Código inválido. Por favor, verifique e tente novamente.');
                setCarregando(false);
                return;
            }

            // Se o código estiver correto localmente, prosseguir com a verificação no backend
            const response = await fetch('http://localhost:3001/api/usuarios/verificar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    codigo: codigoDigitado,
                    codigoGerado: codigoCorreto // Enviando o código gerado para comparação no backend
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setTipoMensagem('sucesso');
                setMensagem('Código verificado com sucesso');
                setTokenRedefinicao(data.token); // Salvar o token para usar na redefinição
                setEtapa(3); // Avançar para a etapa de definição de nova senha
                
                // Limpar o intervalo quando o código for verificado com sucesso
                if (intervaloId) {
                    clearInterval(intervaloId);
                    setIntervaloId(null);
                }
            } else {
                setTipoMensagem('erro');
                setMensagem(data.message || 'Erro ao verificar código. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro na verificação:', error);
            setTipoMensagem('erro');
            setMensagem('Erro ao verificar código. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    // Função para solicitar código de verificação
    async function enviarCodigoVerificacao() {
        if (!email) {
            setTipoMensagem('erro');
            setMensagem('Por favor, informe seu email');
            return;
        }

        if (!validarEmail(email)) {
            setTipoMensagem('erro');
            setMensagem('Informe um e-mail válido.');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            // Limpar intervalo anterior se existir
            if (intervaloId) {
                clearInterval(intervaloId);
            }

            // Verificar se o email existe na API - apenas verificação
            const response = await fetch(`http://localhost:3001/api/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim().toLowerCase(),
                    senha: 'verificacao-apenas' // Senha fictícia apenas para verificação
                })
            });

            const data = await response.json();
            
            // Se a resposta contém uma mensagem específica de email não encontrado
            if (data.message && (data.message.includes('não encontrado') || data.message.includes('não cadastrado'))) {
                setTipoMensagem('erro');
                setMensagem('Este e-mail não está cadastrado em nossa base.');
                setCarregando(false);
                return;
            }
            
            // Gerar código de verificação
            const codigo = gerarCodigoVerificacao();
            setCodigoGerado(codigo);
            
            // Enviar o código para o backend para armazenamento
            const solicitarCodigoResponse = await fetch('http://localhost:3001/api/usuarios/solicitar-codigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    codigo: codigo // Enviar o código gerado para o backend
                }),
            });

            // Verificar se o código foi armazenado com sucesso no backend
            const solicitarCodigoData = await solicitarCodigoResponse.json();
            
            if (!solicitarCodigoResponse.ok) {
                setTipoMensagem('erro');
                setMensagem(solicitarCodigoData.message || 'Erro ao gerar código de verificação. Tente novamente.');
                setCarregando(false);
                return;
            }
            
            // Configurar parâmetros para o EmailJS
            const templateParams = {
                to_email: email.trim().toLowerCase(),
                token: codigo,
                name: 'JobIn Support',
                from_email: 'suporte@jobin.com'
            };

            // Enviar email com o código de verificação usando EmailJS
            await emailjs.send(
                'service_r9l70po',
                'template_0t894rd',
                templateParams
            );

            // Definir temporizador para expiração do código (15 minutos = 900 segundos)
            setTempoRestante(900);
            
            // Iniciar contador regressivo
            const novoIntervalo = setInterval(() => {
                setTempoRestante(tempo => {
                    if (tempo <= 1) {
                        clearInterval(novoIntervalo);
                        if (etapa === 2) {
                            setCodigoGerado('');
                            setTipoMensagem('erro');
                            setMensagem('O código de verificação expirou. Por favor, solicite um novo código.');
                        }
                        return 0;
                    }
                    return tempo - 1;
                });
            }, 1000);

            setIntervaloId(novoIntervalo);
            
            setTipoMensagem('sucesso');
            setMensagem('Token enviado para seu email!');
            setEtapa(2); // Avançar para a etapa de verificação de código
        } catch (error) {
            console.error('Erro detalhado:', error);
            setTipoMensagem('erro');
            setMensagem('Erro ao processar sua solicitação. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    // Função para redefinir a senha
    async function redefinirSenha(event) {
        event.preventDefault();

        if (!novaSenha) {
            setTipoMensagem('erro');
            setMensagem('Por favor, informe a nova senha');
            return;
        }

        if (novaSenha.length < 6) {
            setTipoMensagem('erro');
            setMensagem('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (!confirmarSenha) {
            setTipoMensagem('erro');
            setMensagem('Por favor, confirme a nova senha');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setTipoMensagem('erro');
            setMensagem('As senhas não coincidem');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            // Chamar a API para atualizar a senha no backend
            const response = await fetch('http://localhost:3001/api/usuarios/redefinir-senha', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    token: tokenRedefinicao,
                    novaSenha: novaSenha
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Enviar email de confirmação
                const templateParams = {
                    to_email: email.trim().toLowerCase(),
                    name: 'JobIn Support',
                    from_email: 'suporte@jobin.com',
                    message: 'Sua senha foi redefinida com sucesso no JobIn.'
                };
                
                // Usando o padrão correto para EmailJS
                await emailjs.send(
                    'service_r9l70po',
                'template_0t894rd',  // TEMPLATE_ID do EmailJS
                    templateParams
                );
               
                console.log('Email de confirmação enviado para:', email);

                setTipoMensagem('sucesso');
                setMensagem('Senha atualizada com sucesso!');
                
                // Limpar campos e voltar para a etapa inicial após 3 segundos
                setTimeout(() => {
                    setEmail('');
                    setNovaSenha('');
                    setConfirmarSenha('');
                    setCodigoVerificacao('');
                    setCodigoGerado('');
                    setTokenRedefinicao('');
                    window.location.href = '/login';
                }, 3000);
            } else {
                setTipoMensagem('erro');
                setMensagem(data.message || 'Erro ao atualizar senha');
            }

        } catch (error) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao atualizar senha');
            console.error('Redefinição falhou:', error);
        } finally {
            setCarregando(false);
        }
    }

    // Renderização condicional baseada na etapa atual
    const renderizarFormulario = () => {
        switch (etapa) {
            case 1: // Etapa de email
                return (
                    <form className="w-full" onSubmit={(e) => { e.preventDefault(); enviarCodigoVerificacao(); }}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
                                placeholder=" " 
                                required 
                                disabled={carregando} 
                            />
                            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Email
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" 
                            disabled={carregando}
                        >
                            {carregando ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : 'Enviar Código de Verificação'}
                        </button>
                    </form>
                );
            
            case 2: // Etapa de verificação de código
                return (
                    <form className="w-full" onSubmit={verificarCodigo}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="text" 
                                name="codigoVerificacao" 
                                id="codigoVerificacao" 
                                value={codigoVerificacao} 
                                onChange={(e) => setCodigoVerificacao(e.target.value)} 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
                                placeholder=" " 
                                required 
                                disabled={carregando} 
                                maxLength={6}
                            />
                            <label htmlFor="codigoVerificacao" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código de Verificação
                            </label>
                            <p className="mt-1 text-xs text-gray-500">
                                Digite o código alfanumérico de 6 caracteres enviado para seu email
                                {tempoRestante > 0 && (
                                    <span className="ml-1 font-medium text-vinho">
                                        (Expira em: {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')})
                                    </span>
                                )}
                                {tempoRestante <= 0 && (
                                    <span className="ml-1 font-medium text-red-500">
                                        (Código expirado)
                                    </span>
                                )}
                            </p>
                            <button 
                                type="button" 
                                onClick={enviarCodigoVerificacao}
                                className="mt-2 text-vinho hover:underline text-sm"
                                disabled={carregando}
                            >
                                {tempoRestante <= 0 ? 'Reenviar código de verificação' : 'Não recebeu o código? Reenviar'}
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" 
                            disabled={carregando}
                        >
                            {carregando ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : 'Verificar Código'}
                        </button>
                    </form>
                );
            
            case 3: // Etapa de nova senha
                return (
                    <form className="w-full" onSubmit={redefinirSenha}>
                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="password" 
                                name="novaSenha" 
                                id="novaSenha" 
                                value={novaSenha} 
                                onChange={(e) => setNovaSenha(e.target.value)} 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
                                placeholder=" " 
                                required 
                                disabled={carregando} 
                                minLength={6}
                            />
                            <label htmlFor="novaSenha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Nova Senha
                            </label>
                            <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input 
                                type="password" 
                                name="confirmarSenha" 
                                id="confirmarSenha" 
                                value={confirmarSenha} 
                                onChange={(e) => setConfirmarSenha(e.target.value)} 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" 
                                placeholder=" " 
                                required 
                                disabled={carregando} 
                                minLength={6}
                            />
                            <label htmlFor="confirmarSenha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Confirmar Nova Senha
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" 
                            disabled={carregando}
                        >
                            {carregando ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : 'Redefinir Senha'}
                        </button>
                    </form>
                );
            
            default:
                return null;
        }
    };

    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
            <div className="w-[500px] bg-white rounded-lg shadow-xl p-10">

                <div className="flex justify-center mb-6">
                    <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
                    {etapa === 1 && 'Recuperação de Senha'}
                    {etapa === 2 && 'Verificação de Código'}
                    {etapa === 3 && 'Definir Nova Senha'}
                </h2>

                {mensagem && (
                    <div className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mensagem}
                    </div>
                )}

                {renderizarFormulario()}

                <p className="text-sm text-center text-gray-700 mt-6">
                    <a href="/login" className="text-vinho hover:underline">Voltar para o login</a>
                </p>

            </div>
        </section>
    );
}
