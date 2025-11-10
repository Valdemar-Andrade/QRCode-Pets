import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  breed: z.string().optional(),
  species: z.string().min(1, 'A espécie é obrigatória'),
  birthDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  color: z.string().optional(),
  weight: z.number().positive().optional(),
  medicalInfo: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  isLost: z.boolean().optional().default(false),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
