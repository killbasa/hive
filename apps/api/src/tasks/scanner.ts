import { checkNewVideos } from './updateVideoStatus';
import { db } from '../db/client';
import { channels } from '../db/schema';
import { isChannelDownloaded, readChannelMetadata } from '../lib/fs/channels';
import { formatTags } from '../lib/youtube/channels';
import { indexVideo, isVideoDownloaded, moveVideoAssets } from '../lib/fs/videos';
import { server } from '../server';
import { downloadChannel } from '../lib/ytdlp/channels';
import { downloadVideoAssets, getVideoIds } from '../lib/ytdlp/videos';
import { StatusEvent } from '../lib/utils';
import type { ScannerDownloadChannelTask, ScannerScanChannelTask } from '../workers/scanner';

export const scansInProgress: Record<'download' | 'scan', boolean> = {
	download: false,
	scan: false
};

export async function handleDownloadChannelTask({ channelId }: ScannerDownloadChannelTask): Promise<void> {
	server.log.debug(`Indexing channel: ${channelId}`);
	if (isChannelDownloaded(channelId, { dir: 'media' })) {
		server.log.warn(`Channel already downloaded: ${channelId}`);
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
	server.log.info(`Indexed channel: ${channelId}`);
}

export async function handleChannelScanTask({ channelId }: ScannerScanChannelTask): Promise<void> {
	server.log.info(`Scanning channel videos: ${channelId}`);
	scansInProgress.scan = true;

	const videoIds = await getVideoIds(channelId);

	const existingVideoIds = await db.query.videos.findMany({
		columns: { id: true }
	});

	const newVideoIds = videoIds.filter((id) => !existingVideoIds.some((video) => video.id === id));

	if (newVideoIds.length === 0) {
		server.log.info(`No new videos found: ${channelId}`);
		return;
	}

	for (const [index, videoId] of newVideoIds.entries()) {
		const result = await downloadVideoAssets(videoId);

		if (!result || !isVideoDownloaded(channelId, videoId, { dir: 'download' })) {
			server.log.warn(`Failed to download video assets: ${videoId}`);
			continue;
		}

		await moveVideoAssets(channelId, videoId);
		await indexVideo(channelId, videoId);

		server.websocketServer.emit('status', {
			type: StatusEvent.ScanUpdate,
			channelId,
			current: index + 1,
			total: newVideoIds.length
		});
	}

	await checkNewVideos();

	server.websocketServer.emit('status', {
		type: StatusEvent.ScanComplete
	});

	scansInProgress.scan = false;
	server.log.info(`Scanned channel videos: ${channelId}`);
}
