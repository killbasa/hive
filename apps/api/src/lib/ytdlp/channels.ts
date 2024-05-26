import { YtdlpChannelArgs } from './ChannelArgs.js';
import { ytdlp } from './cli.js';
import { YTDLP_CHANNEL_PATH } from './constants.js';
import { moveChannel } from '../fs/channels.js';
import { server } from '../../server.js';

export async function downloadChannel(
	id: string,
	options?: {
		controller?: AbortController;
	},
): Promise<void> {
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
			},
		},
		options?.controller?.signal,
	);

	if (!options?.controller?.signal.aborted) {
		const success = await moveChannel(id);

		if (!success) {
			server.log.warn(`failed to download channel: ${id}`);
		}
	}
}
