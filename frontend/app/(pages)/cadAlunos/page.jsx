'use client';

import { useState } from 'react';

export default function cadAlunos() {
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [tipoMensagem, setTipoMensagem] = useState(''); // 'sucesso' ou 'erro'

    async function cadAluno(event) {
        event.preventDefault();
        setCarregando(true);
        setMensagem('');

        const formData = new FormData(event.target);
        
        // Processar o CPF para remover caracteres não numéricos
        let cpf = formData.get('cpf');
        if (cpf) {
            cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            formData.set('cpf', cpf); // Atualiza o CPF no FormData
        }
        
        // Validação básica
        const senha = formData.get('senha');
        if (senha && senha.length < 6) {
            setTipoMensagem('erro');
            setMensagem('A senha deve ter pelo menos 6 caracteres.');
            setCarregando(false);
            return;
        }
        
        if (cpf && cpf.length !== 11) {
            setTipoMensagem('erro');
            setMensagem('O CPF deve conter 11 dígitos numéricos.');
            setCarregando(false);
            return;
        }
        
        try {
            // Convertendo os dados do formulário para um objeto para enviar como JSON
            // O backend não está configurado para processar FormData com arquivos
            const dadosCadastro = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                senha: formData.get('senha'),
                cpf: cpf,
                data_nascimento: formData.get('data_nascimento'),
                formacao: formData.get('formacao'),
                area_interesse: formData.get('area_interesse'),
                habilidades: formData.get('habilidades'),
                descricao: formData.get('descricao')
                // Arquivos serão tratados separadamente em uma implementação futura
            };
            
            console.log('Enviando dados de cadastro do aluno:', dadosCadastro);
            
            const response = await fetch('http://localhost:3001/api/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosCadastro),
            });

            console.log('Status da resposta:', response.status);
            console.log('Headers da resposta:', Object.fromEntries(response.headers));
            
            const data = await response.json();
            console.log('Dados da resposta:', data);

            if (response.ok) {
                setTipoMensagem('sucesso');
                setMensagem('Cadastro realizado com sucesso!');
                
                // Armazenar informações do usuário
                // O backend retorna diretamente os dados do usuário, não dentro de um objeto 'usuario'
                console.log('Dados do usuário para armazenar:', data);
                localStorage.setItem('usuario', JSON.stringify(data));
                
                // Redirecionar após um breve delay para mostrar a mensagem de sucesso
                setTimeout(() => {
                    window.location.href = '/feed';
                }, 1500);
            } else {
                setTipoMensagem('erro');
                console.error('Erro no cadastro do aluno:', data);
                // Exibir mensagem de erro mais detalhada
                if (data.error && typeof data.error === 'object') {
                    // Se o erro for um objeto com múltiplos campos
                    const errorMessages = Object.values(data.error).join(', ');
                    setMensagem(errorMessages || data.message || data.mensagem || 'Erro ao realizar cadastro. Tente novamente.');
                } else {
                    setMensagem(data.message || data.mensagem || data.error || 'Erro ao realizar cadastro. Tente novamente.');
                }
            }
        } catch (error) {
            setTipoMensagem('erro');
            console.error('Exceção durante o cadastro do aluno:', error);
            // Melhorar a mensagem de erro para o usuário
            if (error.message) {
                setMensagem(`Erro ao conectar com o servidor: ${error.message}`);
            } else {
                setMensagem('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
            }
        } finally {
            setCarregando(false);
        }
    }
    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 sm:p-10 my-20 sm:my-20">
                <div className="flex justify-center mb-6">
                    <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
                </div>

                {mensagem && (
                    <div className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {mensagem}
                    </div>
                )}

                <form className="w-full" id="cadastroAluno" onSubmit={cadAluno}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="nome" id="nome" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="password" name="senha" id="senha" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
                        <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres recomendado</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input type="text" name="cpf" id="cpf" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                            <label htmlFor="cpf" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">CPF</label>
                            <p className="mt-1 text-xs text-gray-500">Digite apenas números (11 dígitos)</p>
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input type="date" name="data_nascimento" id="data_nascimento" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                            <label htmlFor="data_nascimento" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Data de Nascimento</label>
                        </div>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="formacao" id="formacao" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="formacao" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Formação</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="area_interesse" id="area_interesse" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="area_interesse" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Área de Interesse</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <textarea name="habilidades" id="habilidades" maxLength={50} rows="3" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent resize-none border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " ></textarea>
                        <label htmlFor="habilidades" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Habilidades</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <textarea name="descricao" id="descricao" maxLength={200} rows="3" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent resize-none border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " ></textarea>
                        <label htmlFor="descricao" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Descrição</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="curriculo" className="block mb-2 text-sm font-medium text-gray-600">Currículo <span className="text-gray-400">(PDF)</span></label>
                        <input type="file" name="curriculo" id="curriculo" accept=".pdf" className="cursor-pointer bg-gray-200 block w-full text-sm text-gray-700 hover:text-red-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vinho file:text-black-100 hover:file:bg-vinho/90 transition-colors"/>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="foto" className="block mb-2 text-sm font-medium text-gray-600">Foto <span className="text-gray-400">(JPG, PNG)</span></label>
                        <input type="file" name="foto" id="foto" accept="image/*" className="cursor-pointer bg-gray-200 block w-full text-sm text-gray-700 hover:text-red-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vinho file:text-black-100 hover:file:bg-vinho/90 transition-colors"  />
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="certificados" className="block mb-2 text-sm font-medium text-gray-600">Certificados <span className="text-gray-400">(PDF, ZIP, etc.)</span></label>
                        <input type="file" name="certificados" id="certificados" multiple className="cursor-pointer bg-gray-200 block w-full text-sm text-gray-700 hover:text-red-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vinho file:text-black-100 hover:file:bg-vinho/90 transition-colors" />
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
                        ) : 'Cadastrar-se'}
                    </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">Já possui conta?</p>
                <p className="text-sm text-center text-gray-700 mt-2">Fazer <a href="/login" className="text-vinho">Login</a></p>
            </div>
        </section>

    );
}