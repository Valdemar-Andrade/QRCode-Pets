import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';
import { updatePetSchema } from '@/lib/validations/pet';

// GET - Buscar pet específico (público ou privado)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
      include: {
        qrCode: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ pet }, { status: 200 });
  } catch (error) {
    console.error('Get pet error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pet' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar pet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);

  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status || 401 }
    );
  }

  try {
    // Verificar se o pet existe e pertence ao usuário
    const existingPet = await prisma.pet.findUnique({
      where: { id: params.id },
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      );
    }

    if (existingPet.ownerId !== auth.user!.userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updatePetSchema.parse(body);

    // Atualizar pet
    const pet = await prisma.pet.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        qrCode: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ pet }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update pet error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pet' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);

  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status || 401 }
    );
  }

  try {
    // Verificar se o pet existe e pertence ao usuário
    const existingPet = await prisma.pet.findUnique({
      where: { id: params.id },
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      );
    }

    if (existingPet.ownerId !== auth.user!.userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    // Deletar pet (QR Code será deletado em cascade)
    await prisma.pet.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Pet deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete pet error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pet' },
      { status: 500 }
    );
  }
}
