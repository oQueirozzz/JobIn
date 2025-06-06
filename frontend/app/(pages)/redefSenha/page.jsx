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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/verificar-codigo`, {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login`, {
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
            const solicitarCodigoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/solicitar-codigo`, {
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

        if (!tokenRedefinicao) {
            setTipoMensagem('erro');
            setMensagem('Token de redefinição inválido. Por favor, solicite um novo código.');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            const dadosRequisicao = {
                email: email.trim().toLowerCase(),
                token: tokenRedefinicao,
                novaSenha: novaSenha
            };

            console.log('Enviando dados para redefinição:', dadosRequisicao);

            // Chamar a API para atualizar a senha no backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/redefinir-senha`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosRequisicao),
            });

            const data = await response.json();
            console.log('Resposta da API:', data);

            if (response.ok) {
                // Enviar email de confirmação
                const templateParams = {
                    to_email: email.trim().toLowerCase(),
                    name: 'JobIn Support',
                    from_email: 'suporte@jobin.com',
                    message: 'Sua senha foi redefinida com sucesso no JobIn.'
                };

                await emailjs.send(
                    'service_r9l70po',
                    'template_0t894rd',
                    templateParams
                );

                console.log('Email de confirmação enviado para:', email);

                setTipoMensagem('sucesso');
                setMensagem('Senha atualizada com sucesso!');

              
                setTimeout(() => {
                    setEmail('');
                    setNovaSenha('');
                    setConfirmarSenha('');
                    setCodigoVerificacao('');
                    setCodigoGerado('');
                    setTokenRedefinicao('');
                    window.location.href = '/config';
                }, 3000);
            } else {
                setTipoMensagem('erro');
                setMensagem(data.message || 'Erro ao atualizar senha');
            }

        } catch (error) {
            console.error('Erro na redefinição:', error);
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao atualizar senha');
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
        <>
            <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
                <div className="w-[500px] bg-white rounded-lg shadow-xl p-10">

                    <div className="flex justify-center mb-6">
                        <svg width="auto" height="60" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="#7B2D26" />
                            <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="#7B2D26" />
                            <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="#7B2D26" />
                            <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="#7B2D26" />
                            <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="#7B2D26" />
                            <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="#7B2D26" />
                        </svg>
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
                        <a href="/config" className="text-vinho hover:underline">Voltar para configurações</a>
                    </p>

                </div>
            </section>
        </>
    );
}
