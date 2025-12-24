import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const createThesisSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title must be at most 500 characters'),
  abstract: z.string().min(1, 'Abstract is required').max(5000, 'Abstract must be at most 5000 characters'),
  author_id: z.number().int().positive('Author ID must be a positive integer'),
  year: z.number().int().min(1900, 'Year must be at least 1900').max(currentYear, `Year must be at most ${currentYear}`),
  type: z.enum(['Master', 'Doctorate', 'Specialization in Medicine', 'Proficiency in Art']),
  university_id: z.number().int().positive('University ID must be a positive integer'),
  institute_id: z.number().int().positive('Institute ID must be a positive integer'),
  num_pages: z.number().int().positive('Number of pages must be positive'),
  language: z.string().min(1, 'Language is required').max(50, 'Language must be at most 50 characters'),
  submission_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Submission date must be in YYYY-MM-DD format'),
  supervisor_ids: z.array(z.number().int().positive()).min(1, 'At least one supervisor is required'),
  co_supervisor_id: z.number().int().positive().optional().nullable(),
  subject_topic_ids: z.array(z.number().int().positive()).default([]),
  keywords: z.array(z.string().min(1)).default([]),
});

export const updateThesisSchema = createThesisSchema.partial();

export const searchThesisSchema = z.object({
  query: z.string().optional(),
  author_id: z.number().int().positive().optional(),
  university_id: z.number().int().positive().optional(),
  institute_id: z.number().int().positive().optional(),
  type: z.enum(['Master', 'Doctorate', 'Specialization in Medicine', 'Proficiency in Art']).optional(),
  language: z.string().optional(),
  year_from: z.number().int().min(1900).optional(),
  year_to: z.number().int().max(currentYear).optional(),
});

export type CreateThesisInput = z.infer<typeof createThesisSchema>;
export type UpdateThesisInput = z.infer<typeof updateThesisSchema>;
export type SearchThesisInput = z.infer<typeof searchThesisSchema>;



