import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const candidaturaId = params.id;
    const { status } = await request.json();

    if (!status || !['APROVADO', 'REJEITADO', 'EM_ESPERA'].includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Buscar a candidatura para verificar se a empresa tem permissão
    const candidatura = await prisma.candidatura.findUnique({
      where: {
        id: candidaturaId
      },
      include: {
        vaga: true
      }
    });

    if (!candidatura) {
      return NextResponse.json(
        { error: 'Candidatura não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se o usuário é a empresa dona da vaga
    if (candidatura.vaga.empresa_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Não autorizado a atualizar esta candidatura' },
        { status: 403 }
      );
    }

    // Atualizar o status da candidatura
    const candidaturaAtualizada = await prisma.candidatura.update({
      where: {
        id: candidaturaId
      },
      data: {
        status
      }
    });

    return NextResponse.json(candidaturaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar status da candidatura:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status da candidatura' },
      { status: 500 }
    );
  }
} 