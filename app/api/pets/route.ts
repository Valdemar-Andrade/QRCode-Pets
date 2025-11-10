import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';
import { createPetSchema } from '@/lib/validations/pet';
import { generateQRCodeId, getPublicUrl } from '@/lib/qrcode/generator';

// GET - Listar pets do usuário
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status || 401 }
    );
  }

  try {
    const pets = await prisma.pet.findMany({
      where: {
        ownerId: auth.user!.userId,
      },
      include: {
        qrCode: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ pets }, { status: 200 });
  } catch (error) {
    console.error('Get pets error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pets' },
      { status: 500 }
    );
  }
}

// POST - Criar novo pet
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);

  if (auth.error) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status || 401 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = createPetSchema.parse(body);

    // Gerar QR Code único
    const qrCodeId = generateQRCodeId();
    const publicUrl = getPublicUrl(qrCodeId);

    // Criar pet e QR Code em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Primeiro criar o pet
      const pet = await tx.pet.create({
        data: {
          name: validatedData.name,
          breed: validatedData.breed,
          species: validatedData.species,
          birthDate: validatedData.birthDate,
          color: validatedData.color,
          weight: validatedData.weight,
          medicalInfo: validatedData.medicalInfo,
          photoUrl: validatedData.photoUrl || null,
          isLost: validatedData.isLost || false,
          ownerId: auth.user!.userId,
        },
      });

      // Depois criar o QR Code vinculado ao pet
      await tx.qRCode.create({
        data: {
          id: qrCodeId,
          petId: pet.id,
          publicUrl,
        },
      });

      // Retornar pet com QR Code
      return await tx.pet.findUnique({
        where: { id: pet.id },
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
    });

    return NextResponse.json({ pet: result }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create pet error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pet' },
      { status: 500 }
    );
  }
}
