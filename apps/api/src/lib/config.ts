import { z } from 'zod';
import type { ConnectionOptions } from 'bullmq';

const envBool = z
	.string()
	.optional()
	.transform((val) => val === 'true');

const EnvSchema = z.object({
	HOST: z.string().default('localhost'),
	PORT: z.coerce.number().default(3001),
	DATABASE_URL: z.string().default('postgres://user:password@localhost:5432/hive'),
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().default('password'),
	YT_API_KEY: z.string(),
	DISABLE_WORKERS: envBool
});

export const config = EnvSchema.parse(process.env);

export const RedisConnectionOptions: ConnectionOptions = {
	host: config.REDIS_HOST,
	port: config.REDIS_PORT,
	password: config.REDIS_PASSWORD
};
