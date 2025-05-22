export default function () {
    return (
        <>
            <section className="bg-gradient-to-b from-[#e8edf1] to-[#ffffff] py-20 px-4 h-200 lg:flex-row items-center justify-center">
                <div className="max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-center gap-12 h-full">

                    <div className="flex flex-col lg:block items-center justify-center h-screen lg:h-auto px-4">
                        <div className="text-center lg:text-left max-w-lg">
                            <img
                                className="w-60 mx-auto lg:mx-0 mb-6 drop-shadow-md"
                                src="/img/global/logo_completa.svg"
                                alt="Logo da empresa"
                            />
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                                Página não encontrada
                            </h1>
                            <p className="text-gray-600 text-base lg:text-lg mb-6">
                                Desculpe, não conseguimos encontrar a página que você está procurando.<br />
                                Talvez ela tenha sido movida ou esteja temporariamente indisponível.
                            </p>
                            <a
                                href="/"
                                className="inline-block text-white bg-[#7A3E3E] hover:bg-[#5e2f2f] focus:ring-4 focus:outline-none focus:ring-[#caa] font-medium rounded-lg text-sm px-6 py-3 transition"
                            >
                                Voltar para a página inicial
                            </a>
                        </div>
                    </div>


                    <div className="max-w-sm hidden lg:block">
                        <img src="/img/404/celular.svg" alt="Celular ilustrativo" className="w-full" />
                    </div>

                </div>
            </section>

        </>

    );
}
