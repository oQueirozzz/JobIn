export default function perfil() {
    return (
        <section className="h-screen flex flex-col items-center justify-center space-y-6 bg-branco">

            <div className="w-7/12 h-3/12 bg-white rounded-xl shadow-xl mt-20 flex  items-center justify-center">
                <div className="h-full w-1/3 flex items-center justify-center ">
                    <img className="bg-black w-30 h-30 rounded-full border-3 border-red-900 " src="/img/chat/contact.svg" alt="" />
                </div>
                <div className="h-full min-w-10/12  p-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Seu nome</h1>
                        <h2 className="text-normal flex"><img className="h-5 pr-2" src="/img/perfil/email.svg" alt="" />Email</h2>
                        <h2 className="text-normal">Area de interesse</h2>
                    </div>
                    <button type="button"
                        className="cursor-pointer text-white bg-[#7B2D26] hover:bg-red-800 font-normal rounded-3xl text-sm w-30 px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center" >
                        Editar Perfil
                    </button>
                </div>
            </div>

            <div className="w-7/12 h-2/12 bg-white rounded-xl shadow-xl">

            </div>

            <div className="w-7/12 h-2/12 bg-white rounded-xl shadow-xl">

            </div>

            <div className="w-7/12 h-2/12 bg-white rounded-xl shadow-xl">

            </div>

            <div className="w-7/12 h-1/12 bg-white rounded-xl shadow-xl">

            </div>

            <div className="w-7/12 h-4/12 bg-white rounded-xl shadow-xl mb-20">

            </div>

        </section>
    )
}