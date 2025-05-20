'use client';

async function cadEmpresa(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
        // verifique se a rota está correta pode ser que o localhost não seja 3000
        const response = await fetch('http://localhost:3000/empresas/register', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            setResponseContent('Login realizado com sucesso!');
            window.location.href = '/feed'; //verificar qual rota deve ser selecionada
        } else {
            alert(data.mensagem || 'Usuário não encontrado ou senha incorreta');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
}

// modelo base do  formulário: flowbite

export default function cadEmpresas() {
    return (
        <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-xl p-6 sm:p-10 my-20 sm:my-20">
                <div className="flex justify-center mb-6">
                    <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
                </div>

                <form className="w-full" id="cadastroEmpresa" onSubmit={cadEmpresa}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="nome" id="nome" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="nome" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nome da Empresa</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email Corporativo</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="password" name="senha" id="senha" maxLength="8" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="senha" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Senha</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <input type="text" name="cnpj" id="cnpj" maxLength="14" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required />
                        <label htmlFor="cnpj" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">CNPJ</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <textarea name="descricao" id="descricao" maxLength="200" rows="3" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent resize-none border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer" placeholder=" " required></textarea>
                        <label htmlFor="descricao" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Descrição</label>
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <label htmlFor="logo" className="block mb-2 text-sm font-medium text-gray-600">Logo
                            <span className="text-gray-400">(JPG, PNG)</span>
                        </label>
                        <input type="file" name="logo" id="logo" accept="image/*" className="cursor-pointer bg-gray-200 block w-full text-sm text-gray-700 hover:text-red-950 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vinho file:text-black-100 hover:file:bg-vinho/90 transition-colors" required />
                    </div>

                    <button type="submit" className="cursor-pointer text-white bg-vinho font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300">Cadastrar-se</button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">Já possui conta?</p>
                <p className="text-sm text-center text-gray-700 mt-2">Fazer <a href="/login" className="text-vinho">Login</a></p>
            </div>
        </section>

    );
}