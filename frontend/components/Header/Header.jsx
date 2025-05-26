'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
function NavItem({ icon, label, count = null }) {
  return (
    <div className="flex flex-col items-center px-3 h-14 relative group text-gray-200 hover:text-white transition-colors">
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
    </div>
  )
}

export default function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'vaga', message: 'Sua candidatura para Desenvolvedor Frontend foi aceita!', time: 'Há 2 horas' },
    { id: 2, type: 'mensagem', message: 'Nova mensagem de Tech Solutions', time: 'Há 5 horas' },
    { id: 3, type: 'sistema', message: 'Complete seu perfil para aumentar suas chances', time: 'Há 1 dia' }
  ]);

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData && usuarioData !== 'undefined') {
      try {
        setUsuario(JSON.parse(usuarioData));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }, []);

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
    return (
      <header className="sticky top-0 z-50 bg-[#7B2D26] shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" className="transform hover:scale-105 transition-transform duration-200">
            <div className="w-30 h-30">
              <img src="./img/global/logo_completa_branca.svg" alt="JobIn" className="w-full h-full" />
            </div>
          </Link>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-hover:text-white transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar vagas, pessoas, empresas..."
              className="bg-white/10 text-white placeholder-gray-300 rounded-full pl-10 pr-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/20 transition-all duration-200"
            />
          </div>
        </div>

        <nav className="flex items-center">
          <div className="flex items-center space-x-1">
            <NavItem icon={<Home className="h-5 w-5 cursor-pointer" />} label="Início" />
            <NavItem  icon={<Briefcase className="h-5 w-5 cursor-pointer" />} label="Vagas" />
            <NavItem icon={<MessageSquare className="h-5 w-5 cursor-pointer" />} label="Mensagens" />
            
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
                    <button className="text-[#7B2D26] text-sm font-medium hover:underline w-full text-center">
                      Ver todas as notificações
                    </button>
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
                <div className="w-8 h-8 rounded-full bg-white text-[#7B2D26] text-center text-sm font-bold leading-8 mt-2 hover:ring-2 hover:ring-white/20 transition-all">
                  {usuario ? getInitials(usuario.nome) : 'U'}
                </div>
                <div className="text-xs mt-1 flex items-center">
                  Eu <ChevronDown className="h-3 w-3 ml-0.5" />
                </div>
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-sm">{usuario?.nome || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{usuario?.email || ''}</p>
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
    </header>
    )
  }




