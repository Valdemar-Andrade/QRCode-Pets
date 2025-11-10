import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticateRequest } from '@/lib/auth/middleware';
import { generateQRCodeImage, generateQRCodeSVG } from '@/lib/qrcode/generator';

// GET - Buscar pet por QR Code ID (público)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar QR Code pelo ID
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: params.id },
      include: {
        pet: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!qrCode || !qrCode.pet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ pet: qrCode.pet }, { status: 200 });
  } catch (error) {
    console.error('Get pet by QR code error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pet' },
      { status: 500 }
    );
  }
}

// GET - Gerar imagem do QR Code
export async function POST(
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
    // Verificar se o QR Code existe e o pet pertence ao usuário
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: params.id },
      include: {
        pet: true,
      },
    });

    if (!qrCode || !qrCode.pet) {
      return NextResponse.json(
        { error: 'Pet não encontrado' },
        { status: 404 }
      );
    }

    if (qrCode.pet.ownerId !== auth.user!.userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const format = body.format || 'png'; // 'png' ou 'svg'

    if (format === 'svg') {
      const svg = await generateQRCodeSVG(params.id);
      return NextResponse.json({ qrCode: svg, format: 'svg' }, { status: 200 });
    } else {
      const dataUrl = await generateQRCodeImage(params.id);
      return NextResponse.json({ qrCode: dataUrl, format: 'png' }, { status: 200 });
    }
  } catch (error) {
    console.error('Generate QR code error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar QR Code' },
      { status: 500 }
    );
  }
}
