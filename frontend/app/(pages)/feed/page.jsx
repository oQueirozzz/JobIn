import Image from "next/image"
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Grid,
  ChevronDown,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  ChevronRight,
} from "lucide-react"

export default function LinkedInClone() {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0a66c2" className="w-full h-full">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
            </div>
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
              <NavItem icon={<Bell className="h-5 w-5" />} label="Notificações" count={10} />
              <ProfileNavItem />

              <div className="h-14 border-r border-gray-200 mx-1"></div>

              <NavItem
                icon={<Grid className="h-5 w-5" />}
                label={
                  <div className="flex items-center">
                    Para negócios <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                }
              />
              <div className="text-sm text-amber-700 text-center px-2">
                <p>Experimente por BRLO</p>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex">
        {/* Left Sidebar */}
        <div className="w-[225px] flex-shrink-0 mr-6">
          <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            <div className="relative h-20 bg-[#a0b4b7]"></div>
            <div className="text-center -mt-10 px-4 pb-4">
              <div className="inline-block rounded-full bg-[#f04c84] text-white w-20 h-20 text-center text-3xl font-bold leading-[5rem]">
                R
              </div>
              <h2 className="font-semibold text-lg mt-2">Renan Queiroz</h2>
              <p className="text-sm text-gray-600 mt-1">Aluno do Colégio Integrado Diadema</p>
              <p className="text-xs text-gray-500 mt-1">São Paulo, São Paulo</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <div className="bg-red-600 w-4 h-4 rounded mr-1"></div>
                <span>Senai São Paulo</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conexões</span>
                <span className="text-blue-600 font-medium">8</span>
              </div>
              <p className="text-xs text-gray-500">Amplie sua rede</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-3">
              <p className="text-sm text-gray-600">Acesse ferramentas e insights exclusivos</p>
              <div className="flex items-center mt-2">
                <div className="w-4 h-4 bg-amber-600 mr-2"></div>
                <p className="text-xs">Experimente o Premium por BRLO</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="py-2">
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">🔖</div>} label="Itens salvos" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">👥</div>} label="Grupos" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">📰</div>} label="Newsletters" />
              <SidebarItem icon={<div className="w-4 h-4 text-gray-600">📅</div>} label="Eventos" />
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 max-w-[550px]">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#f04c84] text-white text-center text-xl font-bold leading-[3rem] mr-2">
                  R
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

          {/* Sort Options */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex-1 border-b border-gray-300"></div>
            <div className="px-2 text-xs text-gray-500">
              Classificar por: <span className="font-medium">Populares</span> <ChevronDown className="inline h-3 w-3" />
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow mb-4 p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Sugestões</span>
              <div className="flex">
                <MoreHorizontal className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-xl">&times;</span>
              </div>
            </div>
          </div>

          {/* Post */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex items-start">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Profile picture"
                  width={48}
                  height={48}
                  className="rounded-full mr-2"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Luciano Rocha</h3>
                      <p className="text-xs text-gray-500">
                        Desenvolvedor Full Stack | PHP | C# | React | Angular | APIs RESTful | SQL...
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>5 d • </span>
                        <span className="ml-1">🌎</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="text-blue-600 font-medium text-sm flex items-center">+ Seguir</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm">Por que seu CV some nos processos seletivos? 🤔</p>
                <p className="text-sm mt-2">Você aplica, aplica, aplica... e nunca recebe uma resposta? ...mais</p>
              </div>

              <div className="mt-4 flex justify-center space-x-4">
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 rounded-full p-2">
                    <span className="text-white text-2xl">✕</span>
                  </div>
                  <Image
                    src="/placeholder.svg?height=250&width=180"
                    alt="Bad resume example"
                    width={180}
                    height={250}
                    className="border border-gray-300 rounded"
                  />
                </div>
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full p-2">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <Image
                    src="/placeholder.svg?height=250&width=180"
                    alt="Good resume example"
                    width={180}
                    height={250}
                    className="border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <span className="flex">
                    <span className="inline-block w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                    <span className="inline-block w-4 h-4 rounded-full bg-green-500 border-2 border-white -ml-1"></span>
                    <span className="inline-block w-4 h-4 rounded-full bg-red-500 border-2 border-white -ml-1"></span>
                  </span>
                  <span className="ml-1">2.000</span>
                </div>
                <div className="ml-auto">
                  <span>99 comentários • 65 compartilhamentos</span>
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

          {/* Company Post */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-900 flex items-center justify-center text-white font-bold mr-2">
                  ESEG
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">Faculdade ESEG - Grupo Etapa</h3>
                      <p className="text-xs text-gray-500">4.400 seguidores</p>
                      <p className="text-xs text-gray-500">Promovido</p>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] flex-shrink-0 ml-6">
          {/* LinkedIn News */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">LinkedIn Notícias</h2>
                <div className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
                  i
                </div>
              </div>
              <h3 className="font-medium text-sm mb-1">Assuntos em alta</h3>

              <NewsItem title="Gripe aviária no Brasil: últimas notícias" info="há 1 h • 19.192 leitores" />
              <NewsItem title="Guia para recém-formados 2025" info="há 6 h • 4.039 leitores" />
              <NewsItem title="Experiências curtas no CV?" info="há 6 h • 11.484 leitores" />
              <NewsItem title="Cursos para início de carreira do Link..." info="há 6 h • 395 leitores" />
              <NewsItem title="Final da Kings League" info="há 21 h • 354 leitores" />

              <button className="text-gray-500 text-sm mt-2 flex items-center">
                Exibir mais <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Games */}
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4">
              <h2 className="font-semibold mb-3">Jogos de hoje</h2>

              <GameItem
                name="Zip"
                description="Concluir rota"
                icon={<div className="w-8 h-8 bg-orange-500 rounded"></div>}
              />
              <GameItem
                name="Tango"
                description="Harmonizar grade"
                icon={<div className="w-8 h-8 bg-blue-200 rounded"></div>}
              />
              <GameItem
                name="Queens"
                description="Colorir cada região"
                icon={
                  <div className="w-8 h-8 bg-yellow-200 rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
                    <div className="bg-pink-300"></div>
                    <div className="bg-blue-300"></div>
                    <div className="bg-green-300"></div>
                    <div className="bg-yellow-300"></div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Hiring Banner */}
          <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="See who's hiring on LinkedIn"
              width={300}
              height={200}
              className="w-full"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">See who's hiring on LinkedIn.</h2>
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 text-xs text-gray-500">
            <p>Experimente o LinkedIn no</p>
          </div>
        </div>
      </main>

      {/* Messaging */}
      <div className="fixed bottom-0 right-4 flex items-center">
        <div className="bg-white rounded-t-lg shadow-lg p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#f04c84] text-white text-center text-sm font-bold leading-8 mr-2">
            R
          </div>
          <span className="font-medium">Mensagens</span>
          <MoreHorizontal className="h-5 w-5 ml-2" />
        </div>
      </div>
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

function ProfileNavItem() {
  return (
    <div className="flex flex-col items-center px-3 text-gray-500">
      <div className="w-6 h-6 rounded-full bg-[#f04c84] text-white text-center text-xs font-bold leading-6 mt-2">R</div>
      <div className="text-xs mt-1 flex items-center">
        Eu <ChevronDown className="h-3 w-3 ml-0.5" />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center px-4 py-2 hover:bg-gray-100">
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

function GameItem({ name, description, icon }) {
  return (
    <div className="flex items-center justify-between mb-3 hover:bg-gray-100 p-2 rounded">
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
