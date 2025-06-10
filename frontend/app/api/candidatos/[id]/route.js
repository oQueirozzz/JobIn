import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

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

    const candidato = await prisma.usuario.findUnique({
      where: {
        id: candidatoId
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        estado: true,
        formacao: true,
        experiencia: true,
        habilidades: true,
        idiomas: true,
        curriculo: true,
        linkedin: true,
        github: true,
        portfolio: true,
        telefone: true,
        data_nascimento: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!candidato) {
      return NextResponse.json(
        { error: 'Candidato não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(candidato);
  } catch (error) {
    console.error('Erro ao buscar candidato:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do candidato' },
      { status: 500 }
    );
  }
} 