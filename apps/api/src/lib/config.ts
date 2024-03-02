import { z } from 'zod';

const EnvSchema = z.object({
	HOST: z.string().default('localhost'),
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_PASSWORD: z.string()
});

export const config = EnvSchema.parse(process.env);
