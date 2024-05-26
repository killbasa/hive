import { db } from './load-db';
import * as schema from '../src/db/schema';
import { readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

await db.delete(schema.comments);
await db.delete(schema.streamComments);
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
