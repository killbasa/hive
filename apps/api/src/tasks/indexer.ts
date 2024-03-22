import { checkNewVideos } from './updateVideoStatus';
import { db } from '../db/client';
import { channels } from '../db/schema';
import { isChannelDownloaded, readChannelMetadata } from '../lib/fs/channels';
import { formatTags } from '../lib/youtube/channels';
import { indexVideo, indexVideos } from '../lib/fs/videos';
import { server } from '../server';
import { downloadChannel } from '../lib/ytdlp/channels';
import { downloadChannelVideoAssets } from '../lib/ytdlp/videos';
import type { IndexerChannelTask, IndexerVideoTask } from '../workers/indexer';

export async function handleIndexChannelTask({ channelId }: IndexerChannelTask): Promise<void> {
	server.log.debug(`Indexing channel: ${channelId}`);
	if (isChannelDownloaded(channelId)) {
		server.log.warn(`Channel already downloaded: ${channelId}`);
		return;
	}

	await downloadChannel(channelId);
	const metadata = await readChannelMetadata(channelId);

	await db
		.insert(channels)
		.values({
			id: channelId,
			customUrl: metadata.id,
			name: metadata.channel,
			description: metadata.description,
			tags: formatTags(metadata.tags)
		})
		.execute();

	await downloadChannelVideoAssets(channelId);
	await indexVideos(channelId);
	await checkNewVideos();

	server.log.info(`Indexed channel: ${channelId}`);
}

export async function downloadVideoAssets({ channelId, videoId }: IndexerVideoTask): Promise<void> {
	server.log.info(`Indexing video: ${channelId}`);

	await indexVideo(channelId, videoId);
}
