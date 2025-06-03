'use client';

import { useState, useEffect } from "react";
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
  const [perfilCompleto, setPerfilCompleto] = useState(true);
  const [camposFaltantes, setCamposFaltantes] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
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
    { id: 3, title: 'Como se destacar no JobIn', info: 'há 1d • 3.421 leitores', trending: true },
    { id: 4, title: 'Salários em alta para desenvolvedores', info: 'há 3h • 2.156 leitores', trending: true },
    { id: 5, title: 'Empresas buscam profissionais com soft skills', info: 'há 6h • 1.890 leitores', trending: true },
    { id: 6, title: 'Tendências de trabalho remoto em 2024', info: 'há 4h • 3.245 leitores', trending: true },
  ]);

  const [showCompleteProfile, setShowCompleteProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(true);
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router, setIsLoading]);

  useEffect(() => {
    if (isAuthenticated && authInfo?.entity) {
      const usuario = authInfo.entity;
      const isCompany = !!usuario.cnpj;

      if (!isCompany) {
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

        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
        setShowCompleteProfile(camposIncompletos.length > 0);

        // Carregar vagas recomendadas apenas para usuários
        const carregarVagasRecomendadas = async () => {
          try {
            const res = await fetch("http://localhost:3001/api/vagas");
            const data = await res.json();
            setVagas(data);

            const vagasAleatorias = data
              .sort(() => Math.random() - 0.5)
              .slice(0, 2);

            setVagas(vagasAleatorias);
          } catch (error) {
            console.error("Erro ao carregar vagas:", error);
          }
        };


        carregarVagasRecomendadas();

      } else {
        // Para empresas
        const camposObrigatorios = {
          nome: 'Nome da Empresa',
          email: 'Email Corporativo',
          cnpj: 'CNPJ',
          localizacao: 'Localização',
          descricao: 'Descrição da Empresa'
        };

        const camposIncompletos = Object.entries(camposObrigatorios)
          .filter(([campo]) => !usuario[campo])
          .map(([_, label]) => label);

        setCamposFaltantes(camposIncompletos);
        setPerfilCompleto(camposIncompletos.length === 0);
        setShowCompleteProfile(camposIncompletos.length > 0);
        setVagasRecomendadas([]);
      }
    }
  }, [isLoading, isAuthenticated, authInfo]);

  // Carregar posts
  useEffect(() => {
    const carregarPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts');
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    carregarPosts();
  }, []);

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

      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost, ...posts]);
        setShowCreatePost(false);
        setPostContent('');
        setPostTitle('');
        setSelectedImage(null);
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
    console.log('É empresa?', isCompany);

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
                    href="/perfil"
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
                        <div
                          className="p-3 border border-gray-100 rounded-lg hover:border-[#7B2D26]/20 transition-colors"
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-2sm transition-colors cursor-pointer">
                                {vaga.nome_vaga.length > 30 ? vaga.nome_vaga.slice(0, 80) + '...' : vaga.nome_vaga}
                              </h3>
                              <p className="text-sm text-[#7B2D26] ">{vaga.nome_empresa}</p>
                              <span className="text-xs text-gray-500 flex mt-1">
                                {vaga.local_vaga}
                                <span className="text-[#7B2D26] pr-1 pl-1">|</span>
                                <span>{vaga.tipo_vaga}</span>
                              </span>
                              <h3 className="text-xs mt-1">{vaga.categoria}</h3>
                              <div className="flex items-center text-sm mt-1">
                                R$
                                <span className="   text-[#7B2D26]  text-sm pl-1" >{vaga.salario}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/vagas"
                    className="mt-4 block text-center text-sm text-[#7B2D26] hover:underline"
                  >
                    Ver todas as vagas
                  </Link>
                </div>
              </div>
            )}

            {/* Botão de Criar Post - Apenas para empresas */}
            {isCompany && (
              <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                <div className="p-4">
                  <h2 className="font-semibold mb-3">Compartilhe com sua rede</h2>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#7B2D26] text-white text-center text-xl font-bold leading-[3rem] mr-3">
                      {getInitials(usuario.nome)}
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

            {/* Notícias do Mercado */}
            <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-semibold">Notícias do mercado</h2>
                </div>

                {news.slice(0, showMoreNews ? news.length : 3).map(item => (
                  <Link href={`/noticias/${item.id}`} key={item.id}>
                    <NewsItem
                      title={item.title}
                      info={item.info}
                      trending={item.trending}
                    />
                  </Link>
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
            {isCompany && (
              <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#7B2D26] text-white text-center text-xl font-bold leading-[3rem] mr-3">
                      {getInitials(usuario.nome)}
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
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Título da publicação"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26]/20 mb-4"
                    />
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="O que você gostaria de compartilhar?"
                      className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B2D26]/20 resize-none mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="flex items-center text-gray-500 hover:text-[#7B2D26] transition-colors">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Adicionar imagem
                        </div>
                      </label>
                      {selectedImage && (
                        <div className="text-sm text-gray-500">
                          {selectedImage.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowCreatePost(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreatePost}
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
              {isLoadingPosts ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">Carregando posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">Nenhum post encontrado</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#7B2D26] text-white text-center text-xl font-bold leading-[3rem] mr-3">
                          {getInitials(post.nome_empresa)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{post.nome_empresa}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.data_publicacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{post.titulo}</h4>
                      <p className="text-gray-700 mb-4">{post.conteudo}</p>
                      {post.imagem && (
                        <div className="mb-4">
                          <img
                            src={`http://localhost:3001/${post.imagem}`}
                            alt="Post"
                            className="w-full rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex items-center">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex cursor-pointer items-center transition-all duration-300 ${likedPosts[post.id]
                            ? 'text-[#7B2D26] transform scale-110'
                            : 'text-gray-500 hover:text-[#7B2D26]'
                            }`}
                        >
                          <ThumbsUp className={`w-5 h-5 mr-1 ${likedPosts[post.id] ? 'fill-[#7B2D26]' : ''}`} />
                          <span>{likedPosts[post.id] ? '1' : '0'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
              <div className="text-center px-4 pt-8 pb-4">
                <div className="inline-block rounded-full bg-white p-1 shadow-md mx-auto mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#7B2D26] text-white text-center text-2xl font-bold leading-[5rem]">
                    {authInfo?.entity ? getInitials(authInfo.entity.nome) : 'U'}
                  </div>
                </div>
                <h2 className="font-semibold text-lg mt-3">{authInfo?.entity?.nome || 'Usuário'}</h2>
                <p className="text-sm text-gray-600 mt-1">{authInfo?.entity?.formacao || 'Adicione sua formação'}</p>

                {authInfo?.entity?.tipo !== 'empresa' && !perfilCompleto && (
                  <div className="mt-4 bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-100 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Perfil Incompleto</span>
                      <span className="text-amber-600">
                        {Math.round(((7 - camposFaltantes.length) / 7) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-1.5">
                      <div
                        className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((7 - camposFaltantes.length) / 7) * 100}%` }}
                      ></div>
                    </div>
                    <Link href="/perfil" className="text-[#7B2D26] font-medium mt-2 block hover:underline">
                      Complete seu perfil
                    </Link>
                  </div>
                )}
              </div>
            </div>


          </div>
        </main>
      </div>
    );
  }

  setIsLoading(true);
  router.push('/dashboard');
  return null;
}




function NewsItem({ title, info, trending = false }) {
  return (
    <div className="group cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#7B2D26] transition-colors">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{info}</p>
        </div>
        {trending && (
          <span className="ml-2 px-2 py-1 text-xs font-medium text-[#7B2D26] bg-red-50 rounded-full">
            Trending
          </span>
        )}
      </div>
    </div>
  );
}
