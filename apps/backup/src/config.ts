import { z } from 'zod';

const EnvSchema = z.object({
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_PASSWORD: z.string(),
	MINIO_ENDPOINT: z.string(),
	MINIO_PORT: z.coerce.number(),
	MINIO_BUCKET: z.string(),
	MINIO_KEYID: z.string(),
	MINIO_SECRET: z.string()
});

export const config = EnvSchema.parse(process.env);
