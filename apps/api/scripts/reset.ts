import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as schema from '../src/db/schema';
import { db } from './load-db';

await db.delete(schema.comments);
await db.delete(schema.streamComments);
await db.delete(schema.playlists);
await db.delete(schema.videos);
await db.delete(schema.channels);

await Promise.all([
	rm(resolve('./data/downloads'), { recursive: true, force: true }), //
	rm(resolve('./data/media'), { recursive: true, force: true }),
]);
