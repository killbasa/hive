import { indexVideo } from '../lib/fs/videos';
import { server } from '../server';
import { downloadVideo } from '../lib/ytdlp/videos';
import type { DownloaderVideoTask } from '../workers/downloader';

export async function handleDownloadVideoTask({ channelId, videoId, live }: DownloaderVideoTask): Promise<void> {
	server.log.debug(`Downloading video: ${videoId} (live: ${live})`);

	await indexVideo(channelId, videoId);
	await downloadVideo(channelId, videoId, { live });

	server.log.info(`Downloaded video: ${videoId}`);
}
