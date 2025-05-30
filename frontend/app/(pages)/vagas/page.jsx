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

      console.log('Enviando candidatura:', candidaturaPayload);

      const res = await fetch('http://localhost:3001/api/candidaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidaturaPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao enviar candidatura');
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

      const res = await fetch('http://localhost:3001/api/candidaturas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: usuarioId,
          id_vaga: vagaSelecionada.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao remover candidatura');
      }

      mostrarMensagem('Candidatura removida com sucesso!', 'success');
      setCandidaturas(prev => prev.filter(id => id !== vagaSelecionada.id));
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
                <h1 className="font-bold text-3xl">{vaga.nome_vaga}</h1>
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

                <div className="flex pt-2 text-gray-700 text-lg">
                  <img src="/img/vagas/money.svg" alt="money" className="h-7 w-7 text-[#7B2D26] mr-2" />
                  Salário <span className="pl-2 text-lg font-semibold">R${vaga.salario}</span>
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
              <h1 className="font-bold text-3xl md:text-4xl">{vagaSelecionada.nome_vaga}</h1>
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
                <img src="/img/vagas/money.svg" alt="money" className="h-7 w-7 text-[#7B2D26] mr-2" />
                Salário<span className="pl-2 font-semibold">R${vagaSelecionada.salario}</span>
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
