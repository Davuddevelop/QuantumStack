import { z } from 'zod';

export const AIRequestSchema = z.object({
  body: z.object({
    feature: z.enum(['health', 'planner', 'connect']),
    communityId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid format').optional(),
    data: z.record(z.string(), z.any()),
  }),
});

export const CommunityRequestSchema = z.object({
  query: z.object({
    id: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid format'),
  }),
});
