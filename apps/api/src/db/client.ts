import * as schema from './schema.js';
import { DATA_DIR, isTesting } from '../lib/constants.js';
import { server } from '../server.js';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const initDb = (): void => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (db) {
		return;
	}

	const path = isTesting ? ':memory:' : `${DATA_DIR}/sqlite.db`;

	if (isTesting) {
		server.log.warn('using in-memory database for testing');
	}

	const sqlite = new Database(path);
	sqlite.pragma('journal_mode = WAL');

	db = drizzle(sqlite, {
		schema,
	});

	server.log.info('database connected');

	server.log.info('running migrations');

	migrate(db, {
		migrationsFolder: './db',
	});

	server.log.info('migrations complete');
};
