import { z } from 'zod';

export const createSubjectTopicSchema = z.object({
  topic_name: z.string().min(1, 'Topic name is required').max(200, 'Topic name must be at most 200 characters'),
});

export const updateSubjectTopicSchema = createSubjectTopicSchema.partial();

export type CreateSubjectTopicInput = z.infer<typeof createSubjectTopicSchema>;
export type UpdateSubjectTopicInput = z.infer<typeof updateSubjectTopicSchema>;



