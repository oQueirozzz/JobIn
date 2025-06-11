'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PerfilCandidato from './PerfilCandidato';

export default function ModalCandidatos({ 
  isOpen, 
  onClose, 
  candidatos, 
  onAtualizarStatus,
  isUpdatingStatus,
  candidatoAtualizando
}) {
  const router = useRouter();
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(null);

  const handleVerPerfil = (candidatoId) => {
    router.push(`/candidato/${candidatoId}`);
  };

  const handleFecharPerfil = () => {
    setCandidatoSelecionado(null);
  };

  if (!isOpen) return null;

  if (candidatoSelecionado) {
    return (
      <PerfilCandidato
        candidatoId={candidatoSelecionado}
        onClose={handleFecharPerfil}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-auto my-8 overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Candidatos</h3>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              {candidatos.length} {candidatos.length === 1 ? 'candidato' : 'candidatos'}
            </span>
          </div>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {candidatos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Nenhum candidato encontrado para esta vaga.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {candidatos.map((candidato) => (
                <div 
                  key={candidato.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex items-start space-x-4 cursor-pointer group flex-1"
                      onClick={() => handleVerPerfil(candidato.id_usuario)}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <span className="text-2xl font-semibold text-indigo-600">
                          {candidato.nome_usuario?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                          {candidato.nome_usuario}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{candidato.email_usuario}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Candidatura em:</span>
                          <span className="text-xs font-medium text-gray-700">
                            {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-indigo-600 group-hover:text-indigo-700 flex items-center">
                            Ver perfil completo
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        candidato.status === 'APROVADO' ? 'bg-green-100 text-green-800' :
                        candidato.status === 'REJEITADO' ? 'bg-red-100 text-red-800' :
                        candidato.status === 'EM_ESPERA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {candidato.status === 'APROVADO' ? 'Aprovado' :
                         candidato.status === 'REJEITADO' ? 'Rejeitado' :
                         candidato.status === 'EM_ESPERA' ? 'Em Análise' :
                         'Pendente'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => onAtualizarStatus(candidato.id, 'APROVADO')}
                      disabled={isUpdatingStatus && candidatoAtualizando === candidato.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                        candidato.status === 'APROVADO'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      } transition-colors duration-300`}
                    >
                      {isUpdatingStatus && candidatoAtualizando === candidato.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Atualizando...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Aprovar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onAtualizarStatus(candidato.id, 'EM_ESPERA')}
                      disabled={isUpdatingStatus && candidatoAtualizando === candidato.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                        candidato.status === 'EM_ESPERA'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      } transition-colors duration-300`}
                    >
                      {isUpdatingStatus && candidatoAtualizando === candidato.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Atualizando...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Em Análise</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onAtualizarStatus(candidato.id, 'REJEITADO')}
                      disabled={isUpdatingStatus && candidatoAtualizando === candidato.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                        candidato.status === 'REJEITADO'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      } transition-colors duration-300`}
                    >
                      {isUpdatingStatus && candidatoAtualizando === candidato.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Atualizando...</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>Rejeitar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-300 font-medium shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
} 