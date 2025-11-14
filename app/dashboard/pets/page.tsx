'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPetSchema, type CreatePetInput } from '@/lib/validations/pet';
import Image from 'next/image';

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  gender: string | null;
  birthDate: Date | null;
  color: string | null;
  weight: number | null;
  isLost: boolean;
  medicalInfo: string | null;
  photoUrl: string | null;
  qrCode: {
    id: string;
    publicUrl: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>('');

  const [photoBase64, setPhotoBase64] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
  });

  const photoUrl = watch('photoUrl');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erro ao buscar pets');
      }
      const data = await response.json();
      setPets(data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreatePetInput) => {
    try {
      // Se houver foto em base64, usar ela
      const petData = {
        ...data,
        photoUrl: photoBase64 || data.photoUrl || '',
      };

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao criar pet');
        return;
      }

      setIsModalOpen(false);
      reset();
      setPhotoBase64('');
      fetchPets();
    } catch (error) {
      console.error('Error creating pet:', error);
      alert('Erro ao criar pet');
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Tem certeza que deseja deletar este pet?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar pet');
      }

      fetchPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert('Erro ao deletar pet');
    }
  };

  const handleToggleLost = async (pet: Pet) => {
    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isLost: !pet.isLost,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      fetchPets();
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Erro ao atualizar status');
    }
  };

  const handleShowQR = async (pet: Pet) => {
    if (!pet.qrCode) {
      alert('QR Code não encontrado para este pet');
      return;
    }

    setSelectedPet(pet);
    setIsQRModalOpen(true);
    setIsGeneratingQR(true);

    try {
      const response = await fetch(`/api/pets/qrcode/${pet.qrCode.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'png' }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar QR Code');
      }

      const data = await response.json();
      setQrCodeImage(data.qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Erro ao gerar QR Code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeImage) return;

    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qr-code-${selectedPet?.name || 'pet'}.png`;
    link.click();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
          <span>🐾</span>
          <span>Meus Pets</span>
        </h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          + Adicionar Pet 🐶
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card className="border-2 border-pink-200">
          <CardBody>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-gray-600 mb-4 text-lg">
                Você ainda não tem pets cadastrados.
              </p>
              <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Adicionar Primeiro Pet 🎉
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="border-2 border-pink-200 hover:border-pink-300 transition-all hover:shadow-xl">
              <div 
                className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 cursor-pointer"
                onClick={() => {
                  if (pet.photoUrl) {
                    setLightboxImage(pet.photoUrl);
                    setLightboxAlt(pet.name);
                  }
                }}
              >
                {pet.photoUrl ? (
                  <>
                    <Image
                      src={pet.photoUrl}
                      alt={pet.name}
                      fill
                      className="object-cover hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                        Clique para ampliar 🔍
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-6xl">
                    🐾
                  </div>
                )}
                {pet.isLost && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    ⚠️ PERDIDO
                  </div>
                )}
              </div>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
                <p className="text-gray-600 text-sm">
                  {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {pet.gender && (
                    <p>
                      <strong>Gênero:</strong> {pet.gender}
                    </p>
                  )}
                  <p>
                    <strong>Cor:</strong> {pet.color || 'Não informado'}
                  </p>
                  {pet.weight && (
                    <p>
                      <strong>Peso:</strong> {pet.weight} kg
                    </p>
                  )}
                  <p>
                    <strong>Nascimento:</strong> {formatDate(pet.birthDate)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pet.qrCode && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowQR(pet)}
                    >
                      Ver QR Code
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={pet.isLost ? 'secondary' : 'outline'}
                    onClick={() => handleToggleLost(pet)}
                  >
                    {pet.isLost ? 'Marcar Encontrado' : 'Marcar Perdido'}
                  </Button>
                  <Link href={`/dashboard/pets/${pet.id}`}>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(pet.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Adicionar Pet */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
          setPhotoBase64('');
        }}
        title={
          <div className="flex items-center gap-2">
            <span>🐾</span>
            <span>Adicionar Novo Pet</span>
          </div>
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Informações Básicas */}
          <div className="space-y-4 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📝</span>
              <span>Informações Básicas</span>
            </h3>
            
            <Input
              label="Nome *"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Nome do pet"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Espécie *"
                {...register('species')}
                error={errors.species?.message}
                placeholder="Ex: Cachorro, Gato, etc."
              />

              <Input
                label="Raça"
                {...register('breed')}
                error={errors.breed?.message}
                placeholder="Raça do pet"
              />
            </div>

            <Select
              label="Gênero"
              {...register('gender')}
              error={errors.gender?.message}
              options={[
                { value: 'Macho', label: 'Macho' },
                { value: 'Fêmea', label: 'Fêmea' },
              ]}
            />
          </div>

          {/* Características Físicas */}
          <div className="space-y-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎨</span>
              <span>Características Físicas</span>
            </h3>

            <Input
              label="Data de Nascimento ou Adoção"
              type="date"
              {...register('birthDate')}
              error={errors.birthDate?.message}
              helperText="Se não souber a data exata, use a data de adoção ou uma data aproximada"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cor"
                {...register('color')}
                error={errors.color?.message}
                placeholder="Cor do pet"
              />

              <Input
                label="Peso (kg)"
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                error={errors.weight?.message}
                placeholder="Peso em kg"
              />
            </div>
          </div>

          {/* Foto */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📸</span>
              <span>Foto do Pet</span>
            </h3>
            <ImageUpload
              value={photoBase64 || photoUrl || ''}
              onChange={(base64) => {
                setPhotoBase64(base64);
                setValue('photoUrl', base64);
              }}
              error={errors.photoUrl?.message}
            />
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>⚕️</span>
              <span>Informações Adicionais</span>
            </h3>

            <Textarea
              label="Informações Médicas"
              {...register('medicalInfo')}
              error={errors.medicalInfo?.message}
              placeholder="Alergias, medicações, condições especiais, etc."
              rows={4}
            />

            <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isLost"
                {...register('isLost')}
                className="mr-3 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="isLost" className="text-sm font-medium text-gray-700 cursor-pointer">
                ⚠️ Pet está perdido
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar Pet</Button>
          </div>
        </form>
      </Modal>

      {/* Modal de QR Code */}
      <Modal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          setSelectedPet(null);
          setQrCodeImage('');
        }}
        title={`QR Code - ${selectedPet?.name || ''}`}
        size="md"
      >
        <div className="space-y-4">
          {isGeneratingQR ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Gerando QR Code...</p>
              </div>
            </div>
          ) : qrCodeImage ? (
            <>
              <div className="flex justify-center">
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  className="border border-gray-200 rounded-lg"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  URL pública: {selectedPet?.qrCode?.publicUrl}
                </p>
                <Button onClick={downloadQRCode} className="w-full">
                  Download QR Code
                </Button>
                <p className="text-xs text-gray-500">
                  Imprima este QR Code e cole na coleira do seu pet
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">
              Erro ao gerar QR Code
            </p>
          )}
        </div>
      </Modal>

      {/* Lightbox de Imagem */}
      <ImageLightbox
        isOpen={lightboxImage !== null}
        onClose={() => setLightboxImage(null)}
        imageUrl={lightboxImage || ''}
        alt={lightboxAlt}
      />
    </div>
  );
}

