import * as schema from '../src/db/schema.js';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

loadEnvFile(resolve('./.env'));

const sqlite = new Database('./data/sqlite.db');

export const db = drizzle(sqlite, {
	schema,
});
