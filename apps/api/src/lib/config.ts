import { z } from 'zod';
import type { ConnectionOptions } from 'bullmq';

process.loadEnvFile();

const ConfigSchema = z.object({
	PORT: z.coerce.number().default(3001),
	AUTH_SECRET: z.string(),
	AUTH_ORIGIN: z.string(),
	AUTH_COOKIE_NAME: z.string().default('hive-auth'),
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().default('password'),
	YT_API_KEY: z.string()
});

export const config = ConfigSchema.parse(process.env);

export const RedisConnectionOptions: ConnectionOptions = {
	host: config.REDIS_HOST,
	port: config.REDIS_PORT,
	password: config.REDIS_PASSWORD
};
