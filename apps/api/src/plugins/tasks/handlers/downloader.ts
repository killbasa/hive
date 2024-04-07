import { db } from '../../../db/client';
import { videos } from '../../../db/schema';
import { StatusEvent } from '../../../lib/constants';
import { VIDEO_DL_PATH, indexComments, indexVideo, moveVideoAssets } from '../../../lib/fs/videos';
import { downloadVideo } from '../../../lib/ytdlp/videos';
import { server } from '../../../server';
import { eq } from 'drizzle-orm';
import { resolve } from 'node:path';
import { readFile, rm, writeFile } from 'node:fs/promises';
import type { CommentMetadata } from '../../../lib/fs/types';
import type { DownloaderVideoTask } from '../workers/downloader';

export const downloadControllers = new Map<string, AbortController>();

export async function handleDownloadVideoTask({ channelId, videoId, live }: DownloaderVideoTask): Promise<void> {
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

	server.websocketServer.emit('status', {
		type: StatusEvent.DownloadComplete
	});

	server.log.info(`downloaded video: ${videoId}`);
}
