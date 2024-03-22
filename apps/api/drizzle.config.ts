import type { Config } from 'drizzle-kit';

export default {
	schema: './src/db/schema.ts',
	out: './db',
	driver: 'better-sqlite',
	dbCredentials: {
		url: './data/sqlite.db'
	},
	strict: true
} satisfies Config;
