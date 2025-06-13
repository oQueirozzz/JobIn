'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Alert from '../../../components/Alert';

export default function CadastroAlunos() {
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleCloseAlert = () => {
        setMensagem('');
        setTipoMensagem('');
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setCarregando(true);
        setMensagem('');
        setTipoMensagem('');

        const formData = new FormData(event.target);
        const dadosCadastro = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            cpf: formData.get('cpf'),
            data_nascimento: formData.get('data_nascimento'),
            telefone: formData.get('telefone'),
            endereco: formData.get('endereco'),
            cidade: formData.get('cidade'),
            estado: formData.get('estado'),
            cep: formData.get('cep'),
            curso: formData.get('curso'),
            instituicao: formData.get('instituicao'),
            periodo: formData.get('periodo'),
            semestre: formData.get('semestre'),
            habilidades: formData.get('habilidades'),
            experiencia: formData.get('experiencia'),
            objetivo: formData.get('objetivo')
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosCadastro),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao realizar cadastro');
            }

            setTipoMensagem('success');
            setMensagem('Cadastro realizado com sucesso! Redirecionando para login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            setTipoMensagem('error');
            setMensagem(error.message || 'Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Alert
                message={mensagem}
                type={tipoMensagem}
                onClose={handleCloseAlert}
                duration={5000}
            />
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#7B2D26]">Comece sua jornada profissional</h1>
                    <p className="text-gray-600 mt-2">Preencha seus dados para criar sua conta</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit}>
                        {/* Resto do formulário permanece igual */}
                        {/* ... existing code ... */}
                    </form>
                </div>
            </div>
        </div>
    );
}