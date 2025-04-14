import { isTesting } from './constants.js';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const ConfigSchema = z.object({
	VERSION: z.string(),
	PORT: z.coerce.number(),
	AUTH_SECRET: z.string(),
	AUTH_ORIGIN: z.string(),
	COOKIE_NAME: z.string(),
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().default(6379),
	REDIS_PASSWORD: z.string().default('password'),
	YT_API_KEY: z.string(),
	METRICS_ENABLED: z.coerce.boolean().default(false),
});

export type HiveConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): HiveConfig {
	if (isTesting) {
		return {
			VERSION: '',
			PORT: 0,
			AUTH_SECRET: '',
			AUTH_ORIGIN: '',
			COOKIE_NAME: '',
			REDIS_HOST: '',
			REDIS_PORT: 0,
			REDIS_PASSWORD: '',
			YT_API_KEY: '',
			METRICS_ENABLED: false,
		};
	}

	if (existsSync(resolve('.env'))) {
		loadEnvFile();
	}

	const obj = {
		VERSION: process.env.npm_package_version,
		PORT: 3002,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_ORIGIN: process.env.AUTH_ORIGIN,
		COOKIE_NAME: 'hive',
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PORT: process.env.REDIS_PORT,
		REDIS_PASSWORD: process.env.REDIS_PASSWORD,
		YT_API_KEY: process.env.YT_API_KEY,
		METRICS_ENABLED: process.env.METRICS_ENABLED,
	} satisfies Record<keyof z.infer<typeof ConfigSchema>, unknown>;

	return ConfigSchema.parse(obj);
}
