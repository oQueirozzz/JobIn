'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../hooks/useAuth';
import {
  Search,
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Settings
} from "lucide-react";

// Componente NavItem
function NavItem({ icon, label, count = null, href }) {
  return (
    <Link href={href} className="flex flex-col items-center px-3 h-14 relative group text-gray-200 hover:text-white transition-colors">
      <div className="relative mt-2">
        {icon}
        {count && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
      
      {/* Barra animada */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left scale-x-0 transition-all duration-200 group-hover:scale-x-100" />
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname();
  const { logout, authInfo } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'vaga', message: 'Sua candidatura para Desenvolvedor Frontend foi aceita!', time: 'Há 2 horas' },
    { id: 2, type: 'mensagem', message: 'Nova mensagem de Tech Solutions', time: 'Há 5 horas' },
    { id: 3, type: 'sistema', message: 'Complete seu perfil para aumentar suas chances', time: 'Há 1 dia' }
  ]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  if (pathname === '') {
    return null;
  }

  const usuario = authInfo?.entity;

  return (
    <header className="sticky top-0 z-50 bg-[#7B2D26] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo e Busca */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="transform transition-transform duration-200 ">
              <div className="w-20 h-20 sm:w-24 sm:h-24">
                <img src="img/global/logo_completa_branca.svg" alt="JobIn" className="w-full h-full" />
              </div>
            </Link>
            <div className="hidden md:block relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
              <input
                type="text"
                placeholder="Pesquisar vagas, pessoas, empresas..."
                className="bg-white/10 text-white placeholder-gray-300 rounded-full pl-10 pr-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Menu Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2 rounded-lg  transition-colors"
              aria-label="Menu"
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${showMobileMenu ? 'rotate-45 top-3' : 'top-1'}`} />
                <span className={`absolute h-0.5 w-6 bg-white top-3 transition-all duration-300 ${showMobileMenu ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${showMobileMenu ? '-rotate-45 top-3' : 'top-5'}`} />
              </div>
            </button>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              <NavItem 
                icon={<Home className="h-5 w-5" />} 
                label="Início" 
                href="/dashboard"
              />
              <NavItem 
                icon={<Briefcase className="h-5 w-5" />} 
                label="Vagas" 
                href="/vagas"
              />
              <NavItem 
                icon={<MessageSquare className="h-5 w-5" />} 
                label="Mensagens" 
                href="/chat"
              />
              
              {/* Notificações */}
              <div className="relative">
                <div 
                  className="flex flex-col items-center px-3 text-gray-200 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="relative mt-2">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <span className="text-xs mt-1">Notificações</span>
                </div>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-sm">Notificações</h3>
                    </div>
                    {notifications.map(notification => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            notification.type === 'vaga' ? 'bg-green-500' :
                            notification.type === 'mensagem' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`} />
                          <div>
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link href="/notificacoes" className="text-[#7B2D26] text-sm font-medium hover:underline w-full text-center block">
                        Ver todas as notificações
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Perfil */}
              <div className="relative">
                <div 
                  className="flex flex-col items-center px-3 text-gray-200 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mt-2 hover:ring-2 hover:ring-white/20 transition-all">
                    {usuario?.foto_perfil ? (
                      <Image
                        src={usuario.foto_perfil}
                        alt={usuario.nome}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white text-[#7B2D26] text-center text-sm font-bold leading-8">
                        {getInitials(usuario?.nome || 'U')}
                      </div>
                    )}
                  </div>
                  <div className="text-xs mt-1 flex items-center">
                    Eu <ChevronDown className="h-3 w-3 ml-0.5" />
                  </div>
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          {usuario?.foto_perfil ? (
                            <Image
                              src={usuario.foto_perfil}
                              alt={usuario.nome}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#7B2D26] text-white text-center text-sm font-bold leading-10">
                              {getInitials(usuario?.nome || 'U')}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{usuario?.nome || 'Usuário'}</p>
                          <p className="text-xs text-gray-500">{usuario?.email || ''}</p>
                        </div>
                      </div>
                    </div>
                    <Link href="/perfil" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                      <User className="h-4 w-4 mr-2" /> Ver perfil
                    </Link>
                    <Link href="/configuracoes" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                      <Settings className="h-4 w-4 mr-2" /> Configurações
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      <div 
        className={`md:hidden bg-[#7B2D26] border-t border-white/10 transition-all duration-300 ease-in-out transform origin-top ${
          showMobileMenu ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-4 py-2 space-y-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full bg-white/10 text-white placeholder-gray-300 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/20 transition-all duration-200"
            />
          </div>
          <div className="space-y-1">
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Home className="h-5 w-5 mr-3" />
              Início
            </Link>
            <Link 
              href="/vagas" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Vagas
            </Link>
            <Link 
              href="/chat" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Mensagens
            </Link>
            <Link 
              href="/notificacoes" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Bell className="h-5 w-5 mr-3" />
              Notificações
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>
            <Link 
              href="/perfil" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <User className="h-5 w-5 mr-3" />
              Perfil
            </Link>
            <Link 
              href="/configuracoes" 
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Settings className="h-5 w-5 mr-3" />
              Configurações
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}




