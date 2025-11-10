import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET - Buscar pet por QR Code ID (página pública)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
    })

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR Code não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      pet: qrCode.pet,
      qrCode: {
        id: qrCode.id,
        publicUrl: qrCode.publicUrl,
      },
    })
  } catch (error) {
    console.error('Error fetching pet by QR code:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pet' },
      { status: 500 }
    )
  }
}

