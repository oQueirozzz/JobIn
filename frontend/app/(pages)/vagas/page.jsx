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
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [vagaToDelete, setVagaToDelete] = useState(null);
  const [showEditVagaModal, setShowEditVagaModal] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState(null);
  const [showCandidatosModal, setShowCandidatosModal] = useState(false);
  const [candidatosList, setCandidatosList] = useState([]);

  const detalhesRef = useRef(null);

  useEffect(() => {
    async function fetchVagas() {
      setLoading(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas`);
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
          const resCandidaturas = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas/usuario/${usuarioId}`);
          if (resCandidaturas.ok) {
            const dataCandidaturas = await resCandidaturas.json();
            const vagasCandidatadasIds = dataCandidaturas.map(vg => vg.id_vaga);
            setCandidaturas(vagasCandidatadasIds);
          }
        }

        // vaga selecionada
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
    setTimeout(() => setMensagem(null), 1500);
  }


  function redirecionarParaLogin() {
    window.location.href = '/login';
  }

  async function handleCandidatar() {
    const authData = localStorage.getItem('authEntity');

    if (!authData) {
      mostrarMensagem('Você precisa estar logado para se candidatar. Redirecionando para login...', 'info');
      setTimeout(redirecionarParaLogin, 1500);
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas`, {
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
      const resCandidatura = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas/usuario/${usuarioId}`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas/${candidaturaToRemove.id}`, {
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

  async function handleVisualizarCandidatos(vagaId) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        mostrarMensagem('Autenticação necessária para visualizar candidatos.', 'error');
        setTimeout(redirecionarParaLogin, 1500);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidaturas/vaga/${vagaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao buscar candidatos');
      }

      const data = await res.json();
      setCandidatosList(data);
      setShowCandidatosModal(true);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
      mostrarMensagem(error.message || 'Erro ao buscar candidatos. Tente novamente.', 'error');
    }
  }

  async function handleEditarVaga(vagaId) {
    const vaga = vagas.find(v => v.id === vagaId);
    if (vaga) {
      setVagaToEdit(vaga);
      setShowEditVagaModal(true);
    } else {
      mostrarMensagem('Vaga não encontrada para edição.', 'error');
    }
  }

  async function handleExcluirVaga(vagaId) {
    setVagaToDelete(vagaId);
    setShowDeleteConfirmModal(true);
  }

  async function confirmarExclusaoVaga() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        mostrarMensagem('Autenticação necessária para excluir vagas.', 'error');
        setTimeout(redirecionarParaLogin, 1500);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas/${vagaToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao excluir vaga');
      }

      mostrarMensagem('Vaga excluída com sucesso!', 'success');
      setVagas(prevVagas => prevVagas.filter(vaga => vaga.id !== vagaToDelete));
      setVagaSelecionada(null);
      setShowDeleteConfirmModal(false);
      setVagaToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir vaga:', error);
      mostrarMensagem(error.message || 'Erro ao excluir vaga. Tente novamente.', 'error');
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
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 transform transition-all duration-300 ease-in-out ${mensagem.tipo === 'error'
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

      {/* Modal de Confirmação de Exclusão da Vaga */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão da Vaga</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir a vaga <span className="font-semibold text-gray-800">"{vagas.find(v => v.id === vagaToDelete)?.nome_vaga}"</span>?
              Esta ação não pode ser desfeita e removerá todas as candidaturas associadas.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setVagaToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusaoVaga}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Vaga */}
      {showEditVagaModal && vagaToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto my-8 overflow-hidden transform transition-all duration-300 ease-in-out">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Editar Vaga</h3>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem('authToken');
                  if (!token) {
                    mostrarMensagem('Autenticação necessária para editar vagas.', 'error');
                    setTimeout(redirecionarParaLogin, 1500);
                    return;
                  }

                  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vagas/${vagaToEdit.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(vagaToEdit),
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    throw new Error(data.message || 'Erro ao atualizar vaga');
                  }

                  mostrarMensagem('Vaga atualizada com sucesso!', 'success');
                  // Atualizar a vaga na lista localmente
                  setVagas(prevVagas => prevVagas.map(v => v.id === vagaToEdit.id ? vagaToEdit : v));
                  setVagaSelecionada(vagaToEdit); // Manter a vaga selecionada atualizada
                  setShowEditVagaModal(false);
                  setVagaToEdit(null);
                } catch (error) {
                  console.error('Erro ao salvar edição da vaga:', error);
                  mostrarMensagem(error.message || 'Erro ao salvar edição da vaga. Tente novamente.', 'error');
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Nome da Vaga */}
                  <div>
                    <label htmlFor="edit-nome-vaga" className="block text-sm font-medium text-gray-700 mb-1">Nome da Vaga</label>
                    <input
                      type="text"
                      id="edit-nome-vaga"
                      name="nome_vaga"
                      value={vagaToEdit.nome_vaga || ''}
                      onChange={(e) => setVagaToEdit({ ...vagaToEdit, nome_vaga: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                      required
                    />
                  </div>

                  {/* Tipo de Vaga */}
                  <div>
                    <label htmlFor="edit-tipo-vaga" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vaga</label>
                    <select
                      id="edit-tipo-vaga"
                      name="tipo_vaga"
                      value={vagaToEdit.tipo_vaga || ''}
                      onChange={(e) => setVagaToEdit({ ...vagaToEdit, tipo_vaga: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="presencial">Presencial</option>
                      <option value="hibrido">Híbrido</option>
                      <option value="remoto">Remoto</option>
                    </select>
                  </div>

                  {/* Local da Vaga */}
                  <div>
                    <label htmlFor="edit-local-vaga" className="block text-sm font-medium text-gray-700 mb-1">Local da Vaga</label>
                    <input
                      type="text"
                      id="edit-local-vaga"
                      name="local_vaga"
                      value={vagaToEdit.local_vaga || ''}
                      onChange={(e) => setVagaToEdit({ ...vagaToEdit, local_vaga: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                      required
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <label htmlFor="edit-categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      id="edit-categoria"
                      name="categoria"
                      value={vagaToEdit.categoria || ''}
                      onChange={(e) => setVagaToEdit({ ...vagaToEdit, categoria: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="TI">Tecnologia da Informação</option>
                      <option value="Mecânica">Mecânica</option>
                      <option value="Design">Design</option>
                      <option value="Administração">Administração</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Vendas">Vendas</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Educação">Educação</option>
                      <option value="Engenharia">Engenharia</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  {/* Salário */}
                  <div>
                    <label htmlFor="edit-salario" className="block text-sm font-medium text-gray-700 mb-1">Salário (opcional)</label>
                    <input
                      type="text"
                      id="edit-salario"
                      name="salario"
                      value={vagaToEdit.salario || ''}
                      onChange={(e) => setVagaToEdit({ ...vagaToEdit, salario: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div className="mb-6">
                  <label htmlFor="edit-descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição da Vaga</label>
                  <textarea
                    id="edit-descricao"
                    name="descricao"
                    rows="5"
                    value={vagaToEdit.descricao || ''}
                    onChange={(e) => setVagaToEdit({ ...vagaToEdit, descricao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition resize-y"
                    required
                  ></textarea>
                </div>

                {/* Requisitos */}
                <div className="mb-6">
                  <label htmlFor="edit-requisitos" className="block text-sm font-medium text-gray-700 mb-1">Requisitos da Vaga</label>
                  <textarea
                    id="edit-requisitos"
                    name="requisitos"
                    rows="5"
                    value={vagaToEdit.requisitos || ''}
                    onChange={(e) => setVagaToEdit({ ...vagaToEdit, requisitos: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition resize-y"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditVagaModal(false)}
                    className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#7B2D26] text-white rounded-lg hover:bg-[#9B3D26] transition-colors duration-300 font-medium"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Candidatos */}
      {showCandidatosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto my-8 overflow-hidden transform transition-all duration-300 ease-in-out">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Candidatos para a Vaga</h3>
              <button
                onClick={() => setShowCandidatosModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {candidatosList.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <p>Nenhum candidato para esta vaga ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidatosList.map((candidato) => (
                    <div key={candidato.id} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                      <img
                        src={candidato.foto ? `${process.env.NEXT_PUBLIC_API_URL}${candidato.foto.startsWith('/') ? '' : '/'}${candidato.foto}` : '/placeholder-profile.png'}
                        alt={candidato.nome_usuario}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#7B2D26]"
                      />
                      <div>
                        <p className="font-semibold text-lg text-gray-900">{candidato.nome_usuario}</p>
                        <p className="text-gray-600">{candidato.email}</p>
                        <p className="text-gray-500 text-sm">Nascimento: {new Date(candidato.data_nascimento).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <option value="TI">Tecnologia da Informação</option>
                <option value="Mecânica">Mecânica</option>
                <option value="Design">Design</option>
                <option value="Administração">Administração</option>
                <option value="Marketing">Marketing</option>
                <option value="Vendas">Vendas</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Engenharia">Engenharia</option>
                <option value="Outros">Outros</option>
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
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300 ${vagaSelecionada?.id === vaga.id ? 'border-[#7B2D26] ring-2 ring-[#7B2D26] ring-opacity-50' : ''
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

                {!isCandidato && vagaSelecionada ? (
                  <div className="space-y-3">
                    <button
                      className="w-full bg-[#7B2D26] hover:bg-[#9B3D26] text-white py-3 rounded-lg shadow transition-colors duration-300 flex items-center justify-center font-medium"
                      onClick={() => handleVisualizarCandidatos(vagaSelecionada.id)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visualizar Candidatos
                    </button>
                    <button
                      className="w-full bg-[#a8946b] hover:bg-[#C2B79A] text-white py-3 rounded-lg shadow transition-colors duration-300 flex items-center justify-center font-medium"
                      onClick={() => handleEditarVaga(vagaSelecionada.id)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar Vaga
                    </button>
                    <button
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg shadow transition-colors duration-300 flex items-center justify-center font-medium"
                      onClick={() => handleExcluirVaga(vagaSelecionada.id)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir Vaga
                    </button>
                  </div>
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
