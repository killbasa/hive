import { z } from 'zod';

const EnvSchema = z.object({
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_PASSWORD: z.string()
});

export const config = EnvSchema.parse(process.env);
