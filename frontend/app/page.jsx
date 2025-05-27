'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header/Header";
import {
  Search,
  Home,
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
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Feed() {
  // Usar estados e informações do hook useAuth
  const { logout, isLoading, isAuthenticated, authInfo } = useAuth();
  const router = useRouter();

  console.log('Feed Render: Início da renderização', { isLoading, isAuthenticated, authInfo: !!authInfo });

  // Estados locais para o Feed
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);
  const [perfilCompleto, setPerfilCompleto] = useState(true); // Assumir completo inicialmente
  const [camposFaltantes, setCamposFaltantes] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'vaga', message: 'Nova vaga compatível com seu perfil', time: '5m' },
    { id: 2, type: 'mensagem', message: 'Você tem 3 novas mensagens', time: '15m' },
    { id: 3, type: 'conexao', message: '5 novas conexões esta semana', time: '1h' }
  ]);
  const [posts, setPosts] = useState([]);
  const [showMoreNews, setShowMoreNews] = useState(false);
  const [news, setNews] = useState([
    { id: 1, title: 'Mercado de TI segue aquecido em 2023', info: 'há 2h • 1.245 leitores', trending: true },
    { id: 2, title: 'Novas tendências em entrevistas de emprego', info: 'há 5h • 876 leitores', trending: false },
    { id: 3, title: 'Como se destacar no LinkedIn', info: 'há 1d • 3.421 leitores', trending: true },
    { id: 4, title: 'Salários em alta para desenvolvedores', info: 'há 3h • 2.156 leitores', trending: false },
    { id: 5, title: 'Empresas buscam profissionais com soft skills', info: 'há 6h • 1.890 leitores', trending: true },
    { id: 6, title: 'Tendências de trabalho remoto em 2024', info: 'há 4h • 3.245 leitores', trending: false },
  ]);

  // Estado para controlar a visibilidade do card "Complete seu perfil"
  const [showCompleteProfile, setShowCompleteProfile] = useState(true);

  // Efeito para lidar com o redirecionamento se não autenticado APÓS o carregamento
  useEffect(() => {
    console.log('Feed useEffect [isLoading, isAuthenticated]: Executando', { isLoading, isAuthenticated });
    // Se o useAuth terminou de carregar E o usuário NÃO está autenticado,
    // redireciona para a dashboard.
    if (!isLoading && !isAuthenticated) {
      console.log('Feed - Usuário não autenticado após loading, redirecionando para /dashboard');
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]); // Dependências: isLoading, isAuthenticated e router

  // Efeito para carregar dados do feed APENAS QUANDO autenticado E loading terminou E authInfo está disponível
  useEffect(() => {
    console.log('Feed useEffect [isLoading, isAuthenticated, authInfo]: Executando', { isLoading, isAuthenticated, authInfo: !!authInfo });
    // Carrega dados apenas se não estiver carregando, estiver autenticado e authInfo.entity for válido
    if (!isLoading && isAuthenticated && authInfo?.entity) {
      console.log('Feed - Usuário autenticado e dados disponíveis, carregando conteúdo do feed...');
      const usuario = authInfo.entity; // Usar os dados do usuário do authInfo

      // --- Lógica de verificação de perfil completo (para candidatos) --- //
      // Só verifica se for candidato
      if (authInfo.entity.tipo !== 'empresa') {
        const camposObrigatorios = {
          nome: 'Nome',
          email: 'Email',
          telefone: 'Telefone',
          formacao: 'Formação Acadêmica',
          area_interesse: 'Área de Interesse',
          habilidades: 'Habilidades',
          descricao: 'Resumo Profissional'
        };

        const camposIncompletos = Object.entries(camposObrigatorios)
          .filter(([campo]) => !usuario[campo])
          .map(([_, label]) => label);

        console.log('Feed - Campos incompletos para candidato:', camposIncompletos);
        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
        setShowCompleteProfile(camposIncompletos.length > 0);
      } else {
         // Se for empresa, o perfil é considerado completo para este card
         setPerfilCompleto(true);
         setCamposFaltantes([]);
         setShowCompleteProfile(false);
      }

      // --- Fim da lógica de verificação de perfil completo --- //

      // --- Lógica de Carregamento de Posts (simulado) --- //
      const carregarPosts = async () => {
        try {
          const postsSimulados = [
            { id: 1, empresa: 'TechSolutions', logo: '/placeholder.svg?height=48&width=48', nome: 'TechSolutions', conteudo: 'Estamos contratando desenvolvedores full stack! Venha fazer parte do nosso time.', imagem: '/placeholder.svg?height=300&width=500', data: '2h atrás', likes: 42, comentarios: 5, compartilhamentos: 3 },
            { id: 2, empresa: 'Inovação Digital', logo: '/placeholder.svg?height=48&width=48', nome: 'Inovação Digital', conteudo: 'Nova vaga de UX/UI Designer disponível! Remoto, horário flexível e ótimos benefícios.', imagem: '/placeholder.svg?height=300&width=500', data: '5h atrás', likes: 28, comentarios: 3, compartilhamentos: 1 }
          ];
          setPosts(postsSimulados);
        } catch (error) {
          console.error('Erro ao carregar posts simulados:', error);
        }
      };
      // --- Fim Lógica de Carregamento de Posts --- //

      // --- Lógica de Carregamento de Vagas Recomendadas (simulado) --- //
      // Só carrega vagas recomendadas se for candidato
      if (authInfo.entity.tipo !== 'empresa') {
        const carregarVagasRecomendadas = async () => {
          try {
            const vagasSimuladas = [
              { id: 1, empresa: 'TechSolutions', logo: '/placeholder.svg?height=48&width=48', titulo: 'Desenvolvedor Full Stack', local: 'São Paulo, SP', salario: 'R$ 6.000 - R$ 8.000', dataPublicacao: '2 dias atrás', requisitos: ['React', 'Node.js', 'MongoDB'] },
              { id: 2, empresa: 'Inovação Digital', logo: '/placeholder.svg?height=48&width=48', titulo: 'UX/UI Designer', local: 'Remoto', salario: 'R$ 5.000 - R$ 7.000', dataPublicacao: '1 semana atrás', requisitos: ['Figma', 'Adobe XD', 'Pesquisa de usuário'] }
            ];
            setVagasRecomendadas(vagasSimuladas);
          } catch (error) {
            console.error('Erro ao carregar vagas recomendadas simuladas:', error);
          }
        };
        carregarVagasRecomendadas();
      } else {
         // Se for empresa, limpar vagas recomendadas (ou carregar vagas da empresa, se aplicável)
         setVagasRecomendadas([]);
      }
      // --- Fim Lógica de Carregamento de Vagas Recomendadas --- //

      // Chamar a função de carregamento de posts (sempre carrega posts, mas a lógica de exibição pode variar)
      carregarPosts();

    } else if (!isLoading && !isAuthenticated) {
      // Este caso deve ser pego pelo primeiro useEffect e redirecionar
      console.log('Feed useEffect [isLoading, isAuthenticated, authInfo]: Não autenticado e loading terminou. Redirecionamento pendente.');
    }
    // Se isLoading for true, não faz nada aqui, o componente mostrará o loading state

  }, [isLoading, isAuthenticated, authInfo]); // Dependências: isLoading, isAuthenticated, authInfo

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLikePost = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCloseCompleteProfile = () => {
    setShowCompleteProfile(false);
  };

  // --- Lógica de Renderização Condicional Principal --- //
  
  console.log('Feed Render: Verificando estado para renderização...', { isLoading, isAuthenticated, authInfo: !!authInfo });

  // 1. Enquanto o useAuth está carregando, sempre mostra o loading
  if (isLoading) {
    console.log('Feed Render: isLoading é true, mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F3F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B2D26] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // 2. Se o useAuth terminou de carregar E NÃO está autenticado,
  //    retorna null. O useEffect de redirecionamento cuidará de enviar para /dashboard.
  if (!isAuthenticated) {
     console.log('Feed Render: Não autenticado após loading, retornando null (redirecionamento para dashboard em andamento)...');
     return null; 
  }

  // 3. Se o useAuth terminou de carregar E está autenticado,
  //    verifica se os dados do usuário estão disponíveis para renderizar o Feed.
  if (isAuthenticated && authInfo?.entity) {
     console.log('Feed Render: Autenticado e dados disponíveis, renderizando Feed...');
     const usuario = authInfo.entity; // Use os dados do usuário do authInfo
     const isCompany = usuario.tipo === 'empresa'; // Determinar se é uma conta de empresa

     // --- Conteúdo do Feed a ser renderizado --- //
     return (
       <div className="min-h-screen bg-gray-50">
         <Header />
         {/* Main Content */}
         <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
           {/* Left Sidebar - Perfil Resumido */}
           <div className="w-full md:w-[300px] flex-shrink-0">
             {/* Completar Perfil - Mostrar apenas se for candidato E perfil incompleto */}
             {/* Verifica se authInfo existe antes de acessar entity?.tipo */} 
             {!isLoading && isAuthenticated && authInfo?.entity?.tipo !== 'empresa' && !perfilCompleto && showCompleteProfile && (
               <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                 <div className="p-4">
                   <div className="flex justify-between items-center mb-3">
                     <h2 className="font-semibold">Complete seu perfil</h2>
                     <button 
                       className="text-gray-400 hover:text-gray-600"
                       onClick={handleCloseCompleteProfile}
                     >
                       <X className="h-4 w-4" />
                     </button>
                   </div>
                   
                   <div className="w-full bg-gray-200 rounded-full h-2">
                     <div 
                       className="bg-[#7B2D26] h-2 rounded-full transition-all duration-300" 
                       style={{ width: `${((7 - camposFaltantes.length) / 7) * 100}%` }} // Assume 7 campos obrigatórios para candidatos
                     ></div>
                   </div>
                   
                   <p className="text-sm text-gray-600 mt-3">
                     Um perfil completo aumenta suas chances de ser encontrado por recrutadores.
                   </p>
                   
                   <Link href="/perfil" className="mt-4 block text-center bg-[#7B2D26] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#7B2D26]/90 transition-colors">
                     Completar perfil
                   </Link>
                 </div>
               </div>
             )}

             

             {/* Vagas Recomendadas - Mostrar apenas para candidatos */}
             {/* Verifica se authInfo existe antes de acessar entity?.tipo */} 
             {!isLoading && isAuthenticated && authInfo?.entity?.tipo !== 'empresa' && (
               <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                 <div className="p-4 border-b border-gray-100">
                   <h2 className="font-semibold text-lg">Vagas recomendadas</h2>
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
                         <h3 className="font-medium text-base hover:text-[#7B2D26] transition-colors cursor-pointer">{vaga.titulo}</h3>
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
                           <button className="text-[#7B2D26] text-sm font-medium hover:underline">
                             Ver vaga
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
                 
                 <div className="p-4 text-center">
                   <Link href="/vagas" className="text-[#7B2D26] text-sm font-medium hover:underline flex items-center justify-center">
                     Ver todas as vagas <ChevronRight className="h-4 w-4 ml-1" />
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

                 {news.slice(0, showMoreNews ? news.length : 3).map(item => (
                   <NewsItem 
                     key={item.id}
                     title={item.title}
                     info={item.info}
                     trending={item.trending}
                   />
                 ))}

                 <button 
                   onClick={() => setShowMoreNews(!showMoreNews)}
                   className="text-gray-500 text-sm mt-3 flex items-center hover:text-[#7B2D26] transition-colors"
                 >
                   {showMoreNews ? 'Mostrar menos' : 'Exibir mais'} <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showMoreNews ? 'rotate-180' : ''}`} />
                 </button>
               </div>
             </div>
           </div>
           

           {/* Center Content - Feed */}
           <div className="flex-1 max-w-full md:max-w-[600px]">
             {/* Create Post - Mostrar apenas para empresas */}
             {/* Verifica se authInfo existe antes de acessar entity?.tipo */} 
             {!isLoading && isAuthenticated && authInfo?.entity?.tipo === 'empresa' && ( /* Renderiza apenas se for empresa */
               <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                 <div className="p-4">
                   <div className="flex items-center">
                     <div className="w-12 h-12 rounded-full bg-[#7B2D26] text-white text-center text-xl font-bold leading-[3rem] mr-3">
                       {/* Mostrar iniciais do usuário logado (ou empresa) */} 
                       {authInfo?.entity ? getInitials(authInfo.entity.nome) : 'U'}
                     </div>
                     <button 
                       onClick={() => setShowCreatePost(true)}
                       className="flex-1 text-left px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                     >
                       Compartilhe uma atualização
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {/* Modal de Criar Post */}
             {showCreatePost && ( /* Renderiza modal apenas se showCreatePost for true */
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
                       className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26]/20 resize-none"
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
                         setShowCreatePost(false);
                         setPostContent('');
                       }}
                       className="px-4 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-[#7B2D26]/90 transition-colors"
                     >
                       Publicar
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {/* Feed de Posts */}
             <div className="space-y-6">
               {posts.map(post => (
                 <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                   <div className="p-4">
                     <div className="flex items-start">
                       {/* Usar avatar do usuário ou logo da empresa */}                  
                       <div className="w-12 h-12 rounded-full bg-[#7B2D26] text-white text-center text-xl font-bold leading-[3rem] mr-3 flex-shrink-0">
                          {getInitials(post.nome)} 
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between">
                           <div>
                             <h3 className="font-medium hover:text-[#7B2D26] transition-colors cursor-pointer">{post.nome}</h3>
                             <p className="text-xs text-gray-500">{post.empresa}</p>
                             <div className="flex items-center text-xs text-gray-500 mt-1">
                               <span>{post.data} • </span>
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
                       <p className="text-sm">{post.conteudo}</p>
                     </div>

                     {post.imagem && (
                       <div className="mt-4">
                         <Image
                           src={post.imagem}
                           alt="Imagem do post"
                           width={500}
                           height={300}
                           className="w-full rounded-lg"
                         />
                       </div>
                     )}

                     <div className="mt-4 flex items-center text-xs text-gray-500">
                       <div className="flex items-center">
                         <span className="flex">
                           <span className="inline-block w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                           <span className="inline-block w-4 h-4 rounded-full bg-green-500 border-2 border-white -ml-1"></span>
                           <span className="inline-block w-4 h-4 rounded-full bg-red-500 border-2 border-white -ml-1"></span>
                         </span>
                         <span className="ml-1">{post.likes}</span>
                       </div>
                       <div className="ml-auto">
                         <span>{post.comentarios} comentários • {post.compartilhamentos} compartilhamentos</span>
                       </div>
                     </div>

                     <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                       <button 
                         onClick={() => handleLikePost(post.id)}
                         className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                           likedPosts[post.id] ? 'text-[#7B2D26] bg-[#7B2D26]/5' : 'text-gray-600 hover:bg-gray-50'
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
               ))}
             </div>
           </div>

           {/* Right Sidebar */}
           <div className="w-full md:w-[280px] flex-shrink-0">
             <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
               <div className="text-center px-4 pt-8 pb-4">
                 {/* Usar dados do usuário do authInfo para a foto e nome */}            
                 <div className="inline-block rounded-full bg-white p-1 shadow-md mx-auto mb-4">
                   <div className="w-20 h-20 rounded-full bg-[#7B2D26] text-white text-center text-2xl font-bold leading-[5rem]">
                     {/* Mostrar iniciais do usuário logado */}                
                     {authInfo?.entity ? getInitials(authInfo.entity.nome) : 'U'}
                   </div>
                 </div>
                 {/* Mostrar nome e formação do usuário logado */}            
                 <h2 className="font-semibold text-lg mt-3">{authInfo?.entity?.nome || 'Usuário'}</h2>
                 <p className="text-sm text-gray-600 mt-1">{authInfo?.entity?.formacao || 'Adicione sua formação'}</p>
                 
                 {/* Card de Perfil Incompleto - Mostrar apenas se for candidato E perfil incompleto */}            
                 {authInfo?.entity?.tipo !== 'empresa' && !perfilCompleto && ( 
                   <div className="mt-4 bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-100 text-left">
                     <div className="flex items-center justify-between mb-2">
                       <span className="font-medium">Perfil Incompleto</span>
                       <span className="text-amber-600">
                         {/* Calcula porcentagem baseado nos campos faltantes para candidato */}                    
                         {Math.round(((7 - camposFaltantes.length) / 7) * 100)}%
                       </span>
                     </div>
                     <div className="w-full bg-amber-200 rounded-full h-1.5">
                       <div 
                         className="bg-amber-600 h-1.5 rounded-full transition-all duration-300" 
                         style={{ width: `${((7 - camposFaltantes.length) / 7) * 100}%` }} // Assume 7 campos obrigatórios para candidatos
                       ></div>
                     </div>
                     <Link href="/perfil" className="text-[#7B2D26] font-medium mt-2 block hover:underline">
                       Complete seu perfil
                     </Link>
                   </div>
                 )}
               </div>
             </div>

             {/* Links Úteis - Exemplo de como adaptar conteúdo para empresa ou candidato */}        
             <div className="bg-white rounded-xl shadow-sm border border-gray-100">
               <div className="py-2">
                 {authInfo?.entity?.tipo === 'empresa' ? (
                   // Links úteis para Empresa
                   <>
                      <SidebarItem 
                         icon={<div className="w-5 h-5 text-[#7B2D26]">📄</div>} 
                         label="Gerenciar Vagas" 
                       />
                       <SidebarItem 
                         icon={<div className="w-5 h-5 text-[#7B2D26]">⭐</div>} 
                         label="Candidatos Salvos" 
                       />
                      <SidebarItem 
                         icon={<div className="w-5 h-5 text-[#7B2D26]">📊</div>} 
                         label="Estatísticas da Empresa" 
                       />
                   </>
                 ) : (
                   // Links úteis para Candidato
                   <>
                     <SidebarItem 
                       icon={<div className="w-5 h-5 text-[#7B2D26]">🔖</div>} 
                       label="Itens salvos" 
                       count="12"
                     />
                     <SidebarItem 
                       icon={<div className="w-5 h-5 text-[#7B2D26]">📝</div>} 
                       label="Candidaturas" 
                       count="5"
                     />
                     <SidebarItem 
                       icon={<div className="w-5 h-5 text-[#7B2D26]">📊</div>} 
                       label="Estatísticas" 
                     />
                   </>
                 )}
               </div>
             </div>
           </div>


           
         </main>
       </div>
     );
  }

  // 4. Se chegou até aqui (isLoading é false, isAuthenticated pode ser true, mas authInfo?.entity é false)
  //    algo deu errado ou os dados do usuário ainda não estão disponíveis após a autenticação.
  //    Neste caso, vamos retornar um loading ou null. O useEffect de redirecionamento já deve ter
  //    lidado com o caso !isAuthenticated.
   console.log('Feed Render: Estado inesperado ou dados do usuário indisponíveis após loading. Retornando null.', { isLoading, isAuthenticated, authInfo: !!authInfo });
   return null;
}

// Components (Não alterados)
function NavItem({ icon, label, active = false, count = null }) {
  return (
    <div
      className={`flex flex-col items-center px-3 h-14 ${
        active 
          ? "text-[#7B2D26] border-b-2 border-[#7B2D26]" 
          : "text-gray-500 hover:text-[#7B2D26] transition-colors"
      }`}
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
          <h4 className="text-sm font-medium hover:text-[#7B2D26] transition-colors">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{info}</p>
        </div>
      </div>
    </div>
  )
}
