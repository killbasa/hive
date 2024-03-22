import * as schema from './schema';
import { server } from '../server';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const initDb = async (): Promise<void> => {
	const sqlite = new Database('./data/sqlite.db');

	db = drizzle(sqlite, {
		schema
	});

	migrate(db, {
		migrationsFolder: './db'
	});

	server.log.info('Database connected');
};
