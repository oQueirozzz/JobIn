'use client'

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Vagas() {
  const searchParams = useSearchParams();
  const vagaId = searchParams.get('vaga');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);
  const [candidaturas, setCandidaturas] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [isCandidato, setIsCandidato] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidaturaToRemove, setCandidaturaToRemove] = useState(null);

  const detalhesRef = useRef(null);

  useEffect(() => {
    async function fetchVagas() {
      setLoading(true);

      try {
        const res = await fetch('http://localhost:3001/api/vagas');
        const data = await res.json();

        // Ordenar vagas por data de criação (mais recentes primeiro)
        const vagasOrdenadas = data.sort((a, b) => {
          return new Date(b.data_criacao) - new Date(a.data_criacao);
        });

        const authData = localStorage.getItem('authEntity');
        let empresaId = null;
        let usuarioId = null;

        if (authData) {
          try {
            const parsed = JSON.parse(authData);

            if (parsed?.id) {
              usuarioId = parsed.id;
              if (parsed.tipo === 'empresa') {
                setIsCandidato(false);
                const vagasFiltradas = vagasOrdenadas.filter((vaga) => vaga.empresa_id === parsed.id);
                setVagas(vagasFiltradas);
                // Se houver um ID de vaga na URL, seleciona essa vaga
                if (vagaId) {
                  const vagaSelecionada = vagasFiltradas.find(v => v.id === parseInt(vagaId));
                  setVagaSelecionada(vagaSelecionada || vagasFiltradas[0]);
                } else {
                  setVagaSelecionada(vagasFiltradas.length > 0 ? vagasFiltradas[0] : null);
                }
              } else if (parsed.tipo === 'usuario') {
                setIsCandidato(true);
                setVagas(vagasOrdenadas);
                // Se houver um ID de vaga na URL, seleciona essa vaga
                if (vagaId) {
                  const vagaSelecionada = vagasOrdenadas.find(v => v.id === parseInt(vagaId));
                  setVagaSelecionada(vagaSelecionada || vagasOrdenadas[0]);
                } else {
                  setVagaSelecionada(vagasOrdenadas.length > 0 ? vagasOrdenadas[0] : null);
                }
              } else {
                setIsCandidato(false);
                setVagas(vagasOrdenadas);
                // Se houver um ID de vaga na URL, seleciona essa vaga
                if (vagaId) {
                  const vagaSelecionada = vagasOrdenadas.find(v => v.id === parseInt(vagaId));
                  setVagaSelecionada(vagaSelecionada || vagasOrdenadas[0]);
                } else {
                  setVagaSelecionada(vagasOrdenadas.length > 0 ? vagasOrdenadas[0] : null);
                }
              }
            }
          } catch (error) {
            console.error('Erro ao interpretar os dados de autenticação.', error);
            setVagas(vagasOrdenadas);
            // Se houver um ID de vaga na URL, seleciona essa vaga
            if (vagaId) {
              const vagaSelecionada = vagasOrdenadas.find(v => v.id === parseInt(vagaId));
              setVagaSelecionada(vagaSelecionada || vagasOrdenadas[0]);
            } else {
              setVagaSelecionada(vagasOrdenadas.length > 0 ? vagasOrdenadas[0] : null);
            }
          }
        } else {
          // Usuário deslogado é tratado como candidato
          setIsCandidato(true);
          setVagas(vagasOrdenadas);
          // Se houver um ID de vaga na URL, seleciona essa vaga
          if (vagaId) {
            const vagaSelecionada = vagasOrdenadas.find(v => v.id === parseInt(vagaId));
            setVagaSelecionada(vagaSelecionada || vagasOrdenadas[0]);
          } else {
            setVagaSelecionada(vagasOrdenadas.length > 0 ? vagasOrdenadas[0] : null);
          }
        }

        if (usuarioId) {
          const resCandidaturas = await fetch(`http://localhost:3001/api/candidaturas/usuario/${usuarioId}`);
          if (resCandidaturas.ok) {
            const dataCandidaturas = await resCandidaturas.json();
            const vagasCandidatadasIds = dataCandidaturas.map(vg => vg.id_vaga);
            setCandidaturas(vagasCandidatadasIds);
          }
        }

        // Se houver uma vaga selecionada, rola até ela
        if (vagaId && detalhesRef.current) {
          setTimeout(() => {
            detalhesRef.current.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVagas();
  }, [vagaId]);


  function mostrarMensagem(texto, tipo = 'info') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  
  function redirecionarParaLogin() {
    window.location.href = '/login';
  }

  async function handleCandidatar() {
    const authData = localStorage.getItem('authEntity');

    if (!authData) {
      mostrarMensagem('Você precisa estar logado para se candidatar. Redirecionando para login...', 'info');
      setTimeout(redirecionarParaLogin, 2000);
      return;
    }

    if (!vagaSelecionada) {
      mostrarMensagem('Vaga não selecionada.', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(authData);

      if (!parsed.id) {
        mostrarMensagem('Erro ao obter dados do usuário.', 'error');
        return;
      }

      const candidaturaPayload = {
        id_usuario: parsed.id,
        id_vaga: vagaSelecionada.id,
        empresa_id: vagaSelecionada.empresa_id,
        curriculo_usuario: parsed.curriculo || null
      };

      const res = await fetch('http://localhost:3001/api/candidaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidaturaPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'LIMITE_EXCEDIDO') {
          mostrarMensagem(data.message, 'error');
        } else if (data.error === 'CANDIDATURA_ATIVA_EXISTENTE') {
          mostrarMensagem(data.message, 'error');
        } else {
          throw new Error(data.message || 'Erro ao enviar candidatura');
        }
        return;
      }

      mostrarMensagem('Candidatura enviada com sucesso!', 'success');
      setCandidaturas(prev => [...prev, vagaSelecionada.id]);
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
      mostrarMensagem(error.message || 'Erro ao enviar candidatura. Tente novamente.', 'error');
    }
  }

  async function handleRemoverCandidatura() {
    const authData = localStorage.getItem('authEntity');

    if (!authData || !vagaSelecionada) {
      mostrarMensagem('Usuário não autenticado ou vaga não selecionada.', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(authData);
      const usuarioId = parsed.id;

      // Primeiro, buscar a candidatura para obter o ID
      const resCandidatura = await fetch(`http://localhost:3001/api/candidaturas/usuario/${usuarioId}`);
      if (!resCandidatura.ok) {
        throw new Error('Erro ao buscar candidatura');
      }

      const candidaturas = await resCandidatura.json();
      const candidatura = candidaturas.find(c => c.id_vaga === vagaSelecionada.id);

      if (!candidatura) {
        throw new Error('Candidatura não encontrada');
      }

      // Mostrar modal de confirmação
      setCandidaturaToRemove(candidatura);
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Erro ao buscar candidatura:', error);
      mostrarMensagem('Erro ao buscar candidatura. Tente novamente.', 'error');
    }
  }

  async function confirmarRemocaoCandidatura() {
    try {
      const res = await fetch(`http://localhost:3001/api/candidaturas/${candidaturaToRemove.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmacao: true })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao remover candidatura');
      }

      mostrarMensagem('Candidatura removida com sucesso!', 'success');
      setCandidaturas(prev => prev.filter(id => id !== vagaSelecionada.id));
      setShowConfirmModal(false);
      setCandidaturaToRemove(null);
    } catch (error) {
      console.error('Erro ao remover candidatura:', error);
      mostrarMensagem('Erro ao remover candidatura. Tente novamente.', 'error');
    }
  }

  const vagasFiltradas = vagas.filter(vaga => {
    const filtraCategoria = categoria ? vaga.categoria === categoria : true;
    const filtraTipo = tipo ? vaga.tipo_vaga === tipo : true;
    const filtraEmpresa = empresa ? vaga.nome_empresa === empresa : true;
    return filtraCategoria && filtraTipo && filtraEmpresa;
  });

  const isCandidatado = vagaSelecionada ? candidaturas.includes(vagaSelecionada.id) : false;

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Mensagem de erro/sucesso */}
      {mensagem && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          mensagem.tipo === 'error'
            ? 'bg-white border-l-4 border-red-500 text-red-700'
            : mensagem.tipo === 'success'
              ? 'bg-white border-l-4 border-green-500 text-green-700'
              : 'bg-white border-l-4 border-blue-500 text-blue-700'
        }`}>
          <div className="flex items-center">
            {mensagem.tipo === 'error' ? (
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : mensagem.tipo === 'success' ? (
              <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <p className="font-semibold">
                {mensagem.tipo === 'error' ? 'Atenção!' :
                  mensagem.tipo === 'success' ? 'Sucesso!' : 'Informação'}
              </p>
              <p className="text-sm mt-1">{mensagem.texto}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Remoção</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja remover sua candidatura para a vaga <span className="font-semibold text-gray-800">"{vagaSelecionada?.nome_vaga}"</span>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setCandidaturaToRemove(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarRemocaoCandidatura}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header da página */}
      <div className="bg-gradient-to-r from-[#7B2D26] to-[#9B3D26] text-white py-25">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Encontre sua próxima oportunidade</h1>
          <p className="text-lg md:text-xl text-gray-100">Explore vagas de emprego e dê o próximo passo na sua carreira</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Área</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Todas as áreas</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="admin">Administração</option>
                <option value="engenharia">Engenharia</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
                <option value="remoto">Remoto</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              >
                <option value="">Todas as empresas</option>
                {[...new Set(vagas.map(v => v.nome_empresa))].map((empresaNome) => (
                  <option key={empresaNome} value={empresaNome}>
                    {empresaNome}
                  </option>
                ))}
              </select>
            </div>

            {!isCandidato && (
              <div className="flex items-end">
                <a 
                  href="/criarVaga" 
                  className="w-full bg-[#7B2D26] hover:bg-[#9B3D26] text-white text-center py-2 rounded-lg shadow transition-colors duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Criar Nova Vaga
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-24 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de vagas */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B2D26]"></div>
              </div>
            ) : vagasFiltradas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-gray-500">Tente ajustar os filtros ou volte mais tarde</p>
              </div>
            ) : (
              vagasFiltradas.map((vaga) => (
                <div
                  key={vaga.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300 ${
                    vagaSelecionada?.id === vaga.id ? 'border-[#7B2D26] ring-2 ring-[#7B2D26] ring-opacity-50' : ''
                  }`}
                  onClick={() => setVagaSelecionada(vaga)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{vaga.nome_vaga}</h2>
                      <p className="text-lg text-[#7B2D26] font-medium">{vaga.nome_empresa}</p>
                    </div>
                    <div className="bg-[#7B2D26]/10 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {vaga.local_vaga}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {vaga.tipo_vaga}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {vaga.categoria}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      R$ {vaga.salario}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {vaga.descricao}
                  </p>

                  <button
                    className="w-full bg-[#7B2D26] hover:bg-[#9B3D26] text-white py-2 rounded-lg shadow transition-colors duration-300 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVagaSelecionada(vaga);
                      if (window.innerWidth < 1024 && detalhesRef.current) {
                        detalhesRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Ver detalhes
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Detalhes da vaga */}
          <div
            ref={detalhesRef}
            className="lg:sticky lg:top-24 h-fit"
          >
            {vagaSelecionada ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{vagaSelecionada.nome_vaga}</h2>
                    <p className="text-lg text-[#7B2D26] font-medium">{vagaSelecionada.nome_empresa}</p>
                  </div>
                  <div className="bg-[#7B2D26]/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vagaSelecionada.local_vaga}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {vagaSelecionada.tipo_vaga}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {vagaSelecionada.categoria}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    R$ {vagaSelecionada.salario}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {vagaSelecionada.descricao}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Requisitos</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {vagaSelecionada.requisitos}
                  </p>
                </div>

                {!isCandidato ? (
                  <button
                    className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg shadow cursor-not-allowed"
                    disabled
                  >
                    Desabilitado Para Empresas
                  </button>
                ) : isCandidatado ? (
                  <button
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg shadow transition-colors duration-300 flex items-center justify-center"
                    onClick={handleRemoverCandidatura}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover candidatura
                  </button>
                ) : (
                  <button
                    className="w-full bg-[#7B2D26] hover:bg-[#9B3D26] text-white py-3 rounded-lg shadow transition-colors duration-300 flex items-center justify-center"
                    onClick={handleCandidatar}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Candidatar-me
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Selecione uma vaga</h3>
                <p className="text-gray-500">Escolha uma vaga da lista para ver mais detalhes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
