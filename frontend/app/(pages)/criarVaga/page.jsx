'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CriarVaga() {
  const maxSalario = (e) => {
    const { name, value } = e.target;
  
    if (name === 'salario') {
   
      const onlyNumbers = value.replace(/\D/g, '');

      setFormData(prev => ({
        ...prev,
        [name]: onlyNumbers
      }));
    }
  };

  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({ mostrar: false, tipo: '', mensagem: '' });
  const [formData, setFormData] = useState({
    nome_vaga: '',
    nome_empresa: '',
    descricao: '',
    tipo_vaga: '',
    local_vaga: '',
    categoria: '',
    requisitos: '',
    salario: ''
  });

  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ mostrar: true, tipo, mensagem });
    setTimeout(() => {
      setNotificacao({ mostrar: false, tipo: '', mensagem: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Notificação para cada campo preenchido
    if (value.trim()) {
      mostrarNotificacao('info', `Campo ${name.replace('_', ' ')} atualizado`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    mostrarNotificacao('info', 'Iniciando criação da vaga...');

    try {
      const authData = localStorage.getItem('authEntity');
      if (!authData) {
        throw new Error('Usuário não autenticado');
      }

      const parsed = JSON.parse(authData);
      if (!parsed.id) {
        throw new Error('ID da empresa não encontrado');
      }

      const vagaData = {
        ...formData,
        empresa_id: parsed.id,
        nome_empresa: parsed.nome
      };

      mostrarNotificacao('info', 'Enviando dados para o servidor...');

      const res = await fetch('http://localhost:3001/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vagaData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao criar vaga');
      }

      mostrarNotificacao('success', 'Vaga criada com sucesso!');

      // Dispara evento para atualizar notificações
      window.dispatchEvent(new Event('notificationUpdate'));

      setTimeout(() => {
        router.push('/vagas');
      }, 1500);

    } catch (error) {
      console.error('Erro ao criar vaga:', error);
      mostrarNotificacao('error', error.message);
    } finally {
      setCarregando(false);
    }
  };

  const getNotificacaoEstilo = (tipo) => {
    switch (tipo) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getNotificacaoIcone = (tipo) => {
    switch (tipo) {
      case 'success':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        );
      case 'error':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        );
      case 'info':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {notificacao.mostrar && (
        <div className={`fixed top-4 right-4 border-l-4 p-4 rounded-lg shadow-lg z-50 animate-fade-in ${getNotificacaoEstilo(notificacao.tipo)}`}>
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {getNotificacaoIcone(notificacao.tipo)}
            </svg>
            <p className="font-medium">{notificacao.mensagem}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Criar Nova Vaga</h1>
            <p className="text-gray-600 text-lg">Preencha os detalhes da vaga para encontrar o candidato ideal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Nome da Vaga */}
            <div className="relative z-0 w-full group">
              <input
                type="text"
                name="nome_vaga"
                id="nome_vaga"
                required
                disabled={carregando}
                className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                placeholder=" "
                value={formData.nome_vaga}
                onChange={handleInputChange}
              />
              <label
                htmlFor="nome_vaga"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#7B2D26] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Nome da Vaga
              </label>
            </div>

            {/* Tipo de Vaga e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative z-0 w-full group">
                <select
                  name="tipo_vaga"
                  id="tipo_vaga"
                  required
                  disabled={carregando}
                  className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300 appearance-none"
                  value={formData.tipo_vaga}
                  onChange={handleInputChange}
                >
                  <option value="" disabled hidden>Modalidade de Trabalho</option>
                  <option value="PRESENCIAL">Presencial</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="REMOTO">Remoto</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative z-0 w-full group">
                <select
                  name="categoria"
                  id="categoria"
                  required
                  disabled={carregando}
                  className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300 appearance-none"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="" disabled hidden>Selecione a Categoria</option>
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="relative z-0 w-full group">
              <textarea
                name="descricao"
                id="descricao"
                required
                disabled={carregando}
                rows="4"
                className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300 resize-none"
                placeholder=" "
                value={formData.descricao}
                onChange={handleInputChange}
              />
              <label
                htmlFor="descricao"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#7B2D26] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Descrição da Vaga
              </label>
            </div>

            {/* Salário e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="salario"
                  id="salario"
                  required
                  disabled={carregando}
                  className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                  placeholder="R$"
                  value={formData.salario}
                  onChange={maxSalario}
                  maxLength={7}
                />
                <label
                  htmlFor="salario"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#7B2D26] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Salário
                </label>
              </div>

              <div className="relative z-0 w-full group">
                <input
                  type="text"
                  name="local_vaga"
                  id="local_vaga"
                  required
                  disabled={carregando}
                  className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300"
                  placeholder=" "
                  value={formData.local_vaga}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="local_vaga"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#7B2D26] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Localização
                </label>
              </div>
            </div>

            {/* Requisitos */}
            <div className="relative z-0 w-full group">
              <textarea
                name="requisitos"
                id="requisitos"
                required
                disabled={carregando}
                rows="4"
                className="block w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7B2D26] focus:border-transparent transition-all duration-300 resize-none"
                placeholder=" "
                value={formData.requisitos}
                onChange={handleInputChange}
              />
              <label
                htmlFor="requisitos"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#7B2D26] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Requisitos
              </label>
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={carregando}
                className="px-8 py-4 bg-[#7B2D26] text-white rounded-xl hover:bg-[#7B2D26]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {carregando ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Criando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Criar Vaga
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

