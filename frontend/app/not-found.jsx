export default function () {
    return (
        <section className="bg-branco h-220 flex items-center justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                <div className="mx-auto max-w-screen-sm text-center grid  place-items-center">
                    <img className="w-100 m-10" src="/img/global/logo_completa.svg" alt="" />
                    <p className="mb-4 text-4xl tracking-tight font-bold text-white md:text-4xl">Desculpe, algo aconteceu!</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-600">Desculpe, não conseguimos encontrar essa página. Você encontrará muito para explorar na página inicial. </p>
                    <a href="/" className="inline-flex text-vinho hover:underline focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-2">Voltar para a página inicial</a>
                </div>
            </div>
        </section>
    );
}