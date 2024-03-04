import { z } from 'zod';

const EnvSchema = z.object({
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().default('password'),
	MINIO_ENDPOINT: z.string().default('localhost'),
	MINIO_PORT: z.coerce.number().default(9000),
	MINIO_BUCKET: z.string().default('hive'),
	MINIO_KEYID: z.string().default('user'),
	MINIO_SECRET: z.string().default('password')
});

export const config = EnvSchema.parse(process.env);
