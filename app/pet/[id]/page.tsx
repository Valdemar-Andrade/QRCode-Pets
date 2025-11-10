import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Image from 'next/image';

interface PetPageProps {
  params: {
    id: string;
  };
}

async function getPetByQRCode(qrCodeId: string) {
  try {
    // Buscar QR Code pelo ID
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrCodeId },
      include: {
        pet: {
          include: {
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return qrCode?.pet || null;
  } catch (error) {
    console.error('Error fetching pet:', error);
    return null;
  }
}

export default async function PetPage({ params }: PetPageProps) {
  const pet = await getPetByQRCode(params.id);

  if (!pet) {
    notFound();
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header com status perdido */}
        {pet.isLost && (
          <div className="bg-red-500 text-white p-4 rounded-t-lg text-center font-bold text-lg">
            ⚠️ PET PERDIDO - PRECISA DE AJUDA
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Foto do pet */}
          <div className="relative w-full h-64 bg-gray-200">
            {pet.photoUrl ? (
              <Image
                src={pet.photoUrl}
                alt={pet.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
                🐾
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {pet.name}
              </h1>
              <p className="text-lg text-gray-600">
                {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
              </p>
            </div>

            {/* Grid de informações */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="font-semibold">{formatDate(pet.birthDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cor</p>
                <p className="font-semibold">{pet.color || 'Não informado'}</p>
              </div>
              {pet.weight && (
                <div>
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="font-semibold">{pet.weight} kg</p>
                </div>
              )}
            </div>

            {/* Informações médicas */}
            {pet.medicalInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h2 className="font-semibold text-yellow-900 mb-2">
                  ⚕️ Informações Médicas Importantes
                </h2>
                <p className="text-yellow-800 text-sm">{pet.medicalInfo}</p>
              </div>
            )}

            {/* Informações de contato */}
            <div className="border-t pt-4">
              <h2 className="font-semibold text-gray-900 mb-2">
                👤 Informações do Dono
              </h2>
              <p className="text-gray-700">
                <strong>Nome:</strong> {pet.owner.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${pet.owner.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {pet.owner.email}
                </a>
              </p>
            </div>

            {/* Mensagem de ajuda se perdido */}
            {pet.isLost && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-red-900 font-semibold mb-2">
                  Este pet está perdido!
                </p>
                <p className="text-red-800 text-sm">
                  Se você encontrou este pet, entre em contato com o dono através
                  do email acima. Sua ajuda é muito importante!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>QR Code Pets - Sistema de Identificação de Animais</p>
        </div>
      </div>
    </div>
  );
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PetPageProps) {
  const pet = await getPetByQRCode(params.id);

  if (!pet) {
    return {
      title: 'Pet não encontrado',
    };
  }

  return {
    title: `${pet.name} - QR Code Pets`,
    description: `Informações sobre ${pet.name}, um ${pet.species}${pet.breed ? ` da raça ${pet.breed}` : ''}`,
  };
}
