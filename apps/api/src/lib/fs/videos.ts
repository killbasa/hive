import { mv } from './utils.js';
import { db } from '../../db/client.js';
import { videos } from '../../db/schema.js';
import { server } from '../../server.js';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants.js';
import { parseDurationString } from '@hive/common';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { VideoMetadata } from './types.js';
import type { VideoStatus, VideoType } from '../../plugins/videos/schema.js';

export const VIDEO_DL_PATH = (channelId: string, videoId: string): string => `${DOWNLOADS_DIR}/${channelId}/videos/${videoId}`;

export const VIDEO_PATH = (channelId: string, videoId: string): string => `${MEDIA_DIR}/${channelId}/videos/${videoId}`;

export async function indexVideo(channelId: string, videoId: string): Promise<void> {
	server.log.debug(`indexing video: ${videoId}`);
	const metadata = await readVideoMetadata(channelId, videoId);

	let type: VideoType = 'video';
	let status: Exclude<VideoStatus, 'unknown'> = 'none';

	if (metadata.aspect_ratio < 1) {
		type = 'short';
	} else if (metadata.live_status === 'not_live') {
		type = 'video';
	} else {
		type = 'stream';

		if (metadata.live_status === 'is_upcoming') {
			status = 'upcoming';
		} else if (metadata.live_status === 'was_live') {
			status = 'past';
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		} else if (metadata.live_status === 'is_live' || metadata.live_status === 'post_live') {
			status = 'live';
		}
	}

	const data: typeof videos.$inferInsert = {
		id: metadata.id,
		channelId,
		title: metadata.title,
		description: metadata.description,
		duration: parseDurationString(metadata.duration_string),
		fileSize: metadata.filesize_approx,
		uploadDate: metadata.timestamp,
		type,
		status,
		downloadStatus: 'pending',
	};

	await db //
		.insert(videos)
		.values(data)
		.onConflictDoUpdate({
			target: videos.id,
			set: data,
		})
		.execute();

	server.log.debug(`indexed video: ${videoId}`);
}

export async function moveVideoAssets(channelId: string, videoId: string): Promise<boolean> {
	const source = VIDEO_DL_PATH(channelId, videoId);
	const target = VIDEO_PATH(channelId, videoId);
	const assets = await readdir(source);

	try {
		await mkdir(target, { recursive: true });

		await Promise.all(
			assets.map(async (asset) => {
				if (asset === 'metadata.info.json') {
					await mv(`${source}/metadata.info.json`, `${target}/metadata.json`);
					return;
				}
				await mv(`${source}/${asset}`, `${target}/${asset}`);
			}),
		);

		await rm(source, { recursive: true, force: true });

		return true;
	} catch (err) {
		server.log.error(err);
	}

	return false;
}

export async function readVideoMetadata(channelId: string, videoId: string): Promise<VideoMetadata> {
	const data = await readFile(`${VIDEO_PATH(channelId, videoId)}/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export function isVideoDownloaded(channelId: string, videoId: string, options: { dir: 'download' | 'media' }): boolean {
	let path: string;

	if (options.dir === 'download') {
		path = resolve(`${VIDEO_DL_PATH(channelId, videoId)}/metadata.info.json`);
	} else {
		path = resolve(`${VIDEO_PATH(channelId, videoId)}/metadata.json`);
	}

	return existsSync(path);
}
