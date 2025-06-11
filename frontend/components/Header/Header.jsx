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
  Settings,
  Trash2,
  Check,
  X
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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  console.log('[Header] authInfo:', authInfo);

  // Função para buscar notificações
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Header] Erro ao buscar notificações:', response.status, errorData);
        // Set notifications to an empty array to prevent render errors
        setNotifications([]);
        setUnreadCount(0);
        return; // Stop further processing
      }

      const data = await response.json();
      console.log('[Header] Fetched notifications data:', data);

      // Ensure data is an array before using filter
      if (Array.isArray(data)) {
        setNotifications(data);
        // Conta apenas as notificações não lidas para o contador
        setUnreadCount(data.filter(notification => !notification.lida).length);
      } else {
        console.error('[Header] Fetched data is not an array:', data);
        // Set notifications to an empty array to prevent render errors
        setNotifications([]);
        setUnreadCount(0);
      }

    } catch (error) {
      console.error('[Header] Erro na requisição de notificações:', error);
      // Set notifications to an empty array in case of network errors etc.
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (authInfo?.entity?.id) {
      // Busca inicial
      fetchNotifications();

      // Atualiza a cada 5 segundos
      const interval = setInterval(fetchNotifications, 5 * 1000);

      // Adiciona listener para o evento personalizado
      const handleNotificationUpdate = () => {
        fetchNotifications();
      };

      window.addEventListener('notificationUpdate', handleNotificationUpdate);

      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      };
    }
  }, [authInfo?.entity?.id]);

  // Função para disparar evento de atualização
  const triggerNotificationUpdate = () => {
    window.dispatchEvent(new Event('notificationUpdate'));
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes/${notificationId}/marcar-lida`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes/usuario/${authInfo.entity.id}/marcar-todas-lidas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ').filter(p => p.length > 0);
    let initials = '';
    if (parts.length > 0) {
      initials += parts[0][0]; // First initial of the first name
      if (parts.length > 1) {
        initials += parts[1][0]; // First initial of the first surname
      }
    }
    return initials.toUpperCase();
  };

  const handleLogout = () => {
    logout();
  };

  // Format notification date and time with -3 hours offset
  const formatNotificationTimestamp = (timestamp) => {
    try {
      const notificationDate = new Date(timestamp);
      // Subtract 3 hours as requested
      notificationDate.setHours(notificationDate.getHours() - 3);
      const formattedDate = notificationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const formattedTime = notificationDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      console.error('[Header] Error formatting timestamp:', error, timestamp);
      return 'Invalid Date'; // Return a fallback in case of errors
    }
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
                <svg width="full" height="full" viewBox="0 0 830 330" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.73333 2.00283C7.33333 3.0695 4.13333 5.8695 2.66667 8.2695C0 12.6695 0 14.6695 0 165.336C0 314.003 0.133333 318.136 2.53333 321.87C7.73333 329.603 0.666667 329.203 141.467 329.336C271.467 329.336 271.6 329.336 275.2 326.536C283.067 320.27 282.667 329.87 282.667 164.403C282.667 14.5362 282.667 12.6695 280 8.2695C274.667 -0.397169 280.933 0.00283113 141.067 0.00283113C34.9333 0.136164 13.3333 0.402831 9.73333 2.00283ZM237.6 31.8695C239.6 33.6028 241.467 93.6028 242.133 178.67C242.933 269.203 242.267 290.27 238.267 294.27C234.8 297.736 220.4 298.803 163.333 299.47C103.2 300.27 50.6667 298.003 47.0667 294.27C44.4 291.603 41.6 259.87 40.5333 220.27L39.6 184.003H51.6C65.0667 184.003 90.5333 187.203 101.333 190.27C122.8 196.403 136 206.67 136 217.47C136 218.936 134.533 222.403 132.667 225.203C129.2 230.936 117.733 237.336 111.067 237.336C109.067 237.336 105.067 238.003 102.267 238.803C93.3333 241.203 90.9333 252.27 97.7333 258.803C100.4 261.336 101.733 261.47 110.667 260.936C120.533 260.27 123.2 259.603 134.133 254.536C146.133 249.07 155.733 237.07 160.267 222.003C166 202.403 168.667 166.67 167.467 121.336C166.933 102.67 166 80.1362 165.333 71.3362C164.533 62.5362 163.467 50.1362 162.933 43.6028C162.4 37.2028 162.4 31.4695 163.067 30.8028C164.267 29.6028 236.133 30.5362 237.6 31.8695Z" fill="white" />
                  <path d="M556 164.003V232.003H569.2H582.533L582.933 227.069L583.333 222.136L587.2 225.736C592.267 230.403 603.867 234.669 611.867 234.669C619.867 234.669 632.133 230.536 640 225.203C656.4 214.003 664.667 190.003 659.333 169.336C654.933 152.536 648 143.469 633.867 136.536C617.867 128.536 602.533 128.669 590.533 136.803C586.8 139.336 583.467 141.336 583.2 141.336C582.933 141.336 582.667 131.069 582.667 118.669V96.0028H569.333H556V164.003ZM619.733 157.203C629.333 162.136 634.667 171.336 634.667 182.936C634.667 196.269 626.533 206.669 614 209.469C603.2 211.869 595.6 209.736 589.067 202.536C586.267 199.469 584 195.869 584 194.536C584 193.203 583.467 191.736 582.667 191.336C580.4 189.869 581.2 176.669 583.867 170.269C588.4 159.603 595.867 154.803 607.733 154.669C612.133 154.669 616.667 155.603 619.733 157.203Z" fill="white" />
                  <path d="M385.333 144.669C385.333 194.136 385.067 196.403 379.467 202.136C370.8 210.669 355.067 209.603 344.4 199.736C342.8 198.269 340.933 197.203 340.267 197.469C339.6 197.736 335.6 202.136 331.467 207.203L323.867 216.403L327.6 220.403C343.067 236.536 373.733 239.469 392.933 226.403C400.533 221.336 407.333 212.936 410.133 205.469C412.133 200.136 412.533 192.403 413.067 148.269L413.6 97.3361H399.467H385.333V144.669Z" fill="white" />
                  <path d="M680 164.669V232.003H694H708V164.669V97.3361H694H680V164.669Z" fill="white" />
                  <path d="M472.933 132.003C456.133 136.269 441.6 149.203 435.6 165.336C432.533 173.736 432.533 192.003 435.733 200.003C440.933 213.203 448.667 222.269 459.6 227.736C482.533 239.336 505.333 235.869 523.467 218.003C530.267 211.203 532 208.669 534.4 200.803C543.333 172.403 532.4 147.203 505.867 135.069C497.2 131.203 482.133 129.736 472.933 132.003ZM497.333 157.336C510.667 164.136 515.467 182.536 507.867 197.603C502.8 207.469 489.733 212.669 478 209.336C460.267 204.403 453.333 181.869 464.4 165.203C470.8 155.603 486.533 151.869 497.333 157.336Z" fill="white" />
                  <path d="M782 131.869C775.467 133.469 769.6 137.069 764.267 142.669C761.6 145.603 758.933 148.003 758.4 148.003C757.733 148.003 757.333 144.403 757.333 140.003V132.003H744H730.667V182.003V232.003H744H757.333V204.003C757.333 173.069 757.6 171.603 765.867 162.936C771.733 156.669 776.133 154.669 784.533 154.669C790.8 154.669 792.267 155.203 795.733 158.536C800.933 163.736 801.333 167.069 801.333 202.269V232.003H815.333H829.333V205.603C829.333 163.869 827.2 153.203 816.533 141.336C808.8 132.803 794.533 128.803 782 131.869Z" fill="white" />
                </svg>

              </div>
            </Link>

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
            <div className="flex items-center space-x-1 ">
              <NavItem
                icon={<Home className="h-5 w-5 mt-1" />}
                label="Início"
                href="/dashboard"
              />
              <NavItem
                icon={<Briefcase className="h-5 w-5 mt-1" />}
                label="Vagas"
                href="/vagas"
              />
              {/* Notificações */}
              <div className="relative">
                <div
                  className="flex flex-col items-center px-3 text-gray-200 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="relative mt-2">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1">Notificações</span>
                </div>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-sm">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          Nenhuma notificação
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start flex-1">
                                <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.tipo === 'PERFIL_VISITADO' ? 'bg-purple-500' :
                                    notification.tipo === 'CANDIDATURA_CRIADA' ? 'bg-blue-500' :
                                      notification.tipo === 'CANDIDATURA_REMOVIDA' ? 'bg-red-500' :
                                        notification.tipo === 'CANDIDATURA_APROVADA' ? 'bg-green-500' :
                                          notification.tipo === 'VAGA_EXCLUIDA' ? 'bg-red-500' :
                                            notification.tipo === 'VAGA_ATUALIZADA' ? 'bg-yellow-500' :
                                              notification.tipo === 'VAGA_CRIADA' ? 'bg-green-500' :
                                                'bg-gray-500'
                                  }`} />
                                <div className="flex-1">
                                  <p className="text-sm">
                                    {authInfo?.entity?.tipo === 'empresa'
                                      ? notification.mensagem_empresa
                                      : notification.mensagem_usuario}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {/* Use the raw timestamp string, which is already in ISO 8601 UTC format */}
                                    {console.log('[Header] Raw notification timestamp:', notification.data_notificacao)}
                                    {formatNotificationTimestamp(notification.data_notificacao)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-2">
                                <button
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Excluir notificação"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
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
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 hover:ring-white/30 transition-all duration-200">
                    {/* Always display initials */}
                    <div className="w-full h-full bg-[#7B2D26] text-white text-center text-lg font-bold leading-10">
                      {authInfo?.entity ? getInitials(authInfo.entity.nome) : 'U'}
                    </div>
                  </div>
                  <div className="text-xs mt-1 flex items-center">
                    Eu <ChevronDown className="h-3 w-3 ml-0.5" />
                  </div>
                </div>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-100">
                          {/* Always display initials */}
                          <div className="w-full h-full bg-[#7B2D26] text-white text-center text-lg font-bold leading-10">
                            {getInitials(authInfo?.entity?.nome || 'U')}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{authInfo?.entity?.nome || 'Usuário'}</p>
                          <p className="text-xs text-gray-500">{authInfo?.entity?.email || ''}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={authInfo?.entity?.tipo === 'empresa' ? "/perfil-empresa" : "/perfil"}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <User className="h-4 w-4 mr-2" /> Ver perfil
                    </Link>
                    <Link href="/config" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
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
        className={`md:hidden bg-[#7B2D26] border-t border-white/10 transition-all duration-300 ease-in-out transform origin-top ${showMobileMenu ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
      >
        <div className="px-4 py-2 space-y-2">

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
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-3 w-full text-white hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <Bell className="h-5 w-5 mr-3" />
              Notificações
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden">
                  {/* Header do Modal */}
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold">Notificações</h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Lista de notificações */}
                  <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-gray-500 text-center">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 mr-3 ${notification.tipo === 'PERFIL_VISITADO'
                                    ? 'bg-purple-500'
                                    : notification.tipo === 'CANDIDATURA_CRIADA'
                                      ? 'bg-blue-500'
                                      : notification.tipo === 'CANDIDATURA_REMOVIDA'
                                        ? 'bg-red-500'
                                        : notification.tipo === 'CANDIDATURA_APROVADA'
                                          ? 'bg-green-500'
                                          : notification.tipo === 'VAGA_EXCLUIDA'
                                            ? 'bg-red-500'
                                            : notification.tipo === 'VAGA_ATUALIZADA'
                                              ? 'bg-yellow-500'
                                              : notification.tipo === 'VAGA_CRIADA'
                                                ? 'bg-green-500'
                                                : 'bg-gray-500'
                                  }`}
                              />
                              <div className="flex-1">
                                <p className="text-sm">
                                  {authInfo?.entity?.tipo === 'empresa'
                                    ? notification.mensagem_empresa
                                    : notification.mensagem_usuario}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatNotificationTimestamp(notification.data_notificacao)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              <button
                                onClick={e => handleDeleteNotification(notification.id, e)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                title="Excluir notificação"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            <Link
              href={authInfo?.entity?.tipo === 'empresa' ? "/perfil-empresa" : "/perfil"}
              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <User className="h-5 w-5 mr-3" />
              Perfil
            </Link>
            <Link
              href="/config"
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




