'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { useLoading } from './ClientLayout';


export default function Feed() {
  const { logout, isAuthenticated, authInfo } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [vagasRecomendadas, setVagasRecomendadas] = useState([]);
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const [camposFaltantes, setCamposFaltantes] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showMoreNews, setShowMoreNews] = useState(false);
  const [news, setNews] = useState([
    { id: 1, title: 'Mercado de TI segue aquecido em 2023', info: 'há 2h • 1.245 leitores', trending: true },
    { id: 2, title: 'Novas tendências em entrevistas de emprego', info: 'há 5h • 876 leitores', trending: true },
    { id: 3, title: 'Como se destacar no JobIn', info: 'há 1d • 3.421 leitores', trending: true },
    { id: 4, title: 'Salários em alta para desenvolvedores', info: 'há 3h • 2.156 leitores', trending: true },
    { id: 5, title: 'Empresas buscam profissionais com soft skills', info: 'há 6h • 1.890 leitores', trending: true },
    { id: 6, title: 'Tendências de trabalho remoto em 2024', info: 'há 4h • 3.245 leitores', trending: true },
  ]);
  const [showCompleteProfile, setShowCompleteProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [vagas, setVagas] = useState([]);

  const verificarCamposObrigatorios = (usuario) => {
    if (!usuario) return [];

    const isCompany = usuario.tipo === 'empresa';
    const camposObrigatorios = isCompany ? {
      nome: 'Nome da Empresa',
      email: 'Email Corporativo',
      cnpj: 'CNPJ',
      local: 'Localização',
      descricao: 'Descrição da Empresa',
    } : {
      nome: 'Nome',
      email: 'Email',
      formacao: 'Formação Acadêmica',
      area_interesse: 'Área de Interesse',
      habilidades: 'Habilidades',
      descricao: 'Resumo Profissional',
      curriculo: 'Currículo',
      certificados: 'Certificados',
      cpf: 'CPF',
      data_nascimento: 'Data de Nascimento'
    };

    return Object.entries(camposObrigatorios)
      .filter(([campo]) => {
          const valor = usuario[campo];
          if (Array.isArray(valor)) {
              return valor.length === 0; // Se for um array, é faltante se estiver vazio
          }
          return !valor || (typeof valor === 'string' && valor.trim() === ''); // Para outros tipos, a lógica existente
      })
      .map(([_, label]) => label);
  };

  // Função utilitária para calcular a porcentagem do perfil
  const calcularPorcentagemPerfil = (dados, camposObrigatorios) => {
    const totalCampos = Object.keys(camposObrigatorios).length;
    const camposPreenchidos = Object.entries(camposObrigatorios)
      .filter(([campo]) => {
          const valor = dados[campo];
          if (Array.isArray(valor)) {
              return valor.length > 0; // Campo de array é preenchido se não estiver vazio
          }
          return valor && (typeof valor === 'string' ? valor.trim() !== '' : true); // Outros tipos: preenchido se não nulo/vazio
      })
      .length;
    return Math.round((camposPreenchidos / totalCampos) * 100);
  };

  // Carregar posts
  const carregarPosts = useCallback(async () => {
    if (!isAuthenticated || !authInfo?.token) {
      console.log('[DEBUG FE: carregarPosts] Usuário não autenticado ou sem token. Não carregando posts.');
      setIsLoadingPosts(false);
      return;
    }

    try {
      setIsLoadingPosts(true); // Definir como true antes de carregar
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${authInfo.token}`,
        },
      });
      const data = await response.json();
      console.log('[DEBUG FE: carregarPosts] Dados recebidos:', data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('[DEBUG FE: carregarPosts] Erro ao carregar posts:', error);
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [isAuthenticated, authInfo?.token]);

  useEffect(() => {
    if (isAuthenticated && authInfo?.entity) {
      const usuario = authInfo.entity;
      const camposIncompletos = verificarCamposObrigatorios(usuario);
      setCamposFaltantes(camposIncompletos);
      setPerfilCompleto(camposIncompletos.length === 0);
      setShowCompleteProfile(camposIncompletos.length > 0);

      // Carregar vagas recomendadas apenas para usuários
      if (usuario.tipo !== 'empresa') {
        const carregarVagasRecomendadas = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas`);
            const data = await res.json();
            const vagasAleatorias = data
              .sort(() => Math.random() - 0.5)
              .slice(0, 2);
            setVagas(vagasAleatorias);
          } catch (error) {
            console.error("Erro ao carregar vagas:", error);
          }
        };
        carregarVagasRecomendadas();
      }
    }
  }, [isAuthenticated, authInfo]);

  // Listener para atualizações do perfil
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const { updatedUser } = event.detail;
      if (updatedUser) {
        console.log('Perfil atualizado recebido:', updatedUser);
        const camposIncompletos = verificarCamposObrigatorios(updatedUser);
        console.log('Campos incompletos:', camposIncompletos);
        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
        setShowCompleteProfile(camposIncompletos.length > 0);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(true);
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router, setIsLoading]);

  useEffect(() => {
    carregarPosts();
  }, [carregarPosts]);

  // NOVO useEffect para carregar notificações
  useEffect(() => {
    const carregarNotificacoes = async () => {
      if (isAuthenticated && authInfo?.entity?.id && authInfo?.token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notificacoes`, {
            headers: {
              'Authorization': `Bearer ${authInfo.token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
          } else if (response.status === 401) {
            console.error('Erro de autenticação ao carregar notificações:', response.status);
            // Tratar o erro de autenticação, talvez redirecionar para login
            setNotifications([]);
          } else {
            console.error('Erro ao carregar notificações:', response.status);
            setNotifications([]);
          }
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
          setNotifications([]);
        }
      } else {
        setNotifications([]); // Limpa notificações se não autenticado ou sem token
      }
    };
    carregarNotificacoes();
  }, [isAuthenticated, authInfo?.entity?.id, authInfo?.token]); // Dependências para recarregar quando o status de auth, ID do usuário ou token mudar

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    console.log(`[DEBUG FE: getInitials] Name: ${name}, Initials: ${name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}`);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLikePost = async (postId, currentLikedStatus) => {
    if (!isAuthenticated || !authInfo?.token) {
      console.warn('Usuário não autenticado. Não é possível dar like.');
      router.push('/login');
      return;
    }

    // Empresas não podem dar like em posts
    if (authInfo.entity.tipo === 'empresa') {
      console.warn('Empresas não podem dar like em posts.');
      return;
    }

    const method = currentLikedStatus ? 'DELETE' : 'POST';
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authInfo.token}`,
        },
      });

      if (response.ok) {
        console.log(`Like ${currentLikedStatus ? 'removido' : 'adicionado'} com sucesso.`);
        await carregarPosts(); // Recarregar posts para refletir a nova contagem de likes e status
      } else {
        const errorText = await response.text();
        console.error(`Erro ao ${currentLikedStatus ? 'remover' : 'adicionar'} like:`, errorText);
      }
    } catch (error) {
      console.error(`Erro na requisição de like/unlike:`, error);
    }
  };

  const handleCloseCompleteProfile = () => {
    setShowCompleteProfile(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('empresa_id', authInfo.entity.id);
      formData.append('titulo', postTitle);
      formData.append('conteudo', postContent);
      if (selectedImage) {
        formData.append('imagem', selectedImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authInfo.token}`,
        },
      });

      if (response.ok) {
        setPostContent('');
        setPostTitle('');
        setSelectedImage(null);
        setShowCreatePost(false); // Fechar o modal após sucesso
        await carregarPosts(); // Recarregar os posts
      } else {
        console.error('Erro ao criar post:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated && authInfo?.entity) {
    const usuario = authInfo.entity;
    const isCompany = !!usuario.cnpj;
    console.log('--- Depuração da Porcentagem ---');
    console.log('Usuário (authInfo.entity):', usuario);
    console.log('Tipo de usuário (isCompany):', isCompany);

    // Define camposObrigatorios e calcula a porcentagem
    const camposObrigatorios = isCompany ? {
      nome: 'Nome da Empresa',
      email: 'Email Corporativo',
      cnpj: 'CNPJ',
      local: 'Localização',
      descricao: 'Descrição da Empresa'
    } : {
      nome: 'Nome',
      email: 'Email',
      formacao: 'Formação Acadêmica',
      area_interesse: 'Área de Interesse',
      habilidades: 'Habilidades',
      descricao: 'Resumo Profissional',
      curriculo: 'Currículo',
      certificados: 'Certificados',
      cpf: 'CPF',
      data_nascimento: 'Data de Nascimento'
    };
    console.log('Campos Obrigatórios Definidos:', camposObrigatorios);

    // Calcula a porcentagem usando a mesma lógica da página de perfil
    const totalCamposObrigatorios = Object.keys(camposObrigatorios).length;
    console.log('Total de Campos Obrigatórios:', totalCamposObrigatorios);
    
    // Calcula campos preenchidos com base nos campos faltantes
    const camposPreenchidos = totalCamposObrigatorios - camposFaltantes.length;
    
    console.log('Campos Preenchidos:', camposPreenchidos);
    const porcentagemCompleta = Math.round((camposPreenchidos / totalCamposObrigatorios) * 100);
    console.log('Porcentagem Completa Calculada:', porcentagemCompleta);
    console.log('-------------------------------');

    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Perfil Resumido */}
          <div className="w-full md:w-[300px] flex-shrink-0">
            {showCompleteProfile && (
              <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="font-semibold text-lg">Complete seu perfil</h2>
                      <p className="text-sm text-gray-500 mt-1">Aumente suas chances de conseguir uma vaga</p>
                    </div>
                    <button
                      onClick={handleCloseCompleteProfile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {camposFaltantes.map((campo, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                        {campo}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={authInfo?.entity?.tipo === 'empresa' ? '/perfil-empresa' : '/perfil'}
                    className="mt-4 block text-center px-4 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-[#7B2D26]/90 transition-colors"
                  >
                    Completar perfil
                  </Link>
                </div>
              </div>
            )}

            {/* Vagas Recomendadas - Apenas para candidatos */}
            {!isCompany && vagas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                <div className="p-4">
                  <h2 className="font-semibold mb-3">Vagas recomendadas</h2>
                  <div className="space-y-4 cursor-pointer">
                    {vagas.map((vaga) => (
                      <Link href={`/vagas?vaga=${vaga.id}`} key={vaga.id}>
                        <div className="p-3 border border-gray-100 rounded-lg hover:border-[#7B2D26]/20 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800">{vaga.nome_vaga}</h3>
                              <p className="text-sm text-gray-600 mt-1">{vaga.nome_empresa}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notícias e Recomendações */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4">
                <h2 className="font-semibold mb-3">Notícias e Recomendações</h2>
                <ul className="space-y-3">
                  {news.slice(0, showMoreNews ? news.length : 3).map(item => (
                    <NewsItem key={item.id} title={item.title} info={item.info} trending={item.trending} />
                  ))}
                </ul>
                {!showMoreNews && news.length > 3 && (
                  <button 
                    onClick={() => setShowMoreNews(true)}
                    className="text-[#7B2D26] hover:underline mt-4 text-sm flex items-center"
                  >
                    Mostrar mais <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Feed de Posts */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                {authInfo?.entity?.logo ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${authInfo.entity.logo}`}
                    alt="Logo da Empresa"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-lg">
                    {getInitials(authInfo?.entity?.nome)}
                  </div>
                )}
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-4 py-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Comece uma publicação
                </button>
              </div>
            </div>

            {isLoadingPosts ? (
              <div className="text-center py-8 text-gray-500">Carregando posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum post encontrado.</div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {post.logo_empresa ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.logo_empresa}`}
                            alt="Logo da Empresa"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-xl">
                            {getInitials(post.nome_empresa)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.nome_empresa}</h3>
                          <p className="text-sm text-gray-500">{new Date(post.data_publicacao).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <h2 className="font-bold text-lg mb-2">{post.titulo}</h2>
                      <p className="text-gray-700 text-sm mb-4">{post.conteudo}</p>
                      {post.imagem && (
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.imagem}`}
                            alt="Imagem do Post"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.likes_count || 0}</span> {/* Exibe a contagem de likes do backend */}
                      </div>
                      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleLikePost(post.id, post.liked_by_user)} // Passa o status atual do like
                          className={`flex items-center text-sm px-3 py-2 rounded-lg transition-colors 
                            ${post.liked_by_user ? 'bg-[#7B2D26] text-white' : 'hover:bg-gray-100 text-gray-600'}
                          `}
                        >
                          <ThumbsUp className={`h-4 w-4 mr-2 ${post.liked_by_user ? 'fill-current' : ''}`} />
                          Curtir
                        </button>
                        <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Comentar
                        </button>
                        <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartilhar
                        </button>
                        <button className="flex items-center text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="w-full md:w-[300px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <h2 className="font-semibold mb-3">Widgets</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#7B2D26]">Notificações</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#7B2D26]">Mensagens</Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-[#7B2D26]">Eventos</Link>
                </li>
              </ul>
            </div>

            {/* Menu de Perfil */}
            {showProfileMenu && (
              <div className="absolute right-4 top-16 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                <Link href={authInfo?.entity?.tipo === 'empresa' ? '/perfil-empresa' : '/perfil'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="inline-block mr-2 h-4 w-4" /> Meu Perfil
                </Link>
                <Link href="/config" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="inline-block mr-2 h-4 w-4" /> Configurações
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" /> Sair
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Modal para Criar Post */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Criar Publicação</h2>
                <button onClick={() => setShowCreatePost(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Título da publicação"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26]"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="No que você está pensando?"
                  rows="5"
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7B2D26]"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="image-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-4 4 4 4-4v4z" clipRule="evenodd" />
                  </svg>
                  Adicionar Imagem
                </label>
                {selectedImage && <p className="mt-2 text-sm text-gray-500">Imagem selecionada: {selectedImage.name}</p>}
              </div>
              <button
                onClick={handleCreatePost}
                className="w-full px-4 py-3 bg-[#7B2D26] text-white font-semibold rounded-lg hover:bg-[#7B2D26]/90 transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        )}

        {/* Header (se existir e estiver no mesmo arquivo) */}
        <header className="bg-white shadow-sm py-4 px-4 md:px-8 border-b border-gray-100 fixed top-0 w-full z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-[#7B2D26]">JobIn</Link>
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Buscar no JobIn"
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B2D26]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-[#7B2D26]">
                <Home className="h-6 w-6" />
                <span className="text-xs">Início</span>
              </Link>
              <Link href="/vagas" className="flex flex-col items-center text-gray-600 hover:text-[#7B2D26]">
                <Briefcase className="h-6 w-6" />
                <span className="text-xs">Vagas</span>
              </Link>
              <Link href="/chat" className="flex flex-col items-center text-gray-600 hover:text-[#7B2D26]">
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs">Mensagens</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex flex-col items-center text-gray-600 hover:text-[#7B2D26]"
                >
                  <Bell className="h-6 w-6" />
                  <span className="text-xs">Notificações</span>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{notifications.length}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">Nenhuma notificação</p>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0">
                          {notification.mensagem_usuario || notification.mensagem_empresa}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.data_notificacao).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-[#7B2D26]"
                >
                  {authInfo?.entity?.logo ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${authInfo.entity.logo}`}
                      alt="Logo do Usuário"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                      {getInitials(authInfo?.entity?.nome)}
                    </div>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Para depuração temporária, remova após o teste */}
        {/* <div className="fixed bottom-4 left-4 bg-yellow-200 p-2 rounded-md z-50 text-xs">
          <p>isCompany: {JSON.stringify(isCompany)}</p>
          <p>authInfo.entity.tipo: {authInfo?.entity?.tipo}</p>
          <p>authInfo.entity.nome: {authInfo?.entity?.nome}</p>
        </div> */}

      </div>
    );
  }
  return null;
}

function NewsItem({ title, info, trending = false }) {
  return (
    <li className="flex items-center space-x-2">
      {trending && (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Trending</span>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-800 hover:text-[#7B2D26] cursor-pointer">{title}</h3>
        <p className="text-xs text-gray-500">{info}</p>
      </div>
    </li>
  );
}
