'use client';

import { useState } from 'react';
// import emailjs from '@emailjs/browser';

export default function NovaSenha() {
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [codigoVerificacao, setCodigoVerificacao] = useState('');
    const [codigoGerado, setCodigoGerado] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [etapa, setEtapa] = useState(1); // 1: Email, 2: Código de verificação, 3: Nova senha
    const [tempoRestante, setTempoRestante] = useState(0); // Tempo restante em segundos

    // Função para gerar um código de verificação aleatório de 6 dígitos
    const gerarCodigoVerificacao = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Função para solicitar código de verificação
    async function enviarCodigoVerificacao() {
        if (!email) {
            setTipoMensagem('erro');
            setMensagem('Por favor, informe seu email');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            // Gerar código de verificação
            const codigo = gerarCodigoVerificacao();
            setCodigoGerado(codigo);
            
            // Definir tempo de validade (15 minutos)
            const tempoValidade = 15;
            
            // Configurar parâmetros para o EmailJS
            const templateParams = {
                email: email.trim().toLowerCase(),
                to_name: email.split('@')[0],
                verification_code: codigo,
                expiry_time: `${tempoValidade} minutos`,
                message: `Seu código de verificação é: ${codigo}. Este código é válido por ${tempoValidade} minutos. Utilize-o para redefinir sua senha no JobIn.`
            };

            // Enviar email com o código de verificação usando EmailJS
            // Comentando temporariamente o envio de email para evitar o carregamento infinito
            // Quando tiver as credenciais do EmailJS, descomente o código abaixo e substitua pelos valores corretos
            
            const response = await emailjs.send(
                'service_r9l70po',  // Substitua pelo seu SERVICE_ID do EmailJS
                'template_0t894rd',  // Substitua pelo seu TEMPLATE_ID do EmailJS
                templateParams,
                'kCTXmfOIgvcDrME1W'    // Substitua pela sua PUBLIC_KEY do EmailJS
            );
            
            
            // Simulando envio bem-sucedido para fins de teste
            console.log('Código de verificação gerado:', codigo);
            // Simular um pequeno atraso como se estivesse enviando o email
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Definir temporizador para expiração do código (15 minutos = 900 segundos)
            setTempoRestante(900);
            
            // Iniciar contador regressivo
            const intervalo = setInterval(() => {
                setTempoRestante(tempo => {
                    if (tempo <= 1) {
                        clearInterval(intervalo);
                        // Se o usuário ainda estiver na etapa de verificação, invalidar o código
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
            
            setTipoMensagem('sucesso');
            setMensagem('Código de verificação enviado para seu email');
            setEtapa(2); // Avançar para a etapa de verificação de código
        } catch (error) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao enviar código de verificação');
            console.error('Envio de código falhou:', error);
        } finally {
            setCarregando(false);
        }
    }

    // Função para verificar o código informado pelo usuário
    function verificarCodigo(event) {
        event.preventDefault();

        if (!codigoVerificacao) {
            setTipoMensagem('erro');
            setMensagem('Por favor, informe o código de verificação');
            return;
        }

        // Verificar se o código expirou
        if (tempoRestante <= 0 || codigoGerado === '') {
            setTipoMensagem('erro');
            setMensagem('O código de verificação expirou. Por favor, solicite um novo código.');
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            // Verificar se o código informado corresponde ao código gerado
            if (codigoVerificacao === codigoGerado) {
                setTipoMensagem('sucesso');
                setMensagem('Código verificado com sucesso');
                setEtapa(3); // Avançar para a etapa de definição de nova senha
            } else {
                setTipoMensagem('erro');
                setMensagem('Código inválido');
            }
        } catch (error) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao verificar código');
            console.error('Verificação de código falhou:', error);
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

        setCarregando(true);
        setMensagem('');

        try {
            // Aqui você pode implementar a lógica para atualizar a senha no backend
            // Por enquanto, vamos apenas simular uma resposta bem-sucedida
            
            // Simulação de uma chamada de API bem-sucedida
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Enviar email de confirmação
            const templateParams = {
                to_email: email.trim().toLowerCase(),
                to_name: email.split('@')[0],
                message: 'Sua senha foi redefinida com sucesso no JobIn.'
            };
            
            // Comentando temporariamente o envio de email para evitar o carregamento infinito
            // Quando tiver as credenciais do EmailJS, descomente o código abaixo e substitua pelos valores corretos
            
            await emailjs.send(
                'service_r9l70po',  // Substitua pelo seu SERVICE_ID do EmailJS
                'template_0t894rd',  // Substitua pelo seu TEMPLATE_ID do EmailJS
                templateParams,
                'kCTXmfOIgvcDrME1W'    // Substitua pela sua PUBLIC_KEY do EmailJS
            );
           
            
            // Simulando envio bem-sucedido para fins de teste
            console.log('Email de confirmação simulado para:', email);

            setTipoMensagem('sucesso');
            setMensagem('Senha atualizada com sucesso!');
            
            // Limpar campos e voltar para a etapa inicial após 3 segundos
            setTimeout(() => {
                setEmail('');
                setNovaSenha('');
                setCodigoVerificacao('');
                setCodigoGerado('');
                window.location.href = '/login';
            }, 3000);

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
                                Digite o código de 6 caracteres enviado para seu email
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
                            {tempoRestante <= 0 && (
                                <button 
                                    type="button" 
                                    onClick={enviarCodigoVerificacao}
                                    className="mt-2 text-vinho hover:underline text-sm"
                                    disabled={carregando}
                                >
                                    Reenviar código de verificação
                                </button>
                            )}
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
