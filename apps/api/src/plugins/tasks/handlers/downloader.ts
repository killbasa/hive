import { db } from '../../../db/client.js';
import { videos } from '../../../db/schema.js';
import { VIDEO_DL_PATH, indexComments, indexVideo, moveVideoAssets } from '../../../lib/fs/videos.js';
import { downloadVideo } from '../../../lib/ytdlp/videos.js';
import { server } from '../../../server.js';
import { eq } from 'drizzle-orm';
import { StatusEvent } from '@hive/common';
import { resolve } from 'node:path';
import { readFile, rm, writeFile } from 'node:fs/promises';
import type { CommentMetadata } from '../../../lib/fs/types.js';
import type { DownloaderVideoTask, TaskHandler } from '../types.js';

export const downloadControllers = new Map<string, AbortController>();

export const handleDownloadVideoTask: TaskHandler<DownloaderVideoTask> = async ({ channelId, videoId, live }) => {
	server.log.info(`downloading video: ${videoId} (live: ${live})`);

	const controller = new AbortController();
	downloadControllers.set(videoId, controller);

	await downloadVideo(channelId, videoId, { live, controller });
	if (controller.signal.aborted) {
		await rm(resolve(VIDEO_DL_PATH(channelId, videoId)), {
			recursive: true,
			force: true
		});

		server.log.info(`download aborted: ${videoId}`);
		return;
	}

	const source = VIDEO_DL_PATH(channelId, videoId);
	const videoInfo = await readFile(`${source}/video.info.json`, { encoding: 'utf-8' });
	await rm(`${source}/video.info.json`);

	const data: { comments: CommentMetadata[] } = JSON.parse(videoInfo);

	await writeFile(
		resolve(`${source}/comments.json`), //
		JSON.stringify({ comments: data.comments }),
		{ encoding: 'utf-8' }
	);

	await moveVideoAssets(channelId, videoId);

	await Promise.all([
		indexVideo(channelId, videoId), //
		indexComments(channelId, videoId)
	]);

	await db //
		.update(videos)
		.set({ downloadStatus: 'done' })
		.where(eq(videos.id, videoId));

	downloadControllers.delete(videoId);

	server.notifications.emit('status', {
		type: StatusEvent.DownloadComplete
	});

	server.log.info(`downloaded video: ${videoId}`);
};

export const handleDownloadCommentsTask: TaskHandler = async () => {
	server.log.info('downloading video comments: NO_ID');

	server.log.info('downloaded video comments: NO_ID');
};
