import { db } from '../../db/client';
import { channels } from '../../db/schema';
import { formatTags } from '../youtube/channels';
import { mv, mvDir } from '../utils';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { ChannelMetadata } from './types';

export const CHANNEL_DL_PATH = (channelId: string): string => `${DOWNLOADS_DIR}/${channelId}`;

export const CHANNEL_PATH = (channelId: string): string => `${MEDIA_DIR}/${channelId}`;

export async function indexChannels(): Promise<void> {
	const channelsDir = await readdir(MEDIA_DIR);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		channelsDir.map((channelId) => {
			return indexChannel(channelId);
		})
	);
}

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
	await mvDir(`${source}/assets`, `${target}/assets`);
}

export async function readChannelMetadata(channelId: string): Promise<ChannelMetadata> {
	const data = await readFile(`${CHANNEL_PATH(channelId)}/assets/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export function isChannelDownloaded(channelId: string): boolean {
	return existsSync(`${CHANNEL_PATH(channelId)}/assets/metadata.json`);
}
