import * as schema from './schema';
import { config } from '../lib/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const initDb = async (): Promise<void> => {
	// eslint-disable-next-line import/no-named-as-default-member
	const pool = await new pg.Pool({
		connectionString: config.DATABASE_URL
	}).connect();

	db = drizzle(pool, {
		schema
	});

	await migrate(db, {
		migrationsFolder: './db'
	});
};
