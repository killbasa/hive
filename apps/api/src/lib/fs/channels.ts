import { mv } from './utils.js';
import { db } from '../../db/client.js';
import { channels } from '../../db/schema.js';
import { server } from '../../server.js';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants.js';
import { formatTags } from '../youtube/channels.js';
import { resolve } from 'node:path';
import { open, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { ChannelMetadata } from './types.js';

export const CHANNEL_DL_PATH = (channelId: string): string => `${DOWNLOADS_DIR}/${channelId}`;

export const CHANNEL_PATH = (channelId: string): string => `${MEDIA_DIR}/${channelId}`;

export async function indexChannel(channelId: string): Promise<void> {
	const metadata = await readChannelMetadata(channelId);

	await db
		.insert(channels)
		.values({
			id: metadata.channel_id,
			customUrl: metadata.id,
			name: metadata.channel,
			description: metadata.description,
			tags: formatTags(metadata.tags),
		})
		.onConflictDoNothing({ target: channels.id })
		.execute();
}

export async function moveChannel(channelId: string): Promise<boolean> {
	const source = CHANNEL_DL_PATH(channelId);
	const target = CHANNEL_PATH(channelId);

	try {
		await Promise.all([
			mv(`${source}/assets/thumbnail.info.json`, `${target}/assets/metadata.json`),
			mv(`${source}/assets/thumbnail.avatar_uncropped.jpg`, `${target}/assets/avatar.jpg`),
			mv(`${source}/assets/thumbnail.12.jpg`, `${target}/assets/banner.jpg`),
		]);

		const fh = await open(`${target}/assets/archive.txt`, 'w');
		await fh.close();

		await rm(`${source}/assets`, { recursive: true, force: true });

		return true;
	} catch (err) {
		server.log.error(err);
	}

	return false;
}

export async function readChannelMetadata(channelId: string): Promise<ChannelMetadata> {
	const data = await readFile(`${CHANNEL_PATH(channelId)}/assets/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export function isChannelDownloaded(channelId: string): boolean {
	const path = `${CHANNEL_PATH(channelId)}/assets/metadata.json`;

	return existsSync(resolve(path));
}
