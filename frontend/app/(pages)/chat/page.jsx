'use client'

export default function chat() {

    function alternarDisplay() {

        const sideBar = document.getElementById('sideBar');

        if (sideBar.style.display === 'none' || sideBar.style.display === '') {
            sideBar.style.display = 'block';
        } else {
            sideBar.style.display = 'none';
        }
    }


    return (
        <>
            <div className="flex h-screen overflow-hidden mt-15">
                {/* Sidebar */}
                <div className="w-1/6 bg-white hidden" id="sideBar">
                    {/* Sidebar Header */}
                    <div className="py-4 border-b-vinho flex justify-center items-center bg-[#F9F5EF] text-red-900 border-r border-e-red-900">
                        <h1 className="text-2xl font-semibold">Conversas</h1>

                    </div>

                    {/* Contact List: só 1 contato */}
                    <div className="overflow-y-auto h-screen p-3 mb-9 pb-20  bg-[#F9F5EF] border-r border-red-900 ">
                        <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md bg-white ">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-1 ">

                                <h2 className="text-lg font-semibold ">Alice</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 ">
                    {/* Chat Header */}
                    <header className="text-white p-4 bg-red-900 flex justify-between ">
                        <h1 className="text-2xl font-semibold">Nome</h1>
                        <button onClick={alternarDisplay} className="cursor-pointer hover:text-green-300" type="button">teste</button>
                    </header>

                    {/* Chat Messages */}
                    <div className="h-screen overflow-y-auto p-4 pb-36 bg-[#F8F5F2] ">
                        {/* Incoming Message */}
                        <div className="flex mb-4 ">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2 ">
                                <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                            </div>
                            <div className="flex max-w-96 bg-bege  rounded-lg p-3 gap-3">
                                <p className="text-white">Hey Bob, how's it going?</p>
                            </div>
                        </div>

                        {/* Outgoing Message */}
                        <div className="flex justify-end mb-4">
                            <div className="flex max-w-96 bg-vinho text-white rounded-lg p-3 gap-3">
                                <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
                            </div>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full" />
                            </div>
                        </div>

                       
                    </div>
                     {/* Chat Input */}
                     <footer className="fixed bottom-0 w-full py-4 flex items-center justify-center bg-[#F9F5EF] border-t border-red-900 gap-3.5">
                            <textarea
                                rows={1}
                                className="resize-none w-full max-w-[800px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-900"
                                placeholder="Digite aqui..."
                                maxLength={200}
                            />
                            <button className="cursor-pointer rounded bg-[#7B2D26] px-6 py-2 text-white hover:bg-red-950 focus:outline-none focus:ring-2">
                                Enviar
                            </button>
                        </footer>
                </div>
            </div>

        </>
    )
}