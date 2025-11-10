'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePetSchema, type UpdatePetInput } from '@/lib/validations/pet';

interface Pet {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  birthDate: Date | null;
  color: string | null;
  weight: number | null;
  isLost: boolean;
  medicalInfo: string | null;
  photoUrl: string | null;
}

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params.id as string;
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePetInput>({
    resolver: zodResolver(updatePetSchema),
  });

  useEffect(() => {
    fetchPet();
  }, [petId]);

  const fetchPet = async () => {
    try {
      const response = await fetch(`/api/pets/${petId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/dashboard/pets');
          return;
        }
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Erro ao buscar pet');
      }
      const data = await response.json();
      const petData = data.pet;
      setPet(petData);

      // Preencher formulário
      reset({
        name: petData.name,
        breed: petData.breed || '',
        species: petData.species,
        birthDate: petData.birthDate
          ? new Date(petData.birthDate).toISOString().split('T')[0]
          : '',
        color: petData.color || '',
        weight: petData.weight || undefined,
        photoUrl: petData.photoUrl || '',
        medicalInfo: petData.medicalInfo || '',
        isLost: petData.isLost,
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      alert('Erro ao carregar pet');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdatePetInput) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao atualizar pet');
        return;
      }

      router.push('/dashboard/pets');
      router.refresh();
    } catch (error) {
      console.error('Error updating pet:', error);
      alert('Erro ao atualizar pet');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Pet não encontrado</p>
        <Link href="/dashboard/pets">
          <Button>Voltar para Meus Pets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Editar Pet</h1>
        <Link href="/dashboard/pets">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome *"
              {...register('name')}
              error={errors.name?.message}
            />

            <Input
              label="Espécie *"
              {...register('species')}
              error={errors.species?.message}
            />

            <Input
              label="Raça"
              {...register('breed')}
              error={errors.breed?.message}
            />

            <Input
              label="Data de Nascimento"
              type="date"
              {...register('birthDate')}
              error={errors.birthDate?.message}
            />

            <Input
              label="Cor"
              {...register('color')}
              error={errors.color?.message}
            />

            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              error={errors.weight?.message}
            />

            <Input
              label="URL da Foto"
              type="url"
              {...register('photoUrl')}
              error={errors.photoUrl?.message}
            />

            <Textarea
              label="Informações Médicas"
              {...register('medicalInfo')}
              error={errors.medicalInfo?.message}
              rows={4}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isLost"
                {...register('isLost')}
                className="mr-2"
              />
              <label htmlFor="isLost" className="text-sm text-gray-700">
                Pet está perdido
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link href="/dashboard/pets">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" isLoading={isSaving}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

