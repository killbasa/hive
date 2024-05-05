import { StatusEvent } from '@hive/common';
import { server } from '../../server.js';
import { readVideoMetadata } from '../fs/videos.js';
import { YtdlpVideoArgs } from './VideoArgs.js';
import { ytdlp, ytdlpExec } from './cli.js';
import { YTDLP_VIDEO_PATH } from './constants.js';

export async function downloadVideoAssets(
	videoId: string, //
	options?: { live: boolean; controller?: AbortController },
): Promise<boolean> {
	const args = new YtdlpVideoArgs()
		.saveJson()
		.saveThumbnail()
		.skipDownload()
		.writeTo(`${YTDLP_VIDEO_PATH}/metadata.%(ext)s`)
		.writeTo(`${YTDLP_VIDEO_PATH}/thumbnail.%(ext)s`, { type: 'thumbnail' })
		.ignoreNoFormatError();

	return await ytdlp(
		`https://youtube.com/watch?v=${videoId}`,
		args,
		{
			onError: (data) => {
				server.log.error(data.toString());
			},
		},
		options?.controller?.signal,
	);
}

export async function downloadVideo(
	channelId: string, //
	videoId: string,
	options?: { live: boolean; controller?: AbortController },
): Promise<boolean> {
	const args = new YtdlpVideoArgs() //
		.downloadArchive(channelId)
		.saveComments()
		.format('bestvideo[vcodec*=avc1]+bestaudio[acodec*=mp4a]/mp4')
		.writeTo(`${YTDLP_VIDEO_PATH}/video.%(ext)s`)
		.showProgress();

	if (options?.live) {
		args.live();
	}

	const metadata = await readVideoMetadata(channelId, videoId);

	return await ytdlp(
		`https://youtube.com/watch?v=${videoId}`,
		args,
		{
			onComplete: async (data) => {
				server.notifications.emit('status', {
					type: StatusEvent.DownloadUpdate,
					channelId,
					title: metadata.title,
					data,
				});
			},
			onUpdate: (data) => {
				server.notifications.emit('status', {
					type: StatusEvent.DownloadUpdate,
					channelId,
					title: metadata.title,
					data,
				});
			},
			onError: (data) => {
				server.log.error(data.toString());
			},
		},
		options?.controller?.signal,
	);
}

export async function getVideoIds(channelId: string): Promise<string[]> {
	const args = new YtdlpVideoArgs() //
		.arg('--flat-playlist')
		.arg('--print', 'id');

	const videoIdsStr = await ytdlpExec(`https://www.youtube.com/channel/${channelId}`, args);
	if (videoIdsStr === '') return [];

	return videoIdsStr.split('\n').filter((id) => id !== '');
}
