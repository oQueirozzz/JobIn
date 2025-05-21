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
} from "lucide-react";

export default function Feed() {
  const [usuario, setUsuario] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);
  const [perfilCompleto, setPerfilCompleto] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center space-x-2">
            <Link href="/feed">
              <div className="w-8 h-8">
                <img src="/img/global/logo_icon.svg" alt="JobIn" className="w-full h-full" />
              </div>
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar"
                className="bg-[#eef3f8] rounded-md pl-10 pr-4 py-2 w-64 text-sm focus:outline-none"
              />
            </div>
          </div>

          <nav className="flex items-center">
            <div className="flex items-center">
              <NavItem icon={<Home className="h-5 w-5" />} label="Início" active />
              <NavItem icon={<Users className="h-5 w-5" />} label="Minha rede" />
              <NavItem icon={<Briefcase className="h-5 w-5" />} label="Vagas" />
              <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Mensagens" />
              <NavItem icon={<Bell className="h-5 w-5" />} label="Notificações" count={3} />
              
              {/* Perfil com Dropdown */}
              <div className="relative">
                <div 
                  className="flex flex-col items-center px-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-6 h-6 rounded-full bg-vinho text-white text-center text-xs font-bold leading-6 mt-2">
                    {usuario ? getInitials(usuario.nome) : 'U'}
                  </div>
                  <div className="text-xs mt-1 flex items-center">
                    Eu <ChevronDown className="h-3 w-3 ml-0.5" />
                  </div>
                </div>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-sm">{usuario?.nome || 'Usuário'}</p>
                      <p className="text-xs text-gray-500">{usuario?.email || ''}</p>
                    </div>
                    <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="h-4 w-4 mr-2" /> Ver perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
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
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row">
        {/* Left Sidebar - Perfil Resumido */}
        <div className="w-full md:w-[225px] flex-shrink-0 md:mr-6 mb-4 md:mb-0">
          <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            <div className="relative h-20 bg-[#a0b4b7]"></div>
            <div className="text-center -mt-10 px-4 pb-4">
              <div className="inline-block rounded-full bg-vinho text-white w-20 h-20 text-center text-3xl font-bold leading-[5rem]">
                {usuario ? getInitials(usuario.nome) : 'U'}
              </div>
              <h2 className="font-semibold text-lg mt-2">{usuario?.nome || 'Usuário'}</h2>
              <p className="text-sm text-gray-600 mt-1">{usuario?.formacao || 'Adicione sua formação'}</p>
              
              {!perfilCompleto && (
                <div className="mt-3 bg-amber-50 p-2 rounded-md text-xs text-amber-800">
                  Seu perfil está incompleto. 
                  <Link href="/perfil" className="text-vinho font-medium ml-1">Complete agora</Link>
                </div>
              )}
            </div>
          </div>

          {/* Conexões */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conexões</span>
                <span className="text-blue-600 font-medium">12</span>
              </div>
              <p className="text-xs text-gray-500">Amplie sua rede</p>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="bg-white rounded-lg shadow">
            <div className="py-2">
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">🔖</div>} label="Itens salvos" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">📝</div>} label="Candidaturas" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">📊</div>} label="Estatísticas" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">📅</div>} label="Eventos" />
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 max-w-full md:max-w-[550px]">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-vinho text-white text-center text-xl font-bold leading-[3rem] mr-2">
                  {usuario ? getInitials(usuario.nome) : 'U'}
                </div>
                <div className="flex-1">
                  <button className="w-full text-left px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-500">
                    Comece uma publicação
                  </button>
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <div className="text-green-600 mr-1">📹</div>
                  <span className="text-sm">Vídeo</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <div className="text-blue-500 mr-1">🖼️</div>
                  <span className="text-sm">Foto</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <div className="text-orange-500 mr-1">📝</div>
                  <span className="text-sm">Escrever artigo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Vagas Recomendadas */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Vagas recomendadas para você</h2>
            </div>
            
            {vagasRecomendadas.map(vaga => (
              <div key={vaga.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-start">
                  <Image 
                    src={vaga.logo} 
                    alt={vaga.empresa} 
                    width={48} 
                    height={48} 
                    className="rounded mr-3" 
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{vaga.titulo}</h3>
                    <p className="text-sm text-gray-600">{vaga.empresa}</p>
                    <p className="text-xs text-gray-500">{vaga.local}</p>
                    <p className="text-xs text-gray-500 mt-1">{vaga.salario}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vaga.requisitos.map((req, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
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
            
            <div className="p-3 text-center">
              <Link href="/vagas" className="text-vinho text-sm font-medium hover:underline flex items-center justify-center">
                Ver todas as vagas <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Feed de Publicações */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex items-start">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Foto de perfil"
                  width={48}
                  height={48}
                  className="rounded-full mr-2"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">JobIn</h3>
                      <p className="text-xs text-gray-500">
                        Plataforma de empregos para estudantes
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>1 d • </span>
                        <span className="ml-1">🌎</span>
                      </div>
                    </div>
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
                  className="w-full rounded"
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

              <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <ThumbsUp className="h-5 w-5 mr-1" />
                  <span className="text-sm">Gostei</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm">Comentar</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <Share2 className="h-5 w-5 mr-1" />
                  <span className="text-sm">Compartilhar</span>
                </button>
                <button className="flex items-center text-gray-600 hover:bg-gray-100 px-2 py-1 rounded">
                  <Send className="h-5 w-5 mr-1" />
                  <span className="text-sm">Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[300px] flex-shrink-0 md:ml-6">
          {/* Completar Perfil */}
          {!perfilCompleto && (
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Complete seu perfil</h2>
                  <X className="h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-vinho h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <p className="text-sm text-gray-600 mt-3">
                  Um perfil completo aumenta suas chances de ser encontrado por recrutadores.
                </p>
                
                <Link href="/perfil" className="mt-3 block text-center bg-vinho text-white rounded-full py-2 text-sm font-medium">
                  Completar perfil
                </Link>
              </div>
            </div>
          )}

          {/* Notícias */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Notícias do mercado</h2>
                <div className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
                  i
                </div>
              </div>

              <NewsItem 
                title="Mercado de TI segue aquecido em 2023" 
                info="há 2h • 1.245 leitores" 
              />
              <NewsItem 
                title="Novas tendências em entrevistas de emprego" 
                info="há 5h • 876 leitores" 
              />
              <NewsItem 
                title="Como se destacar no LinkedIn" 
                info="há 1d • 3.421 leitores" 
              />

              <button className="text-gray-500 text-sm mt-2 flex items-center">
                Exibir mais <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Cursos Recomendados */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <h2 className="font-semibold mb-3">Cursos recomendados</h2>

              <CourseItem
                name="Desenvolvimento Web Completo"
                description="Aprenda HTML, CSS, JavaScript e mais"
                icon={<div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">W</div>}
              />
              <CourseItem
                name="UX/UI Design"
                description="Fundamentos de design de interfaces"
                icon={<div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white font-bold">D</div>}
              />
              <CourseItem
                name="Marketing Digital"
                description="Estratégias para redes sociais"
                icon={<div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold">M</div>}
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
      className={`flex flex-col items-center px-3 h-14 ${active ? "text-black border-b-2 border-black" : "text-gray-500"}`}
    >
      <div className="relative mt-2">
        {icon}
        {count && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  )
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
      {icon}
      <span className="ml-2 text-sm">{label}</span>
    </div>
  )
}

function NewsItem({ title, info }) {
  return (
    <div className="mb-3">
      <div className="flex items-start">
        <span className="text-sm mr-2">•</span>
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xs text-gray-500">{info}</p>
        </div>
      </div>
    </div>
  )
}

function CourseItem({ name, description, icon }) {
  return (
    <div className="flex items-center justify-between mb-3 hover:bg-gray-100 p-2 rounded cursor-pointer">
      <div className="flex items-center">
        {icon}
        <div className="ml-2">
          <h4 className="text-sm font-medium">{name}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  )
}
