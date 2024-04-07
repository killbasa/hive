import { mv, mvDir } from './utils';
import { formatTags } from '../youtube/channels';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants';
import { db } from '../../db/client';
import { channels } from '../../db/schema';
import { open, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ChannelMetadata } from './types';

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
			tags: formatTags(metadata.tags)
		})
		.onConflictDoNothing({ target: channels.id })
		.execute();
}

export async function moveChannel(channelId: string): Promise<void> {
	const source = CHANNEL_DL_PATH(channelId);
	const target = CHANNEL_PATH(channelId);

	await mv(`${source}/assets/thumbnail.info.json`, `${source}/assets/metadata.json`);
	const fh = await open(`${source}/assets/archive.txt`, 'w');
	await fh.close();
	await mvDir(`${source}/assets`, `${target}/assets`);
}

export async function readChannelMetadata(channelId: string): Promise<ChannelMetadata> {
	const data = await readFile(`${CHANNEL_PATH(channelId)}/assets/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export function isChannelDownloaded(channelId: string, options: { dir: 'download' | 'media' }): boolean {
	let path: string;

	if (options.dir === 'download') {
		path = `${CHANNEL_DL_PATH(channelId)}/assets/thumbnail.info.json`;
	} else {
		path = `${CHANNEL_PATH(channelId)}/assets/metadata.json`;
	}

	return existsSync(resolve(path));
}
