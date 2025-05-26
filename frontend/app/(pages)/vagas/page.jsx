export default function vagas() {
    return (
        <section className=" bg-gray-50 flex flex-col items-center">
            <div className="w-10/12 h-20  bg-white rounded-xl shadow-sm mt-5 border border-gray-100 flex items-center justify-center">
              
            </div>

            <div className="h-auto flex justify-center">
                <div className="w-150 h-auto  m-10 flex flex-col items-center">
                    <div className="w-140 h-60 bg-white rounded-xl shadow-sm  border border-gray-100 p-8 ">
                        <h1 className="font-bold text-2xl">Estágio Anl.Sistemas</h1>
                        <h2 className="text-xl">SENAI</h2>
                        <h2 className="flex pt-2">
                            São Caetano do Sul
                            |
                            <h2 className="pl-2">Presencial</h2>
                        </h2>
                        <h2 className="flex">
                            Area - {/*categoria*/}
                            <h2 className="pl-1.5">Técnologia</h2>
                        </h2>

                        <button className="cursor-pointer mt-6 bg-[#7B2D26] hover:bg-red-800 text-white px-5 py-2 rounded-4xl shadow transition-colors duration-300 flex items-center" type="button">Ver mais...</button>
                    </div>


                </div>


                <div className="w-200 h-150  bg-white rounded-xl shadow-sm  border border-gray-100  m-10 sticky top-25 bottom-25 p-8">
                    <h1 className="font-bold text-4xl">Estágio Anl.Sistemas{/*Nome da vaga */}</h1>
                    <h2 className="text-2xl text-[#7B2D26]">SENAI {/*empresa*/}</h2>
                    <h2 className="flex pt-2  text-xl">
                        São Caetano do Sul{/*cidade */}
                        <h2 className="pl-2 pr-2 text-[#7B2D26]">|</h2>
                        <h2 className="">Presencial{/*tipo de vaga */}</h2>
                    </h2>
                    <h2 className="flex text-lg">
                        Area - {/*categoria*/}
                        <h2 className="pl-1.5">Técnologia</h2>
                    </h2>
                    <hr className="bg-red-900 h-0.5 mt-2" />
                    <p className="w-full h-8/12 pt-2 text-justify">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur fuga asperiores libero architecto. Quibusdam magnam repudiandae sequi! Voluptate quas, ipsum quaerat alias velit distinctio maiores ipsam provident reprehenderit, adipisci omnis? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt impedit aspernatur harum. Eius nobis vitae eligendi, quasi nemo accusantium veritatis neque ullam corporis, accusamus blanditiis autem obcaecati in adipisci alias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam velit iusto eaque, quod nisi illo molestiae voluptas nobis adipisci quia tempore neque voluptatum suscipit inventore similique optio. Doloremque, aliquid voluptate.
                    </p>
                    <button className="cursor-pointer bottom-0 absolute mb-5 bg-[#7B2D26] hover:bg-red-800 text-white px-20 py-2 rounded-4xl shadow transition-colors duration-300 " type="button">Candidatar-me</button>

                </div>
            </div>
        </section>
    )
}