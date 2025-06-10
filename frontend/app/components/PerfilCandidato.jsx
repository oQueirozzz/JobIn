'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PerfilCandidato({ candidatoId, onClose }) {
  const router = useRouter();
  const [candidato, setCandidato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidato = async () => {
      try {
        const response = await fetch(`/api/candidatos/${candidatoId}`);
        if (!response.ok) throw new Error('Erro ao carregar dados do candidato');
        const data = await response.json();
        setCandidato(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (candidatoId) {
      fetchCandidato();
    }
  }, [candidatoId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto my-8 p-8">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto my-8 p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar perfil</h3>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!candidato) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto my-8 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Perfil do Candidato</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Informações Pessoais */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                    <span className="text-4xl font-semibold text-indigo-600">
                      {candidato.nome?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 text-center">{candidato.nome}</h4>
                  <p className="text-gray-500 text-center mt-1">{candidato.email}</p>
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{candidato.cidade}, {candidato.estado}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes do Perfil */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Formação */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Formação</h5>
                  <div className="space-y-4">
                    {candidato.formacao?.map((formacao, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4">
                        <h6 className="font-medium text-gray-900">{formacao.curso}</h6>
                        <p className="text-sm text-gray-600">{formacao.instituicao}</p>
                        <p className="text-sm text-gray-500">
                          {formacao.inicio} - {formacao.fim || 'Atual'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiência */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Experiência Profissional</h5>
                  <div className="space-y-4">
                    {candidato.experiencia?.map((exp, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4">
                        <h6 className="font-medium text-gray-900">{exp.cargo}</h6>
                        <p className="text-sm text-gray-600">{exp.empresa}</p>
                        <p className="text-sm text-gray-500">
                          {exp.inicio} - {exp.fim || 'Atual'}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{exp.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habilidades */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h5>
                  <div className="flex flex-wrap gap-2">
                    {candidato.habilidades?.map((habilidade, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                      >
                        {habilidade}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Idiomas */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Idiomas</h5>
                  <div className="space-y-2">
                    {candidato.idiomas?.map((idioma, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{idioma.nome}</span>
                        <span className="text-sm text-gray-500">{idioma.nivel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 