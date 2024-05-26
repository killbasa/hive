import type { Config } from 'drizzle-kit';

export default {
	dialect: 'sqlite',
	schema: './src/db/schema.ts',
	out: './db',
	dbCredentials: {
		url: './data/sqlite.db',
	},
	strict: true,
} satisfies Config;
