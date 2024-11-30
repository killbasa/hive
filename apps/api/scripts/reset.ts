import { db } from './load-db.js';
import * as schema from '../src/db/schema.js';
import { readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

await db.delete(schema.playlists);
await db.delete(schema.videos);
await db.delete(schema.channels);
await db.delete(schema.settings);

const promises: Promise<void>[] = [];

for (const dir of ['downloads', 'media']) {
	const path = resolve('./data', dir);

	for (const file of readdirSync(path)) {
		promises.push(rm(resolve(path, file), { recursive: true, force: true }));
	}
}

await Promise.all(promises);
