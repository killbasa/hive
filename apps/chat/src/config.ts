import { z } from 'zod';

const EnvSchema = z.object({
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().default('password')
});

export const config = EnvSchema.parse(process.env);
