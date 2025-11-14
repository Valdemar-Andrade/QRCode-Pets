import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import Image from 'next/image';
import { PetImageLightbox } from '@/components/ui/PetImageLightbox';

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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 py-8 px-4 relative overflow-hidden">
      {/* Decorações de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-7xl opacity-10 animate-bounce" style={{ animationDuration: '4s' }}>🐾</div>
        <div className="absolute top-32 right-20 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>🐶</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>🐱</div>
        <div className="absolute bottom-20 right-10 text-7xl opacity-10 animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}>❤️</div>
        <div className="absolute top-60 left-1/3 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '4.8s', animationDelay: '2s' }}>⭐</div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header com status perdido */}
        {pet.isLost && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-t-3xl text-center font-bold text-xl shadow-lg mb-4 animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">⚠️</span>
              <span>PET PERDIDO - PRECISA DE AJUDA</span>
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-200">
          {/* Foto do pet */}
          <div className="relative w-full h-80 bg-gradient-to-br from-pink-100 to-purple-100">
            <PetImageLightbox
              imageUrl={pet.photoUrl}
              alt={pet.name}
              className="h-full"
            />
            {!pet.isLost && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-10">
                <span className="text-2xl">❤️</span>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
                {pet.name}
              </h1>
              <p className="text-xl text-gray-600">
                {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
              </p>
            </div>

            {/* Grid de informações */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <p className="text-sm text-gray-500 mb-1">📅 Data de Nascimento ou Adoção</p>
                <p className="font-semibold text-gray-800">{formatDate(pet.birthDate)}</p>
              </div>
              {pet.gender && (
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                  <p className="text-sm text-gray-500 mb-1">⚧️ Gênero</p>
                  <p className="font-semibold text-gray-800">{pet.gender}</p>
                </div>
              )}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-500 mb-1">🎨 Cor</p>
                <p className="font-semibold text-gray-800">{pet.color || 'Não informado'}</p>
              </div>
              {pet.weight && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-gray-500 mb-1">⚖️ Peso</p>
                  <p className="font-semibold text-gray-800">{pet.weight} kg</p>
                </div>
              )}
            </div>

            {/* Informações médicas */}
            {pet.medicalInfo && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 shadow-md">
                <h2 className="font-bold text-yellow-900 mb-2 text-lg flex items-center gap-2">
                  <span>⚕️</span>
                  <span>Informações Médicas Importantes</span>
                </h2>
                <p className="text-yellow-800">{pet.medicalInfo}</p>
              </div>
            )}

            {/* Informações de contato */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                <span>👤</span>
                <span>Informações do Dono</span>
              </h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong className="text-pink-600">Nome:</strong> {pet.owner.name}
                </p>
                <p className="text-gray-700">
                  <strong className="text-pink-600">Email:</strong>{' '}
                  <a
                    href={`mailto:${pet.owner.email}`}
                    className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                  >
                    {pet.owner.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Mensagem de ajuda se perdido */}
            {pet.isLost && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-6 shadow-lg">
                <p className="text-red-900 font-bold mb-2 text-lg flex items-center gap-2">
                  <span>🚨</span>
                  <span>Este pet está perdido!</span>
                </p>
                <p className="text-red-800">
                  Se você encontrou este pet, entre em contato com o dono através
                  do email acima. Sua ajuda é muito importante! 🙏
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-lg flex items-center justify-center gap-2">
            <span>🐾</span>
            <span>QR Code Pets - Sistema de Identificação de Animais</span>
            <span>🐾</span>
          </p>
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
