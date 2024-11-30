import { db } from '../../db/client.js';
import { videos } from '../../db/schema.js';
import { VIDEO_DL_PATH, moveVideoAssets } from '../../lib/fs/videos.js';
import { downloadVideo } from '../../lib/ytdlp/videos.js';
import { server } from '../../server.js';
import { eq } from 'drizzle-orm';
import { StatusEvent } from '@hive/common';
import { resolve } from 'node:path';
import { rm } from 'node:fs/promises';
import type { DownloaderVideoTask, TaskHandler } from '../types.js';

export const downloadControllers: Map<string, AbortController> = new Map();

export const handleDownloadVideoTask: TaskHandler<DownloaderVideoTask> = async ({ channelId, videoId, live }) => {
	server.log.info(`downloading video: ${videoId} (live: ${live})`);

	const controller = new AbortController();
	downloadControllers.set(videoId, controller);

	await downloadVideo(channelId, videoId, { live, controller });
	if (controller.signal.aborted) {
		await rm(resolve(VIDEO_DL_PATH(channelId, videoId)), {
			recursive: true,
			force: true,
		});

		server.log.info(`download aborted: ${videoId}`);
		return;
	}

	const mvSuccess = await moveVideoAssets(channelId, videoId);
	if (!mvSuccess) {
		server.log.error(`failed to move video assets: ${videoId}`);
		return;
	}

	await db //
		.update(videos)
		.set({ downloadStatus: 'done' })
		.where(eq(videos.id, videoId));

	downloadControllers.delete(videoId);

	server.notifications.emit('status', {
		type: StatusEvent.DownloadComplete,
	});

	server.log.info(`downloaded video: ${videoId}`);
};
