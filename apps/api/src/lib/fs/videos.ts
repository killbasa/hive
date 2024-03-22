import { CHANNEL_DL_PATH, CHANNEL_PATH } from './channels';
import { db } from '../../db/client';
import { comments, videos } from '../../db/schema';
import { mv } from '../utils';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants';
import { server } from '../../server';
import { mkdir, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import type { VideoMetadata } from './types';

const VIDEO_DL_PATH = (channelId: string, videoId: string): string => `${DOWNLOADS_DIR}/${channelId}/videos/${videoId}`;

const VIDEO_PATH = (channelId: string, videoId: string): string => `${MEDIA_DIR}/${channelId}/videos/${videoId}`;

export async function indexVideos(channelId: string): Promise<void> {
	const videosDir = await readdir(`${CHANNEL_PATH(channelId)}/videos`);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		videosDir.map((videoId) => {
			return indexVideo(channelId, videoId);
		})
	);
}

export async function indexVideo(channelId: string, videoId: string): Promise<void> {
	server.log.debug(`Indexing video: ${videoId}`);
	const metadata = await readVideoMetadata(channelId, videoId);

	await db
		.insert(videos)
		.values({
			id: metadata.id,
			channelId,
			title: metadata.title,
			description: metadata.description,
			duration: metadata.duration_string,
			fileSize: metadata.filesize_approx,
			uploadDate: metadata.upload_date,
			type: metadata.was_live ? 'stream' : 'video',
			status: 'new',
			downloadStatus: 'pending'
		})
		.onConflictDoNothing({ target: videos.id })
		.execute();

	if (metadata.comments && metadata.comments.length > 0) {
		await db
			.insert(comments)
			.values(
				metadata.comments.map((comment) => {
					return {
						videoId: metadata.id,
						text: comment.text,
						author: comment.author,
						authorId: comment.author_id,
						timeText: comment._time_text,
						isUploader: comment.author_is_uploader,
						isFavorited: comment.is_favorited
					};
				})
			)
			.onConflictDoNothing({ target: comments.id })
			.execute();
	}

	server.log.debug(`Indexed video: ${videoId}`);
}

export async function moveVideo(channelId: string, videoId: string): Promise<void> {
	const source = VIDEO_DL_PATH(channelId, videoId);
	const target = VIDEO_PATH(channelId, videoId);

	await mv(`${source}/video.webm`, `${target}/video.webm`);
}

export async function moveVideoAssetsBulk(channelId: string): Promise<void> {
	const videoIds = await readdir(`${CHANNEL_DL_PATH(channelId)}/videos`);

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		videoIds.map((videoId) => {
			return moveVideoAssets(channelId, videoId);
		})
	);
}

export async function moveVideoAssets(channelId: string, videoId: string): Promise<void> {
	const source = VIDEO_DL_PATH(channelId, videoId);
	const target = VIDEO_PATH(channelId, videoId);
	const assets = await readdir(source);

	await mkdir(target, { recursive: true });

	await Promise.all(
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		assets.map((asset) => {
			if (asset === 'metadata.info.json') {
				return mv(`${source}/metadata.info.json`, `${target}/metadata.json`);
			}
			return mv(`${source}/${asset}`, `${target}/${asset}`);
		})
	);
}

export async function readVideoMetadata(channelId: string, videoId: string): Promise<VideoMetadata> {
	const data = await readFile(`${VIDEO_PATH(channelId, videoId)}/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export function isVideoDownloaded(channelId: string, videoId: string): boolean {
	return existsSync(`${VIDEO_PATH(channelId, videoId)}/metadata.json`);
}
