import * as schema from './schema.js';
import { server } from '../server.js';
import { DATA_DIR, isTesting } from '../lib/constants.js';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const initDb = async (): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (db) return;

	const path = isTesting ? ':memory:' : `${DATA_DIR}/sqlite.db`;
	const sqlite = new Database(path);
	sqlite.pragma('journal_mode = WAL');

	db = drizzle(sqlite, {
		schema
	});

	migrate(db, {
		migrationsFolder: './db'
	});

	server.log.info('database connected');
};
