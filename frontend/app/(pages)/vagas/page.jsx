'use client'

import { useState, useEffect, useRef } from 'react';

export default function Vagas() {
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [local, setLocal] = useState('');
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  const detalhesRef = useRef(null);

  useEffect(() => {
    async function fetchVagas() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/vagas');
        const data = await res.json();
        setVagas(data);
        if (data.length > 0) setVagaSelecionada(data[0]);
      } catch (err) {
        console.error('Erro ao buscar vagas:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVagas();
  }, []);

  return (
    <section className="bg-gray-50 flex flex-col items-center min-h-screen">
      {/* Filtros */}
      <div className="w-11/12 md:w-10/12 bg-white rounded-xl shadow-sm mt-5 border border-gray-100 flex flex-col md:flex-row items-center justify-around p-4 gap-4">
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
          <label className="text-sm font-medium text-gray-700 mb-1">Local</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7B2D26] transition"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          >
            <option value="">Nenhum</option>
            <option value="sao-paulo">São Paulo</option>
            <option value="sao-caetano">São Caetano do Sul</option>
            <option value="campinas">Campinas</option>
          </select>
        </div>
      </div>

      <div className="h-auto flex flex-col-reverse lg:flex-row justify-center w-full px-4 md:px-10 mt-8 gap-6">
        {/* Lista de vagas */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          {loading ? (
            <p>Carregando vagas...</p>
          ) : vagas.length === 0 ? (
            <p>Nenhuma vaga encontrada.</p>
          ) : (
            vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setVagaSelecionada(vaga)}
              >
                <h1 className="font-bold text-2xl">{vaga.nome_vaga}</h1>
                <h2 className="text-xl">{vaga.nome_empresa}</h2>
                <div className="flex flex-wrap pt-2 text-gray-700 text-sm gap-2">
                  <span>{vaga.local_vaga}</span>
                  <span className="text-[#7B2D26]">|</span>
                  <span>{vaga.tipo_vaga}</span>
                </div>
                <div className="flex pt-2 text-gray-700 text-sm">
                  Área - <span className="pl-2">{vaga.categoria}</span>
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

        {/* Detalhes da vaga selecionada */}
        <div
          ref={detalhesRef}
          className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 lg:mt-0 lg:ml-6 relative lg:sticky lg:top-20 self-start"
        >
          {vagaSelecionada ? (
            <>
              <h1 className="font-bold text-3xl md:text-4xl">{vagaSelecionada.nome_vaga}</h1>
              <h2 className="text-xl md:text-2xl text-[#7B2D26]">{vagaSelecionada.nome_empresa}</h2>
              <div className="flex flex-wrap pt-2 text-gray-700 gap-2 text-sm md:text-lg">
                <span>{vagaSelecionada.local_vaga}</span>
                <span className="text-[#7B2D26]">|</span>
                <span>{vagaSelecionada.tipo_vaga}</span>
              </div>
              <div className="flex pt-2 text-sm md:text-lg">
                Área - <span className="pl-2">{vagaSelecionada.categoria}</span>
              </div>
              <hr className="bg-red-900 h-0.5 my-3" />
              <p className="text-justify text-sm md:text-base max-w-full break-words px-1 md:px-0 whitespace-pre-line">
                {vagaSelecionada.descricao}
              </p>
              <button
                className="cursor-pointer mt-6 w-full bg-[#7B2D26] hover:bg-red-800 text-white py-2 rounded-full shadow transition-colors duration-300"
                type="button"
              >
                Candidatar-me
              </button>
            </>
          ) : (
            <p>Selecione uma vaga para ver detalhes.</p>
          )}
        </div>
      </div>
    </section>
  );
}
