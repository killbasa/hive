import { YtdlpChannelArgs } from './ChannelArgs';
import { ytdlp } from './cli';
import { YTDLP_CHANNEL_PATH } from './constants';
import { moveChannel } from '../fs/channels';
import { server } from '../../server';

export async function downloadChannel(id: string, options?: { controller?: AbortController }): Promise<void> {
	const args = new YtdlpChannelArgs() //
		.saveJson()
		.saveThumbnails()
		.writeTo(`${YTDLP_CHANNEL_PATH}/thumbnail.%(ext)s`);

	await ytdlp(
		`https://www.youtube.com/channel/${id}`,
		args,
		{
			onError: (data) => {
				server.log.error(data.toString());
			}
		},
		options?.controller?.signal
	);

	if (!options?.controller?.signal.aborted) {
		await moveChannel(id);
	}
}
