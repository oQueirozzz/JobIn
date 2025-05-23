'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  LogOut,
  User,
  ChevronDown,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  ChevronRight,
  X,
  Settings,
} from "lucide-react";

export default function Feed() {
  const [usuario, setUsuario] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'vaga', message: 'Nova vaga compatível com seu perfil', time: '5m' },
    { id: 2, type: 'mensagem', message: 'Você tem 3 novas mensagens', time: '15m' },
    { id: 3, type: 'conexao', message: '5 novas conexões esta semana', time: '1h' }
  ]);

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo);
        setUsuario(dadosUsuario);
        
        // Verificar se o perfil está completo
        const camposObrigatorios = ['nome', 'email', 'formacao', 'area_interesse', 'habilidades', 'descricao'];
        const perfilIncompleto = camposObrigatorios.some(campo => !dadosUsuario[campo]);
        setPerfilCompleto(!perfilIncompleto);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
    
    // Simular carregamento de vagas recomendadas
    // Em uma implementação real, isso seria uma chamada à API
    const vagasSimuladas = [
      {
        id: 1,
        empresa: 'TechSolutions',
        logo: '/placeholder.svg?height=48&width=48',
        titulo: 'Desenvolvedor Full Stack',
        local: 'São Paulo, SP',
        salario: 'R$ 6.000 - R$ 8.000',
        dataPublicacao: '2 dias atrás',
        requisitos: ['React', 'Node.js', 'MongoDB']
      },
      {
        id: 2,
        empresa: 'Inovação Digital',
        logo: '/placeholder.svg?height=48&width=48',
        titulo: 'UX/UI Designer',
        local: 'Remoto',
        salario: 'R$ 5.000 - R$ 7.000',
        dataPublicacao: '1 semana atrás',
        requisitos: ['Figma', 'Adobe XD', 'Pesquisa de usuário']
      },
    ];
    
    setVagasRecomendadas(vagasSimuladas);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <header className=" shadow-md sticky top-0 z-50 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/feed" className="transform hover:scale-105 transition-transform duration-200">
              <div className="w-10 h-10">
                <img src="/img/global/logo_icon.svg" alt="JobIn" className="w-full h-full" />
              </div>
            </Link>
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-hover:text-vinho transition-colors" />
              <input
                type="text"
                placeholder="Pesquisar vagas, pessoas, empresas..."
                className="bg-[#eef3f8] rounded-full pl-10 pr-4 py-2.5 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-vinho/20 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          <nav className="flex items-center">
            <div className="flex items-center space-x-1">
              <NavItem icon={<Home className="h-5 w-5" />} label="Início" active />
              <NavItem icon={<Users className="h-5 w-5" />} label="Minha rede" />
              <NavItem icon={<Briefcase className="h-5 w-5" />} label="Vagas" />
              <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Mensagens" />
              
              {/* Notificações com Dropdown */}
              <div className="relative">
                <div 
                  className="flex flex-col items-center px-3 text-gray-500 cursor-pointer hover:text-vinho transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <div className="relative mt-2">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </div>
                  <span className="text-xs mt-1">Notificações</span>
                </div>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
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
                      <button className="text-vinho text-sm font-medium hover:underline w-full text-center">
                        Ver todas as notificações
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Perfil com Dropdown */}
              <div className="relative">
                <div 
                  className="flex flex-col items-center px-3 text-gray-500 cursor-pointer hover:text-vinho transition-colors"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-vinho text-white text-center text-sm font-bold leading-8 mt-2 hover:ring-2 hover:ring-vinho/20 transition-all">
                    {usuario ? getInitials(usuario.nome) : 'U'}
                  </div>
                  <div className="text-xs mt-1 flex items-center">
                    Eu <ChevronDown className="h-3 w-3 ml-0.5" />
                  </div>
                </div>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-sm">{usuario?.nome || 'Usuário'}</p>
                      <p className="text-xs text-gray-500">{usuario?.email || ''}</p>
                    </div>
                    <Link href="/perfil" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                      <User className="h-4 w-4 mr-2" /> Ver perfil
                    </Link>
                    <Link href="/configuracoes" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors">
                      <Settings className="h-4 w-4 mr-2" /> Configurações
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className=" w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar - Perfil Resumido */}
        <div className="w-full md:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
            <div className="relative h-24 bg-gradient-to-r from-vinho to-vinho/80"></div>
            <div className="text-center -mt-12 px-4 pb-4">
              <div className="inline-block rounded-full bg-white p-1 shadow-md">
                <div className="w-20 h-20 rounded-full bg-vinho text-white text-center text-2xl font-bold leading-[5rem]">
                  {usuario ? getInitials(usuario.nome) : 'U'}
                </div>
              </div>
              <h2 className="font-semibold text-lg mt-3">{usuario?.nome || 'Usuário'}</h2>
              <p className="text-sm text-gray-600 mt-1">{usuario?.formacao || 'Adicione sua formação'}</p>
              
              {!perfilCompleto && (
                <div className="mt-4 bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Perfil Incompleto</span>
                    <span className="text-amber-600">65%</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-1.5">
                    <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <Link href="/perfil" className="text-vinho font-medium mt-2 block hover:underline">
                    Complete seu perfil
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Conexões */}
          <div className="bg-white rounded-xl shadow-sm mb-4 border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Conexões</span>
                <span className="text-vinho font-medium">12</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Amplie sua rede profissional</p>
            </div>
            <div className="p-3">
              <button className="w-full text-center text-sm text-vinho font-medium hover:bg-vinho/5 py-2 rounded-lg transition-colors">
                Ver todas as conexões
              </button>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="py-2">
              <SidebarItem 
                icon={<div className="w-5 h-5 text-vinho">🔖</div>} 
                label="Itens salvos" 
                count="12"
              />
              <SidebarItem 
                icon={<div className="w-5 h-5 text-vinho">📝</div>} 
                label="Candidaturas" 
                count="5"
              />
              <SidebarItem 
                icon={<div className="w-5 h-5 text-vinho">📊</div>} 
                label="Estatísticas" 
              />
              <SidebarItem 
                icon={<div className="w-5 h-5 text-vinho">📅</div>} 
                label="Eventos" 
                count="3"
              />
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 max-w-full md:max-w-[600px]">
          {/* Create Post */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-vinho text-white text-center text-xl font-bold leading-[3rem] mr-3">
                  {usuario ? getInitials(usuario.nome) : 'U'}
                </div>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  Comece uma publicação
                </button>
              </div>
              <div className="flex justify-between mt-4">
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <div className="text-green-600 mr-2">📹</div>
                  <span className="text-sm">Vídeo</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <div className="text-blue-500 mr-2">🖼️</div>
                  <span className="text-sm">Foto</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <div className="text-orange-500 mr-2">📝</div>
                  <span className="text-sm">Artigo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Modal de Criar Post */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold">Criar publicação</h3>
                  <button 
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="O que você gostaria de compartilhar?"
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-vinho/20 resize-none"
                  />
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      // Lógica para publicar
                      setShowCreatePost(false);
                      setPostContent('');
                    }}
                    className="px-4 py-2 bg-vinho text-white rounded-lg hover:bg-vinho/90 transition-colors"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vagas Recomendadas */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg">Vagas recomendadas para você</h2>
            </div>
            
            {vagasRecomendadas.map(vaga => (
              <div key={vaga.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <Image 
                    src={vaga.logo} 
                    alt={vaga.empresa} 
                    width={48} 
                    height={48} 
                    className="rounded-lg mr-3" 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-base hover:text-vinho transition-colors cursor-pointer">{vaga.titulo}</h3>
                    <p className="text-sm text-gray-600">{vaga.empresa}</p>
                    <p className="text-xs text-gray-500">{vaga.local}</p>
                    <p className="text-xs text-gray-500 mt-1">{vaga.salario}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vaga.requisitos.map((req, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors">
                          {req}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-400">{vaga.dataPublicacao}</span>
                      <button className="text-vinho text-sm font-medium hover:underline">
                        Ver vaga
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 text-center">
              <Link href="/vagas" className="text-vinho text-sm font-medium hover:underline flex items-center justify-center">
                Ver todas as vagas <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Feed de Publicações */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-4">
              <div className="flex items-start">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Foto de perfil"
                  width={48}
                  height={48}
                  className="rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium hover:text-vinho transition-colors cursor-pointer">JobIn</h3>
                      <p className="text-xs text-gray-500">
                        Plataforma de empregos para estudantes
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>1 d • </span>
                        <span className="ml-1">🌎</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm">Bem-vindo à plataforma JobIn! 🚀</p>
                <p className="text-sm mt-2">
                  Estamos felizes em tê-lo conosco. Aqui você encontrará as melhores oportunidades de emprego e estágio para impulsionar sua carreira.
                </p>
              </div>

              <div className="mt-4">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Imagem de boas-vindas"
                  width={500}
                  height={300}
                  className="w-full rounded-lg"
                />
              </div>

              <div className="mt-4 flex items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="flex">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                    <span className="inline-block w-4 h-4 rounded-full bg-green-500 border-2 border-white -ml-1"></span>
                    <span className="inline-block w-4 h-4 rounded-full bg-red-500 border-2 border-white -ml-1"></span>
                  </span>
                  <span className="ml-1">42</span>
                </div>
                <div className="ml-auto">
                  <span>5 comentários • 3 compartilhamentos</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                <button 
                  onClick={() => handleLikePost(1)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    likedPosts[1] ? 'text-vinho bg-vinho/5' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className="h-5 w-5 mr-1" />
                  <span className="text-sm">Gostei</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm">Comentar</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span className="text-sm">Compartilhar</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                  <Send className="h-5 w-5 mr-1" />
                  <span className="text-sm">Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[300px] flex-shrink-0">
          {/* Completar Perfil */}
          {!perfilCompleto && (
            <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Complete seu perfil</h2>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-vinho h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  Um perfil completo aumenta suas chances de ser encontrado por recrutadores.
                </p>
                
                <Link href="/perfil" className="mt-4 block text-center bg-vinho text-white rounded-lg py-2 text-sm font-medium hover:bg-vinho/90 transition-colors">
                  Completar perfil
                </Link>
              </div>
            </div>
          )}

          {/* Notícias */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Notícias do mercado</h2>
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                  i
                </div>
              </div>

              <NewsItem 
                title="Mercado de TI segue aquecido em 2023" 
                info="há 2h • 1.245 leitores" 
                trending={true}
              />
              <NewsItem 
                title="Novas tendências em entrevistas de emprego" 
                info="há 5h • 876 leitores" 
              />
              <NewsItem 
                title="Como se destacar no LinkedIn" 
                info="há 1d • 3.421 leitores" 
                trending={true}
              />

              <button className="text-gray-500 text-sm mt-3 flex items-center hover:text-vinho transition-colors">
                Exibir mais <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Cursos Recomendados */}
          <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="p-4">
              <h2 className="font-semibold mb-3">Cursos recomendados</h2>

              <CourseItem
                name="Desenvolvimento Web Completo"
                description="Aprenda HTML, CSS, JavaScript e mais"
                icon={<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">W</div>}
                progress={75}
              />
              <CourseItem
                name="UX/UI Design"
                description="Fundamentos de design de interfaces"
                icon={<div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>}
                progress={45}
              />
              <CourseItem
                name="Marketing Digital"
                description="Estratégias para redes sociais"
                icon={<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>}
                progress={90}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Components
function NavItem({ icon, label, active = false, count = null }) {
  return (
    <div
      className={`flex flex-col items-center px-3 h-14 ${
        active 
          ? "text-vinho border-b-2 border-vinho" 
          : "text-gray-500 hover:text-vinho transition-colors"
      }`}
    >
      <div className="relative mt-2">
        {icon}
        {count && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}

function SidebarItem({ icon, label, count = null }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-sm">{label}</span>
      </div>
      {count && (
        <span className="text-xs text-gray-500">{count}</span>
      )}
    </div>
  )
}

function NewsItem({ title, info, trending = false }) {
  return (
    <div className="mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-start">
        {trending && (
          <span className="text-red-500 mr-2">🔥</span>
        )}
        <div>
          <h4 className="text-sm font-medium hover:text-vinho transition-colors">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{info}</p>
        </div>
      </div>
    </div>
  )
}

function CourseItem({ name, description, icon, progress = 0 }) {
  return (
    <div className="flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
      <div className="flex items-center">
        {icon}
        <div className="ml-3">
          <h4 className="text-sm font-medium hover:text-vinho transition-colors">{name}</h4>
          <p className="text-xs text-gray-500">{description}</p>
          {progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-vinho h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% completo</p>
            </div>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  )
}
