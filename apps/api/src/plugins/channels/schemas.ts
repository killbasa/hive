import { z } from 'zod';

export const ChannelQuerySchema = z.object({
	page: z.coerce.number().optional().default(1),
	status: z.enum(['done', 'pending']).optional()
});

export const ChannelPostSchema = z.object({
	id: z.string()
});
