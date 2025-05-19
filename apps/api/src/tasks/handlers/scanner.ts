import { db } from '../../db/sqlite.js';
import { channels, videos } from '../../db/schema.js';
import { getChannelMetadata } from '../../lib/fs/channels.js';
import { indexVideo, isVideoDownloaded, moveVideoAssets } from '../../lib/fs/videos.js';
import { formatChannelTags } from '../../lib/youtube/channels.js';
import { downloadChannel } from '../../lib/ytdlp/channels.js';
import { downloadVideoAssets, getVideoIds } from '../../lib/ytdlp/videos.js';
import { server } from '../../server.js';
import { StatusEvent } from '@hive/common';
import { eq } from 'drizzle-orm';
import type { ScannerDownloadChannelTask, ScannerScanChannelTask, TaskHandler } from '../types.js';

export const handleDownloadChannelTask: TaskHandler<ScannerDownloadChannelTask> = async ({ channelId }) => {
	server.log.debug(`indexing channel: ${channelId}`);

	await downloadChannel(channelId);
	const metadata = await getChannelMetadata(channelId);

	await db
		.insert(channels)
		.values({
			id: channelId,
			customUrl: metadata.uploader_id,
			name: metadata.channel,
			description: metadata.description,
			tags: formatChannelTags(metadata.tags),
		})
		.onConflictDoNothing()
		.execute();

	server.log.info(`indexed channel: ${channelId}`);
};

export const handleChannelScanTask: TaskHandler<ScannerScanChannelTask> = async ({ channelId, position, total }) => {
	server.log.info(`scanning channel videos: ${channelId}`);

	const videoIds = await getVideoIds(channelId);

	const existingVideoIds = await db.query.videos.findMany({
		where: eq(videos.channelId, channelId),
		columns: { id: true },
	});

	const newVideoIds = videoIds.filter((id) => !existingVideoIds.some((video) => video.id === id));

	if (newVideoIds.length === 0) {
		server.log.info(`no new videos found: ${channelId}`);
		return;
	}

	try {
		for (const [index, videoId] of newVideoIds.entries()) {
			const dlSuccess = await downloadVideoAssets(videoId);

			if (!dlSuccess) {
				const isDownloaded = isVideoDownloaded(channelId, videoId, { dir: 'download' });

				if (!isDownloaded) {
					server.log.error(`failed to download video assets: ${videoId}`);
					continue;
				}
			}

			const mvSuccess = await moveVideoAssets(channelId, videoId);
			if (!mvSuccess) {
				server.log.error(`failed to move video assets: ${videoId}`);
				continue;
			}

			await indexVideo(channelId, videoId);

			server.notifications.emit('status', {
				type: StatusEvent.ScanUpdate,
				channelId,
				channelPos: position + 1,
				channelTotal: total,
				videoPos: index + 1,
				videoTotal: newVideoIds.length,
			});
		}

		server.notifications.emit('status', {
			type: StatusEvent.ScanComplete,
		});
	} catch (err) {
		// TODO improve error message
		server.log.error(err);
	}

	server.log.info(`scanned channel videos: ${channelId}`);
};
