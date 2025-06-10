import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const candidatoId = params.id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${candidatoId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do candidato');
    }

    const candidato = await response.json();

    let certificadosArray = [];
    if (candidato.certificados) {
        if (typeof candidato.certificados === 'string') {
            try {
                // Attempt to parse stringified JSON, potentially multiple times
                let tempParsed = JSON.parse(candidato.certificados);
                if (typeof tempParsed === 'string') {
                    tempParsed = JSON.parse(tempParsed);
                }
                if (Array.isArray(tempParsed)) {
                    certificadosArray = tempParsed;
                } else if (tempParsed) {
                    certificadosArray = [tempParsed];
                }
            } catch (e) {
                certificadosArray = [candidato.certificados]; // Fallback to raw string if parsing fails
            }
        } else if (Array.isArray(candidato.certificados)) {
            certificadosArray = candidato.certificados;
        } else if (candidato.certificados) {
            certificadosArray = [candidato.certificados];
        }
    }

    // Garantir que todos os campos necessários existam e remover campos indesejados
    const candidatoFormatado = {
      id: candidato.id,
      nome: candidato.nome || '',
      email: candidato.email || '',
      foto: candidato.foto || null,
      descricao: candidato.descricao || '',
      formacao: candidato.formacao || '',
      area_interesse: candidato.area_interesse || '',
      habilidades: candidato.habilidades || '',
      curriculo: candidato.curriculo || null,
      certificados: certificadosArray,
      cpf: candidato.cpf || '',
      data_nascimento: candidato.data_nascimento || '',
      telefone: candidato.telefone || '',
      linkedin: candidato.linkedin || '',
      github: candidato.github || '',
      portfolio: candidato.portfolio || ''
      // cidade and estado are explicitly removed here
    };

    return NextResponse.json(candidatoFormatado);
  } catch (error) {
    console.error('Erro ao buscar candidato:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do candidato' },
      { status: 500 }
    );
  }
} 