'use client'

import { useState, useEffect, useRef } from 'react';

export default function Vagas() {
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

        const authData = localStorage.getItem('authEntity');
        let empresaId = null;
        let usuarioId = null;

        if (authData) {
          try {
            const parsed = JSON.parse(authData);

            if (parsed?.id) {
              usuarioId = parsed.id;
              empresaId = parsed.id;
              if (parsed.tipo === 'empresa') {
                setIsCandidato(false);
              } else if (parsed.tipo === 'usuario') {
                setIsCandidato(true);
              } else {
                setIsCandidato(false);
              }
            }
          } catch (error) {
            console.error('Erro ao interpretar os dados de autenticação.', error);
          }
        }

        const vagasFiltradas = empresaId
          ? data.filter((vaga) => vaga.empresa_id === empresaId)
          : data;

        setVagas(vagasFiltradas);
        setVagaSelecionada(vagasFiltradas.length > 0 ? vagasFiltradas[0] : null);

        if (usuarioId) {
          const resCandidaturas = await fetch(`http://localhost:3001/api/candidaturas/usuario/${usuarioId}`);
          if (resCandidaturas.ok) {
            const dataCandidaturas = await resCandidaturas.json();
            const vagasCandidatadasIds = dataCandidaturas.map(vg => vg.id_vaga);
            setCandidaturas(vagasCandidatadasIds);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVagas();
  }, []);


  // Função para mostrar mensagem temporária
  function mostrarMensagem(texto, tipo = 'info') {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  }

  async function handleCandidatar() {
    const authData = localStorage.getItem('authEntity');

    if (!authData || !vagaSelecionada) {
      mostrarMensagem('Usuário não autenticado ou vaga não selecionada.', 'error');
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
    <section className="bg-gray-50 flex flex-col items-center min-h-screen">
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

      {/* Filtros */}
      <div className="w-11/12 md:w-9/12 bg-white rounded-xl shadow-sm mt-5 border border-gray-100 flex flex-col md:flex-row items-center justify-around p-4 gap-4">
        <div className="flex flex-col w-full md:w-1/3 px-2 md:px-0">
          <label className="text-sm font-medium text-gray-700 mb-1">Área</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Nenhum</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="admin">Administração</option>
            <option value="engenharia">Engenharia</option>
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/3 px-2 md:px-0">
          <label className="text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Nenhum</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
            <option value="remoto">Remoto</option>
          </select>
        </div>

        <div className="flex flex-col w-full md:w-1/3 px-2 md:px-0">
          <label className="text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          >
            <option value="">Nenhum</option>
            {[...new Set(vagas.map(v => v.nome_empresa))].map((empresaNome) => (
              <option key={empresaNome} value={empresaNome}>
                {empresaNome}
              </option>
            ))}
          </select>
        </div>

        {!isCandidato ? (
          <div className='flex flex-col w-full md:w-1/3 px-2 md:px-0'>
            <a href="/criarVaga" className="cursor-pointer mt-6 w-full bg-[#7B2D26] hover:bg-red-800 text-white text-center py-2 rounded-full shadow transition-colors duration-300" >
              Criar Nova Vaga
            </a>
          </div>)
          : ''
        }



      </div>

      <div className="h-auto flex flex-col-reverse lg:flex-row justify-center w-full px-4 md:px-10 mt-8 gap-6">
        {/* Lista de vagas */}
        <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-center">
          {loading ? (
            <p>Carregando vagas...</p>
          ) : vagasFiltradas.length === 0 ? (
            <p>Nenhuma vaga encontrada.</p>
          ) : (
            vagasFiltradas.map((vaga) => (
              <div
                key={vaga.id}
                className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 cursor-pointer hover:shadow-md transition-shadow
                  ${vagaSelecionada?.id === vaga.id ? 'border-[#7B2D26]' : ''}`}
                onClick={() => setVagaSelecionada(vaga)}
              >
                <h1 className="font-bold text-3xl flex justify-between">
                  {vaga.nome_vaga}
                  <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </h1>
                <h2 className="text-xl text-[#7B2D26]">{vaga.nome_empresa}</h2>
                <div className="flex flex-wrap pt-2 text-gray-700 text-xl gap-2">

                  <span className='text-xl flex'>
                    <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {vaga.local_vaga}
                  </span>

                  <span className="text-[#7B2D26]">|</span>
                  <span>{vaga.tipo_vaga}</span>
                </div>

                <div className="flex pt-2 text-gray-700 text-lg">
                  <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Área<span className="pl-2 text-lg">{vaga.categoria}</span>
                </div>

                <div className="flex pt-2 text-lg text-gray-700">
                  <svg width="25" height="25" viewBox="0 0 200 113" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                    <path d="M165.646 0C174.296 0 181.354 7.05848 181.354 15.708V65.2793H167.932V32.6807C166.708 33.0071 165.361 33.1699 164.015 33.1699C155.243 33.1699 148.103 26.0297 148.103 17.2578C148.103 15.9116 148.266 14.6057 148.593 13.3818H31.8643C32.0683 14.361 32.1504 15.3003 32.1504 16.3203C32.1502 25.092 25.0101 32.2314 16.2383 32.2314C15.2999 32.2314 14.3614 32.1505 13.4639 31.9873V80.2529C14.3615 80.0897 15.2999 80.0078 16.2383 80.0078C25.0102 80.0078 32.1503 87.148 32.1504 95.9199C32.1504 96.9399 32.0274 97.9191 31.8643 98.8574H125.051V112.28H15.708C7.05861 112.28 0.000221916 105.223 0 96.5732V15.708C0 7.05848 7.05848 0 15.708 0H165.646ZM179.355 101.02C180.457 101.02 181.354 101.918 181.354 103.02V110.281C181.354 111.383 180.457 112.28 179.355 112.28H131.212C130.11 112.28 129.213 111.383 129.213 110.281V103.02C129.213 101.918 130.11 101.02 131.212 101.02H179.355ZM188.698 85.2305C189.8 85.2305 190.697 86.128 190.697 87.2295V94.4922C190.697 95.5937 189.8 96.4912 188.698 96.4912H140.555C139.453 96.4911 138.556 95.5937 138.556 94.4922V87.2295C138.556 86.1281 139.453 85.2306 140.555 85.2305H188.698ZM90.6973 21.7051C109.71 21.7051 125.133 37.128 125.133 56.1406C125.133 75.1531 109.71 90.5752 90.6973 90.5752C71.6849 90.575 56.2628 75.153 56.2627 56.1406C56.2627 37.1281 71.644 21.7053 90.6973 21.7051ZM89.7998 30.5586C89.188 30.5587 88.7393 31.049 88.7393 31.6201V36.3115C85.7609 36.7603 83.3125 37.821 81.4766 39.6162C79.4366 41.5746 78.417 44.0641 78.417 47.124C78.4171 50.4692 79.3961 53.0394 81.3135 54.7529C83.231 56.4665 86.332 58.18 90.5342 59.8936C92.2886 60.6279 93.4724 61.4035 94.166 62.1787C94.8595 62.9539 95.1855 64.0556 95.1855 65.4834C95.1855 66.7074 94.8588 67.6867 94.2061 68.4619C93.5533 69.1962 92.574 69.6045 91.2686 69.6045C89.7185 69.6044 88.4539 69.1147 87.5156 68.1357C86.7405 67.3198 86.2504 66.0957 86.1279 64.4639C86.0871 63.8111 85.5161 63.3215 84.8633 63.3623L78.417 63.4844C77.7234 63.4844 77.1523 64.0964 77.1523 64.79C77.3156 68.2171 78.4171 70.8283 80.457 72.7051C82.6602 74.7042 85.4346 75.9277 88.7393 76.2949V80.7021C88.7395 81.3138 89.2289 81.7625 89.7998 81.7627H93.7168C94.3286 81.7627 94.7771 81.2732 94.7773 80.7021V76.1318C97.4293 75.6422 99.5919 74.5814 101.265 72.9902C103.223 71.0727 104.202 68.5839 104.202 65.4424C104.202 62.1786 103.223 59.6486 101.265 57.8535C99.3063 56.0992 96.2463 54.3041 92.085 52.5498C90.2899 51.7747 89.0659 50.9997 88.4131 50.2246C87.7603 49.4494 87.4336 48.4291 87.4336 47.2051C87.4336 45.9814 87.7193 45.0024 88.3311 44.1865C88.943 43.4113 89.8817 43.0029 91.1465 43.0029C92.4113 43.0029 93.3908 43.4923 94.166 44.4307C94.7779 45.2058 95.1451 46.2666 95.2676 47.6943C95.3084 48.3471 95.9202 48.7969 96.5322 48.7969L102.979 48.7148C103.672 48.7148 104.284 48.1027 104.243 47.4092C104.08 44.5942 103.182 42.2281 101.51 40.3105C99.7963 38.3115 97.5523 37.0458 94.7373 36.4746V31.6201C94.7781 31.0081 94.288 30.5586 93.7168 30.5586H89.7998ZM198.001 69.4414C199.102 69.4415 200 70.3389 200 71.4404V78.7021C200 79.8037 199.102 80.7021 198.001 80.7021H149.857C148.756 80.7021 147.858 79.8037 147.858 78.7021V71.4404C147.858 70.3388 148.756 69.4414 149.857 69.4414H198.001ZM40.5957 46.5928C45.8588 46.5928 50.1426 50.8775 50.1426 56.1406C50.1424 61.4037 45.8588 65.6875 40.5957 65.6875C35.3326 65.6875 31.049 61.4037 31.0488 56.1406C31.0488 50.8775 35.3325 46.5928 40.5957 46.5928ZM140.759 46.5928C146.022 46.5928 150.306 50.8775 150.306 56.1406C150.306 61.4037 146.022 65.6875 140.759 65.6875C135.496 65.6875 131.212 61.4036 131.212 56.1406C131.212 50.8775 135.496 46.5928 140.759 46.5928Z" fill="#7B2D26" />
                  </svg>

                  R$
                  <span className=" text-lg font-semibold text-[#7B2D26] pl-2">{vaga.salario}</span>
                </div>
                <hr className="bg-red-900 h-0.5 my-3" />
                <div>
                  <span className='text-gray-700 text-sm'>
                    {vaga.descricao.length > 100 ? vaga.descricao.slice(0, 80) + '...' : vaga.descricao}
                  </span>
                </div>

                <button
                  className="cursor-pointer mt-6 bg-[#7B2D26] hover:bg-red-800 text-white px-5 py-2 rounded-full shadow transition-colors duration-300"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVagaSelecionada(vaga);
                    if (window.innerWidth < 1024 && detalhesRef.current) {
                      detalhesRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Ver mais...
                </button>
              </div>
            ))
          )}
        </div>

        {/* Vaga detalhada e candidatura */}
        <div
          ref={detalhesRef}
          className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 lg:mt-0 lg:ml-6 relative lg:sticky lg:top-20 self-start mb-10"
        >
          {vagaSelecionada ? (
            <>
              <h1 className="font-bold text-3xl md:text-4xl flex justify-between">
                {vagaSelecionada.nome_vaga}
                <div className="w-12 h-12 bg-[#7B2D26]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#7B2D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </h1>
              <h2 className="text-xl md:text-2xl text-[#7B2D26]">{vagaSelecionada.nome_empresa}</h2>
              <div className="flex flex-wrap pt-2 text-gray-700 gap-2 text-sm md:text-lg">

                <span className='flex'>
                  <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {vagaSelecionada.local_vaga}
                </span>

                <span className="text-[#7B2D26]">|</span>
                <span>{vagaSelecionada.tipo_vaga}</span>
              </div>
              <div className="flex pt-2 text-sm md:text-lg">
                <svg className="h-6 w-6 text-[#7B2D26] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Área
                <span className="pl-2">{vagaSelecionada.categoria}</span>
              </div>

              <div className="flex pt-2 text-sm md:text-lg">
                <svg width="25" height="25" viewBox="0 0 200 113" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
                  <path d="M165.646 0C174.296 0 181.354 7.05848 181.354 15.708V65.2793H167.932V32.6807C166.708 33.0071 165.361 33.1699 164.015 33.1699C155.243 33.1699 148.103 26.0297 148.103 17.2578C148.103 15.9116 148.266 14.6057 148.593 13.3818H31.8643C32.0683 14.361 32.1504 15.3003 32.1504 16.3203C32.1502 25.092 25.0101 32.2314 16.2383 32.2314C15.2999 32.2314 14.3614 32.1505 13.4639 31.9873V80.2529C14.3615 80.0897 15.2999 80.0078 16.2383 80.0078C25.0102 80.0078 32.1503 87.148 32.1504 95.9199C32.1504 96.9399 32.0274 97.9191 31.8643 98.8574H125.051V112.28H15.708C7.05861 112.28 0.000221916 105.223 0 96.5732V15.708C0 7.05848 7.05848 0 15.708 0H165.646ZM179.355 101.02C180.457 101.02 181.354 101.918 181.354 103.02V110.281C181.354 111.383 180.457 112.28 179.355 112.28H131.212C130.11 112.28 129.213 111.383 129.213 110.281V103.02C129.213 101.918 130.11 101.02 131.212 101.02H179.355ZM188.698 85.2305C189.8 85.2305 190.697 86.128 190.697 87.2295V94.4922C190.697 95.5937 189.8 96.4912 188.698 96.4912H140.555C139.453 96.4911 138.556 95.5937 138.556 94.4922V87.2295C138.556 86.1281 139.453 85.2306 140.555 85.2305H188.698ZM90.6973 21.7051C109.71 21.7051 125.133 37.128 125.133 56.1406C125.133 75.1531 109.71 90.5752 90.6973 90.5752C71.6849 90.575 56.2628 75.153 56.2627 56.1406C56.2627 37.1281 71.644 21.7053 90.6973 21.7051ZM89.7998 30.5586C89.188 30.5587 88.7393 31.049 88.7393 31.6201V36.3115C85.7609 36.7603 83.3125 37.821 81.4766 39.6162C79.4366 41.5746 78.417 44.0641 78.417 47.124C78.4171 50.4692 79.3961 53.0394 81.3135 54.7529C83.231 56.4665 86.332 58.18 90.5342 59.8936C92.2886 60.6279 93.4724 61.4035 94.166 62.1787C94.8595 62.9539 95.1855 64.0556 95.1855 65.4834C95.1855 66.7074 94.8588 67.6867 94.2061 68.4619C93.5533 69.1962 92.574 69.6045 91.2686 69.6045C89.7185 69.6044 88.4539 69.1147 87.5156 68.1357C86.7405 67.3198 86.2504 66.0957 86.1279 64.4639C86.0871 63.8111 85.5161 63.3215 84.8633 63.3623L78.417 63.4844C77.7234 63.4844 77.1523 64.0964 77.1523 64.79C77.3156 68.2171 78.4171 70.8283 80.457 72.7051C82.6602 74.7042 85.4346 75.9277 88.7393 76.2949V80.7021C88.7395 81.3138 89.2289 81.7625 89.7998 81.7627H93.7168C94.3286 81.7627 94.7771 81.2732 94.7773 80.7021V76.1318C97.4293 75.6422 99.5919 74.5814 101.265 72.9902C103.223 71.0727 104.202 68.5839 104.202 65.4424C104.202 62.1786 103.223 59.6486 101.265 57.8535C99.3063 56.0992 96.2463 54.3041 92.085 52.5498C90.2899 51.7747 89.0659 50.9997 88.4131 50.2246C87.7603 49.4494 87.4336 48.4291 87.4336 47.2051C87.4336 45.9814 87.7193 45.0024 88.3311 44.1865C88.943 43.4113 89.8817 43.0029 91.1465 43.0029C92.4113 43.0029 93.3908 43.4923 94.166 44.4307C94.7779 45.2058 95.1451 46.2666 95.2676 47.6943C95.3084 48.3471 95.9202 48.7969 96.5322 48.7969L102.979 48.7148C103.672 48.7148 104.284 48.1027 104.243 47.4092C104.08 44.5942 103.182 42.2281 101.51 40.3105C99.7963 38.3115 97.5523 37.0458 94.7373 36.4746V31.6201C94.7781 31.0081 94.288 30.5586 93.7168 30.5586H89.7998ZM198.001 69.4414C199.102 69.4415 200 70.3389 200 71.4404V78.7021C200 79.8037 199.102 80.7021 198.001 80.7021H149.857C148.756 80.7021 147.858 79.8037 147.858 78.7021V71.4404C147.858 70.3388 148.756 69.4414 149.857 69.4414H198.001ZM40.5957 46.5928C45.8588 46.5928 50.1426 50.8775 50.1426 56.1406C50.1424 61.4037 45.8588 65.6875 40.5957 65.6875C35.3326 65.6875 31.049 61.4037 31.0488 56.1406C31.0488 50.8775 35.3325 46.5928 40.5957 46.5928ZM140.759 46.5928C146.022 46.5928 150.306 50.8775 150.306 56.1406C150.306 61.4037 146.022 65.6875 140.759 65.6875C135.496 65.6875 131.212 61.4036 131.212 56.1406C131.212 50.8775 135.496 46.5928 140.759 46.5928Z" fill="#7B2D26" />
                </svg>
                R$
                <span className=" text-[#7B2D26] font-semibold pl-2">{vagaSelecionada.salario}</span>
              </div>
              <hr className="bg-red-900 h-0.5 my-3" />
              <p className="text-justify text-sm md:text-base max-w-full break-words px-1 md:px-0 whitespace-pre-line">
                {vagaSelecionada.descricao}
              </p>

              {!isCandidato ? (
                <button
                  className="cursor-not-allowed mt-6 w-full bg-gray-300 text-gray-600 py-2 rounded-full shadow"
                  type="button"
                  disabled
                >
                  Desabilitado Para Empresas
                </button>
              ) : isCandidatado ? (
                <button
                  className="cursor-pointer mt-6 w-full bg-gray-600 hover:bg-gray-800 text-white py-2 rounded-full shadow transition-colors duration-300"
                  type="button"
                  onClick={handleRemoverCandidatura}
                >
                  Remover candidatura
                </button>
              ) : (
                <button
                  className="cursor-pointer mt-6 w-full bg-[#7B2D26] hover:bg-red-800 text-white py-2 rounded-full shadow transition-colors duration-300"
                  type="button"
                  onClick={handleCandidatar}
                >
                  Candidatar-me
                </button>
              )}
            </>
          ) : (
            <p>Selecione uma vaga para ver detalhes.</p>
          )}
        </div>

      </div>
    </section>
  );
}
