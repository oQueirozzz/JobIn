'use client'

import { useState } from 'react';

export default function Chat() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'other', text: 'Olá! Como posso ajudar?' }
    ]);

    const [input, setInput] = useState('');

    function handleSend(event) {
        event.preventDefault();
        if (input.trim() === '') return;

        setMessages(prev => [
            ...prev,
            { id: Date.now(), sender: 'me', text: input.trim() }
        ]);

        setInput('');

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, sender: 'other', text: 'Recebi sua mensagem!' }
            ]);
        }, 1000);
    }

    function handleImageUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result;
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    sender: 'me',
                    text: '',
                    image: imageUrl,
                }
            ]);
        };
        reader.readAsDataURL(file);
    }

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
            <div className="flex h-screen overflow-hidden mt-15 relative">
                {/* Sidebar */}
                <div
                    className="fixed top-0 left-0 z-40 w-64 h-full bg-white hidden md:static md:block md:w-1/6 transition-transform"
                    id="sideBar"
                >
                    <div className="py-4 border-b border-vinho flex text-center justify-center items-center bg-[#F8F5F2] border-r border-r-red-900 h-14">
                        <h1 className="text-1xl font-semibold text-vinho">Mensagens</h1>
                    </div>
                    <div className="overflow-y-auto h-full p-3 mb-9 pb-20 bg-[#F8F5F2] border-r border-red-900">
                        <div className="flex items-center mb-4 cursor-pointer p-2 rounded-md bg-[#D7C9AA] hover:shadow-lg transition-shadow duration-300">
                            <div className="mr-3">
                                <img
                                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                                    alt="User Avatar"
                                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg text-white font-semibold">Alice</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Chat*/}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <header className="text-white p-4 bg-red-900 flex justify-between">
                        <h1 className="text-1xl font-semibold">Alice</h1>
                        <button
                            onClick={alternarDisplay}
                            className="cursor-pointer hover:text-green-300"
                            type="button"
                        >
                            <img className="h-6" src="/img/chat/contact.svg" alt="" />
                        </button>
                    </header>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 pb-36 bg-[#F8F5F2]">
                        {messages.map((msg) =>
                            msg.sender === 'other' ? (
                                <div key={msg.id} className="flex mb-4">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                        <img
                                            src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </div>
                                    <div className="bg-bege rounded-lg p-3 gap-3 text-black inline-block max-w-[75%] break-words">
                                        {msg.image ? (
                                            <img
                                                src={msg.image}
                                                alt="uploaded"
                                                className="rounded-lg max-w-xs"
                                            />
                                        ) : (
                                            <p>{msg.text}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div key={msg.id} className="flex justify-end mb-4">
                                    <div className="bg-vinho text-white rounded-lg p-3 gap-3 inline-block max-w-[500px] h-auto break-words">
                                        {msg.image ? (
                                            <img
                                                src={msg.image}
                                                alt="uploaded"
                                                className="rounded-lg max-w-xs"
                                            />
                                        ) : (
                                            <p>{msg.text}</p>
                                        )}
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                        <img
                                            src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                                            alt="My Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Chat Input */}
                    <form
                        onSubmit={handleSend}
                        className="fixed bottom-0 w-full py-4 flex items-center justify-center bg-transparent"
                    >
                        <label htmlFor="chat" className="sr-only">
                            Digite aqui...
                        </label>
                        <div className="flex items-center px-3 py-2 rounded-4xl bg-[#F9F5EF] w-full max-w-[800px] border border-red-900">
                            <button
                                type="button"
                                className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100"
                                onClick={() => document.getElementById('imageUpload')?.click()}
                            >
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 18"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                                    />
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                                    />
                                </svg>
                                <span className="sr-only">Upload image</span>
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                id="imageUpload"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                            <textarea
                                id="chat"
                                rows={1}
                                className="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                maxLength={200}
                            />
                            <button
                                type="submit"
                                className="inline-flex justify-center p-2 text-red-900 rounded-full cursor-pointer hover:bg-blue-100"
                            >
                                <svg
                                    className="w-5 h-5 rotate-90"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 20"
                                >
                                    <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                                </svg>
                                <span className="sr-only">Send message</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
