import { isTesting } from './constants.js';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { execSync } from 'node:child_process';

type Unvalidated<T> = {
	[K in keyof T]: T[K] extends object ? Unvalidated<T[K]> : unknown;
};

const ConfigSchema = z.object({
	server: z.object({
		version: z.string(),
		port: z.coerce.number(),
	}),
	auth: z.object({
		secret: z.string(),
		origin: z.string(),
		cookie: z.string(),
	}),
	redis: z.object({
		host: z.string().default('localhost'),
		port: z.coerce.number().default(6379),
		password: z.string().default('password'),
	}),
	youtube: z.object({
		apikey: z.string(),
	}),
	metrics: z.object({
		enabled: z.coerce.boolean().default(false),
	}),
});

export type HiveConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): HiveConfig {
	if (isTesting) {
		return {
			server: {
				version: '0.1.0',
				port: 0,
			},
			auth: {
				secret: execSync('openssl rand -base64 32').toString().trim(),
				origin: 'http://localhost',
				cookie: 'hive',
			},
			redis: {
				host: 'redis_host',
				port: 6379,
				password: 'redis_password',
			},
			youtube: {
				apikey: 'apikey',
			},
			metrics: {
				enabled: false,
			},
		};
	}

	if (existsSync(resolve('.env'))) {
		loadEnvFile();
	}

	// const flags = process.argv.slice(2);

	const obj = {
		server: {
			version: process.env.npm_package_version,
			port: 3002,
		},
		auth: {
			secret: process.env.AUTH_SECRET,
			origin: process.env.AUTH_ORIGIN,
			cookie: 'hive',
		},
		redis: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			password: process.env.REDIS_PASSWORD,
		},
		youtube: {
			apikey: process.env.YT_API_KEY,
		},
		metrics: {
			enabled: process.env.METRICS_ENABLED,
		},
	} satisfies Unvalidated<HiveConfig>;

	return ConfigSchema.parse(obj);
}
