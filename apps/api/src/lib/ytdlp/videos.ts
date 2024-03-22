import { YtdlpVideoArgs } from './VideoArgs';
import { ytdlp, ytdlpExec } from './cli';
import { YTDLP_VIDEO_PATH } from './constants';
import { server } from '../../server';
import { moveVideo, moveVideoAssets, moveVideoAssetsBulk } from '../fs/videos';
import { CHANNEL_DL_PATH } from '../fs/channels';
import { rm } from 'fs/promises';
import { resolve } from 'node:path';

export async function downloadVideo(channelId: string, videoId: string, options?: { live: boolean }): Promise<void> {
	const args = new YtdlpVideoArgs() //
		.downloadArchive(channelId)
		.format('bestvideo+bestaudio')
		.writeTo(`${YTDLP_VIDEO_PATH}/video.%(ext)s`)
		.showProgress();

	if (options?.live) {
		args.live();
	}

	await ytdlp(`https://youtube.com/watch?v=${videoId}`, args, {
		onComplete: async (data) => {
			server.log.debug(data);

			await moveVideo(channelId, data.id);
			server.websocketServer.emit('status', data);
		},
		onUpdate: (data) => {
			server.log.debug(data);

			server.websocketServer.emit('status', data);
		},
		onError: (data) => {
			server.log.error(data.toString());
		}
	});
}

export async function downloadVideoAssets(channelId: string, videoId: string): Promise<void> {
	const args = new YtdlpVideoArgs()
		.saveJson()
		.saveComments()
		.saveThumbnail()
		.skipDownload()
		.writeTo(`${YTDLP_VIDEO_PATH}/metadata.%(ext)s`)
		.writeTo(`${YTDLP_VIDEO_PATH}/thumbnail.%(ext)s`, { type: 'thumbnail' });

	await ytdlp(`https://youtube.com/watch?v=${videoId}`, args, {
		onError: (data) => {
			server.log.error(data.toString());
		}
	});

	await moveVideoAssets(channelId, videoId);
}

export async function downloadChannelVideos(channelId: string, ids: string[]): Promise<void> {
	const args = new YtdlpVideoArgs() //
		.downloadArchive(channelId)
		.format('bestvideo+bestaudio')
		.writeTo(`${YTDLP_VIDEO_PATH}/video.%(ext)s`)
		.showProgress();

	await ytdlp(
		ids.map((id) => `https://youtube.com/watch?v=${id}`),
		args,
		{
			onComplete: async (data) => {
				server.log.debug(data);

				await moveVideo(channelId, data.id);
				server.websocketServer.emit('status', data);
			},
			onUpdate: (data) => {
				server.log.debug(data);

				server.websocketServer.emit('status', data);
			},
			onError: (data) => {
				server.log.error(data.toString());
			}
		}
	);
}

export async function downloadChannelVideoAssets(channelId: string): Promise<void> {
	const args = new YtdlpVideoArgs()
		.saveJson()
		.saveComments()
		.saveThumbnail()
		.skipDownload()
		.writeTo(`${YTDLP_VIDEO_PATH}/metadata.%(ext)s`)
		.writeTo(`${YTDLP_VIDEO_PATH}/thumbnail.%(ext)s`, { type: 'thumbnail' });

	await ytdlp(`https://www.youtube.com/channel/${channelId}`, args, {
		onError: (data) => {
			server.log.error(data.toString());
		}
	});

	await rm(resolve(`${CHANNEL_DL_PATH(channelId)}/videos/${channelId}`), {
		recursive: true,
		force: true
	});
	await moveVideoAssetsBulk(channelId);
}

export async function getVideoIds(channelId: string): Promise<string[]> {
	const args = new YtdlpVideoArgs() //
		.arg('--flat-playlist')
		.arg('--print', 'id')
		.downloadArchive(channelId);

	const videoIdsStr = await ytdlpExec(`https://www.youtube.com/channel/${channelId}`, args);

	return videoIdsStr.split('\n');
}
