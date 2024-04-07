import * as schema from '../src/db/schema';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { resolve } from 'node:path';

process.loadEnvFile(resolve('./.env'));

const sqlite = new Database('./data/sqlite.db');

export const db = drizzle(sqlite, {
	schema
});
