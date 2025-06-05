'use client'

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChat, setShowNewChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { authInfo } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const notificationCheckInterval = useRef(null);

    useEffect(() => {
        if (!authInfo?.entity) {
            router.push('/login');
            return;
        }
        fetchConversations();
        startNotificationCheck();
        return () => {
            if (notificationCheckInterval.current) {
                clearInterval(notificationCheckInterval.current);
            }
        };
    }, [authInfo]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            markMessagesAsRead();
        }
    }, [selectedChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch conversations');
            }

            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Erro ao buscar conversas:', error);
            // Show error to user
            alert('Erro ao carregar conversas. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages/${selectedChat.other_user_id}/${selectedChat.other_user_type}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch messages');
            }

            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            // Show error to user
            alert('Erro ao carregar mensagens. Por favor, tente novamente.');
        }
    };

    const handleSend = async (event) => {
        event.preventDefault();
        if (input.trim() === '' || !selectedChat) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    receiver_id: selectedChat.other_user_id,
                    receiver_type: selectedChat.other_user_type,
                    message: input.trim()
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to send message');
            }

            const newMessage = await response.json();
            setMessages(prev => [...prev, newMessage]);
            setInput('');
            fetchConversations();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            // Show error to user
            alert('Erro ao enviar mensagem. Por favor, tente novamente.');
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !selectedChat) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        receiver_id: selectedChat.other_user_id,
                        receiver_type: selectedChat.other_user_type,
                        message: reader.result
                    })
                });

                if (response.ok) {
                    const newMessage = await response.json();
                    setMessages(prev => [...prev, newMessage]);
                    fetchConversations();
                }
            } catch (error) {
                console.error('Erro ao enviar imagem:', error);
            }
        };
        reader.readAsDataURL(file);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR');
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/search?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to search users');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            // Show error to user
            alert('Erro ao buscar usuários. Por favor, tente novamente.');
        } finally {
            setSearchLoading(false);
        }
    };

    const startNewChat = async (userId, userType) => {
        setShowNewChat(false);
        setSearchQuery('');
        setSearchResults([]);

        // Check if conversation already exists
        const existingChat = conversations.find(
            chat => chat.other_user_id === userId && chat.other_user_type === userType
        );

        if (existingChat) {
            setSelectedChat(existingChat);
            return;
        }

        // Create a new chat object
        const newChat = {
            other_user_id: userId,
            other_user_type: userType,
            receiver_name: searchResults.find(r => r.id === userId)?.name,
            receiver_image: searchResults.find(r => r.id === userId)?.image
        };

        setSelectedChat(newChat);
        setMessages([]);
    };

    const startNotificationCheck = () => {
        // Check for new notifications every 30 seconds
        notificationCheckInterval.current = setInterval(fetchNotifications, 30000);
        // Initial fetch
        fetchNotifications();
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes/unread`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data);

            // Show browser notification for new messages
            data.forEach(notification => {
                if (notification.tipo === 'mensagem' && !document.hidden) {
                    new Notification('Nova mensagem', {
                        body: notification.mensagem,
                        icon: notification.remetente_imagem
                    });
                }
            });
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        }
    };

    const markMessagesAsRead = async () => {
        if (!selectedChat) return;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/chat/mark-read/${selectedChat.other_user_id}/${selectedChat.other_user_type}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }
            );

            // Update conversations to reflect read status
            setConversations(prev => prev.map(conv => 
                conv.other_user_id === selectedChat.other_user_id
                    ? { ...conv, unread_count: 0 }
                    : conv
            ));
        } catch (error) {
            console.error('Erro ao marcar mensagens como lidas:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-900"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden mt-15 relative">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 z-40 w-64 h-full bg-white hidden md:static md:block md:w-1/6 transition-transform" id="sideBar">
                <div className="py-4 border-b border-vinho flex text-center justify-center items-center bg-[#F8F5F2] border-r border-r-red-900 h-14">
                    <h1 className="text-1xl font-semibold text-vinho">Conversas</h1>
                </div>
                <div className="overflow-y-auto h-full p-3 mb-9 pb-20 bg-[#F8F5F2] border-r border-red-900">
                    {/* New Chat Button */}
                    <button
                        onClick={() => setShowNewChat(true)}
                        className="w-full mb-4 bg-red-900 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Conversa
                    </button>

                    {/* Conversations List */}
                    {conversations.map((chat) => (
                        <div
                            key={`${chat.other_user_id}-${chat.other_user_type}`}
                            onClick={() => setSelectedChat(chat)}
                            className={`flex items-center mb-4 cursor-pointer p-2 rounded-md hover:shadow-lg transition-shadow duration-300 ${
                                selectedChat?.other_user_id === chat.other_user_id ? 'bg-[#D7C9AA]' : 'hover:bg-gray-100'
                            }`}
                        >
                            <div className="mr-3 relative">
                                <img
                                    src={chat.other_user_type === 'user' ? chat.receiver_image || 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' : chat.receiver_image || 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'}
                                    alt="User Avatar"
                                    className="rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover"
                                />
                                {chat.unread_count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {chat.unread_count}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg text-gray-800 font-semibold">{chat.receiver_name}</h2>
                                <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatTime(chat.last_message_time)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
                {showNewChat ? (
                    <div className="flex-1 flex flex-col bg-[#F8F5F2] p-4">
                        <div className="max-w-2xl mx-auto w-full">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Buscar usuários ou empresas..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-900 focus:border-transparent"
                                />
                            </div>
                            
                            {searchLoading ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-900"></div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {searchResults.map((result) => (
                                        <div
                                            key={`${result.id}-${result.type}`}
                                            onClick={() => startNewChat(result.id, result.type)}
                                            className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <img
                                                src={result.image}
                                                alt={result.name}
                                                className="w-12 h-12 rounded-full object-cover mr-3"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-800">{result.name}</h3>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                        {result.type === 'user' ? 'Usuário' : 'Empresa'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{result.email}</p>
                                                {result.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{result.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
                                        <p className="text-center text-gray-500 py-4">
                                            Nenhum resultado encontrado
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <header className="text-white p-4 bg-red-900 flex justify-between items-center">
                            <div className="flex items-center">
                                <img
                                    src={selectedChat.other_user_type === 'user' ? selectedChat.receiver_image || 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato' : selectedChat.receiver_image || 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <h1 className="text-1xl font-semibold">{selectedChat.receiver_name}</h1>
                            </div>
                            <button
                                onClick={() => document.getElementById('sideBar').style.display = 'none'}
                                className="cursor-pointer hover:text-green-300 md:hidden"
                                type="button"
                            >
                                <img className="h-6" src="/img/chat/contact.svg" alt="" />
                            </button>
                        </header>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 pb-36 bg-[#F8F5F2]">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender_id === authInfo.entity.id;
                                const showDate = index === 0 || formatDate(msg.created_at) !== formatDate(messages[index - 1].created_at);
                                
                                return (
                                    <div key={msg.id}>
                                        {showDate && (
                                            <div className="flex justify-center my-4">
                                                <span className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm">
                                                    {formatDate(msg.created_at)}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                                            {!isMe && (
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                                    <img
                                                        src={msg.sender_image || 'https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'}
                                                        alt="User Avatar"
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                </div>
                                            )}
                                            <div className={`${isMe ? 'bg-vinho text-white' : 'bg-bege text-black'} rounded-lg p-3 gap-3 inline-block max-w-[75%] break-words`}>
                                                {msg.message.startsWith('data:image') ? (
                                                    <img
                                                        src={msg.message}
                                                        alt="uploaded"
                                                        className="rounded-lg max-w-xs"
                                                    />
                                                ) : (
                                                    <p>{msg.message}</p>
                                                )}
                                                <span className="text-xs opacity-70 mt-1 block">
                                                    {formatTime(msg.created_at)}
                                                </span>
                                            </div>
                                            {isMe && (
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                                    <img
                                                        src={authInfo.entity.foto || authInfo.entity.logo || 'https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato'}
                                                        alt="My Avatar"
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form
                            onSubmit={handleSend}
                            className="fixed bottom-0 w-full py-4 flex items-center justify-center bg-transparent"
                        >
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
                                    rows={1}
                                    className="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Digite sua mensagem..."
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
                                    <span className="sr-only">Enviar mensagem</span>
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-[#F8F5F2]">
                        <div className="text-center text-gray-500">
                            <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <p className="text-xl">Selecione uma conversa para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
