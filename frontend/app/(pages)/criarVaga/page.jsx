'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CriarVaga() {
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [empresaId, setEmpresaId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const authData = localStorage.getItem('authEntity');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed?.id) {
          setEmpresaId(parsed.id);
        } else {
          setMensagem('ID da empresa não encontrado nos dados de autenticação.');
          setTipoMensagem('erro');
        }
      } catch (error) {
        setMensagem('Erro ao interpretar os dados de autenticação.');
        setTipoMensagem('erro');
      }
    }
  }, []);

  async function cadVagas(event) {
    event.preventDefault();

    if (!empresaId) {
      setTipoMensagem('erro');
      setMensagem('ID da empresa não encontrado. Faça login novamente.');
      return;
    }

    setCarregando(true);
    setMensagem('');
    setTipoMensagem('');

    const formData = new FormData(event.target);

    const dadosVagas = {
      empresa_id: empresaId,
      nome_vaga: formData.get('nome'),
      nome_empresa: formData.get('nome_empresa'),
      descricao: formData.get('descricao'),
      tipo_vaga: formData.get('tipo_vaga'),
      local_vaga: formData.get('local_vaga'),
      categoria: formData.get('categoria'),
    };

    try {
      const response = await fetch('http://localhost:3001/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosVagas),
      });

      const data = await response.json();

      if (response.ok) {
        setTipoMensagem('sucesso');
        setMensagem('Vaga cadastrada com sucesso!');

        setTimeout(() => {
          router.push('/vagas');
        }, 1500);
      } else {
        setTipoMensagem('erro');
        setMensagem(data.message || data.mensagem || 'Erro ao criar vaga.');
      }
    } catch (error) {
      setTipoMensagem('erro');
      setMensagem(`Erro ao conectar com o servidor: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 bg-branco">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 sm:p-10 my-20 sm:my-20">
        <div className="flex justify-center mb-6">
          <img src="/img/global/logo_completa.svg" alt="Logo" className="h-16" />
        </div>

        {mensagem && (
          <div
            className={`mb-4 p-3 rounded-md text-center ${tipoMensagem === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
          >
            {mensagem}
          </div>
        )}

        <form className="w-full" id="novaVaga" onSubmit={cadVagas}>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="nome"
              id="nome"
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer"
              placeholder=" "
              disabled={carregando}
            />
            <label
              htmlFor="nome"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nome da vaga
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="nome_empresa"
              id="empresa"
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer"
              placeholder=" "
              disabled={carregando}
            />
            <label
              htmlFor="nome"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Nome da Empresa
            </label>
          </div>


          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="local_vaga"
              id="local_vaga"
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer"
              placeholder=" "
              disabled={carregando}
            />
            <label
              htmlFor="local_vaga"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Localização
            </label>
          </div>

          {/* Tipo vaga */}
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="tipo_vaga"
              id="tipo_vaga"
              required
              disabled={carregando}
             className="block appearance-none w-full bg-white border-0 border-b-2 border-gray-300 text-gray-500 py-2.5 px-0 text-sm focus:border-transparent"
              style={{ lineHeight: '1.25rem', height: '2.5rem' }}
              defaultValue=""
            >
              <option value="" disabled hidden>Tipo da Vaga</option>
              <option value="presencial">Presencial</option>
              <option value="hibrido">Híbrido</option>
              <option value="remoto">Remoto</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-4 h-4 text-vinho"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <select
              name="categoria"
              id="categoria"
              required
              disabled={carregando}
              className="block appearance-none w-full bg-white border-0 border-b-2 border-gray-300 text-gray-500 py-2.5 px-0 text-sm focus:border-none"
              style={{ lineHeight: '1.25rem', height: '2.5rem' }}
              defaultValue=""
            >
              <option value="" disabled hidden>Categoria</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="administração">Administração</option>
              <option value="engenharia">Engenharia</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-4 h-4 text-vinho"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <textarea
              name="descricao"
              id="descricao"
              maxLength="500"
              rows="3"
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent resize-none border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-vinho peer"
              placeholder=" "
              disabled={carregando}
            ></textarea>
            <label
              htmlFor="descricao"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-vinho peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Descrição da vaga
            </label>
          </div>

          <button
            type="submit"
            disabled={carregando || !empresaId}
            className="cursor-pointer text-white bg-[#7B2D26] hover:bg-red-800 font-medium rounded-3xl text-sm w-full px-5 py-3 text-center shadow-md transition-colors duration-300 flex justify-center items-center"
          >
            {carregando ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processando...
              </>
            ) : (
              'Criar Vaga'
            )}
          </button>

          <div className="flex items-center justify-center">
            <a href="/perfil" className="text-xs hover:text-[#7B2D26] text-gray-500 text-center mt-4 cursor-pointer">
              Voltar
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
