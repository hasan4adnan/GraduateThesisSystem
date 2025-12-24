import { z } from 'zod';

export const createInstituteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be at most 200 characters'),
  university_id: z.number().int().positive('University ID must be a positive integer'),
});

export const updateInstituteSchema = createInstituteSchema.partial();

export type CreateInstituteInput = z.infer<typeof createInstituteSchema>;
export type UpdateInstituteInput = z.infer<typeof updateInstituteSchema>;





