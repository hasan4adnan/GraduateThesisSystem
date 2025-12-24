import { z } from 'zod';

export const createPersonSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name must be at most 100 characters'),
  last_name: z.string().min(1, 'Last name is required').max(100, 'Last name must be at most 100 characters'),
  email: z.string().email('Invalid email address').max(200, 'Email must be at most 200 characters'),
  affiliation: z.string().max(200, 'Affiliation must be at most 200 characters').optional().nullable(),
});

export const updatePersonSchema = createPersonSchema.partial();

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;



