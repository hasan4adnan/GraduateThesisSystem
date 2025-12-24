import { z } from 'zod';

export const createUniversitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be at most 200 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Country must be at most 100 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be at most 100 characters'),
});

export const updateUniversitySchema = createUniversitySchema.partial();

export type CreateUniversityInput = z.infer<typeof createUniversitySchema>;
export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;





