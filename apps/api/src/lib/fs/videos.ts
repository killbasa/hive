import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { db } from '../../db/client.js';
import { comments, videos } from '../../db/schema.js';
import { server } from '../../server.js';
import { DOWNLOADS_DIR, MEDIA_DIR } from '../constants.js';
import { parseDurationString } from '../ytdlp/utils.js';
import type { CommentMetadata, VideoMetadata } from './types.js';
import { mv } from './utils.js';

export const VIDEO_DL_PATH = (channelId: string, videoId: string): string =>
	`${DOWNLOADS_DIR}/${channelId}/videos/${videoId}`;

export const VIDEO_PATH = (channelId: string, videoId: string): string => `${MEDIA_DIR}/${channelId}/videos/${videoId}`;

export async function indexVideo(channelId: string, videoId: string): Promise<void> {
	server.log.debug(`indexing video: ${videoId}`);
	const metadata = await readVideoMetadata(channelId, videoId);

	await db
		.insert(videos)
		.values({
			id: metadata.id,
			channelId,
			title: metadata.title,
			description: metadata.description,
			duration: parseDurationString(metadata.duration_string, 0),
			fileSize: metadata.filesize_approx,
			uploadDate: metadata.upload_date,
			type: metadata.was_live ? 'stream' : 'video',
			status: 'new',
			downloadStatus: 'pending',
		})
		.onConflictDoNothing({ target: videos.id })
		.execute();

	server.log.debug(`indexed video: ${videoId}`);
}

export async function indexComments(channelId: string, videoId: string): Promise<void> {
	server.log.debug(`indexing comments: ${videoId}`);
	const metadata = await readVideoComments(channelId, videoId);

	if (metadata.comments.length === 0) {
		server.log.debug('no comments found in metadata');
		return;
	}

	await db
		.insert(comments)
		.values(
			metadata.comments.map((comment) => {
				return {
					videoId,
					text: comment.text,
					author: comment.author,
					authorId: comment.author_id,
					timeText: comment._time_text,
					isUploader: comment.author_is_uploader,
					isFavorited: comment.is_favorited,
				};
			}),
		)
		.onConflictDoNothing({ target: comments.id })
		.execute();

	server.log.debug(`indexed comments: ${videoId}`);
}

export async function moveVideoAssets(channelId: string, videoId: string): Promise<void> {
	const source = VIDEO_DL_PATH(channelId, videoId);
	const target = VIDEO_PATH(channelId, videoId);
	const assets = await readdir(source);

	await mkdir(target, { recursive: true });

	await Promise.all(
		assets.map((asset) => {
			if (asset === 'metadata.info.json') {
				return mv(`${source}/metadata.info.json`, `${target}/metadata.json`);
			}
			return mv(`${source}/${asset}`, `${target}/${asset}`);
		}),
	);

	await rm(source, { recursive: true, force: true });
}

export async function readVideoMetadata(channelId: string, videoId: string): Promise<VideoMetadata> {
	const data = await readFile(`${VIDEO_PATH(channelId, videoId)}/metadata.json`, 'utf-8');
	return JSON.parse(data);
}

export async function readVideoComments(channelId: string, videoId: string): Promise<{ comments: CommentMetadata[] }> {
	const data = await readFile(`${VIDEO_PATH(channelId, videoId)}/comments.json`, 'utf-8');
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
