import { checkNewVideos } from './updateVideoStatus.js';
import { db } from '../../../db/client.js';
import { channels } from '../../../db/schema.js';
import { isChannelDownloaded, readChannelMetadata } from '../../../lib/fs/channels.js';
import { indexVideo, isVideoDownloaded, moveVideoAssets } from '../../../lib/fs/videos.js';
import { formatTags } from '../../../lib/youtube/channels.js';
import { downloadChannel } from '../../../lib/ytdlp/channels.js';
import { downloadVideoAssets, getVideoIds } from '../../../lib/ytdlp/videos.js';
import { server } from '../../../server.js';
import { StatusEvent } from '@hive/common';
import type { ScannerDownloadChannelTask, ScannerScanChannelTask, TaskHandler } from '../types.js';

export const scansInProgress: Record<'download' | 'scan', boolean> = {
	download: false,
	scan: false
};

export const handleDownloadChannelTask: TaskHandler<ScannerDownloadChannelTask> = async ({ channelId }) => {
	server.log.debug(`indexing channel: ${channelId}`);
	if (isChannelDownloaded(channelId)) {
		server.log.warn(`channel already downloaded: ${channelId}`);
		return;
	}

	scansInProgress.download = true;

	await downloadChannel(channelId);
	const metadata = await readChannelMetadata(channelId);

	await db
		.insert(channels)
		.values({
			id: channelId,
			customUrl: metadata.uploader_id,
			name: metadata.channel,
			description: metadata.description,
			tags: formatTags(metadata.tags)
		})
		.execute();

	scansInProgress.download = false;
	server.log.info(`indexed channel: ${channelId}`);
};

export const handleChannelScanTask: TaskHandler<ScannerScanChannelTask> = async ({ channelId, position, total }) => {
	server.log.info(`scanning channel videos: ${channelId}`);
	scansInProgress.scan = true;

	const videoIds = await getVideoIds(channelId);

	const existingVideoIds = await db.query.videos.findMany({
		columns: { id: true }
	});

	const newVideoIds = videoIds.filter((id) => !existingVideoIds.some((video) => video.id === id));

	if (newVideoIds.length === 0) {
		server.log.info(`no new videos found: ${channelId}`);
		return;
	}

	for (const [index, videoId] of newVideoIds.entries()) {
		const result = await downloadVideoAssets(videoId);

		if (!result || !isVideoDownloaded(channelId, videoId, { dir: 'download' })) {
			server.log.warn(`failed to download video assets: ${videoId}`);
			continue;
		}

		await moveVideoAssets(channelId, videoId);
		await indexVideo(channelId, videoId);

		server.notifications.emit('status', {
			type: StatusEvent.ScanUpdate,
			channelId,
			channelPos: position + 1,
			channelTotal: total,
			videoPos: index + 1,
			videoTotal: newVideoIds.length
		});
	}

	await checkNewVideos({ page: 0 });

	server.notifications.emit('status', {
		type: StatusEvent.ScanComplete
	});

	scansInProgress.scan = false;
	server.log.info(`scanned channel videos: ${channelId}`);
};
