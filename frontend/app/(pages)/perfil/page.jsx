export default function Perfil() {
    return (
        <section className="min-h-screen flex flex-col items-center bg-[#F0F3F5] px-4 py-10 space-y-6">

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex justify-center items-center">
                    <img className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-red-900" src="/img/chat/contact.svg" alt="Foto de Perfil" />
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Nome do usuário</h1>
                        <h2 className="flex items-center text-gray-700 text-sm mt-1">
                            <img className="h-5 pr-2" src="/img/perfil/email.svg" alt="Email" />
                            teste@email.com
                        </h2>
                    </div>
                    <div className="mt-4 md:mt-0 md:self-end">
                        <button className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-5 py-2 rounded-3xl shadow transition-colors duration-300">
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Resumo Profissional</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <p className="text-gray-700 text-sm">
                    Texto de exemplo do resumo profissional.
                </p>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Formação Acadêmica</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <p className="text-gray-700 text-sm">Texto de exemplo da formação acadêmica.</p>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Habilidades</h2>
                    <button className="cursor-pointer text-sm text-red-900">Editar</button>
                </div>
                <p className="text-gray-700 text-sm">Exemplo de habilidades listadas aqui.</p>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6 flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-base font-semibold mb-4 md:mb-0">Currículo</h2>
                <div className="flex gap-4">
                    <button className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow text-sm">
                        Visualizar PDF
                    </button>
                    <button className="cursor-pointer bg-[#7B2D26] hover:bg-red-800 text-white px-4 py-2 rounded shadow text-sm">
                        Atualizar Currículo
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6 mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold">Minhas Candidaturas</h2>
                    <button className="cursor-pointer text-sm text-red-900">Ver todas</button>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-2">
                    <div>
                        <p className="font-semibold text-sm">Estágio em Desenvolvimento</p>
                        <p className="text-sm text-gray-600">Tech Solutions S/A</p>
                    </div>
                    <span className="mt-2 md:mt-0 px-3 py-1 rounded-full text-sm text-white bg-yellow-400">
                        Revisando CV
                    </span>
                </div>
            </div>
        </section>
    );
}
