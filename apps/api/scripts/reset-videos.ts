import { db } from './load-db.js';
import * as schema from '../src/db/schema.js';
import { existsSync, readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

await db.delete(schema.playlists);
await db.update(schema.videos).set({ downloadStatus: 'pending' });

const promises: Promise<unknown>[] = [
	rm(resolve('./data/downloads'), {
		recursive: true,
		force: true,
	}),
];

for (const channel of readdirSync(resolve('./data/media'))) {
	const paths: string[] = [];

	const channelPath = `./data/media/${channel}`;
	paths.push(resolve(`${channelPath}/assets/archive.txt`));

	const videoPath = `${channelPath}/videos`;
	if (existsSync(videoPath)) {
		for (const video of readdirSync(resolve(`${channelPath}/videos`))) {
			paths.push(resolve(`${videoPath}/${video}/video.mp4`));
		}
	}

	for (const path of paths) {
		promises.push(
			rm(path, {
				recursive: true,
				force: true,
			}),
		);
	}
}

await Promise.all(promises);
