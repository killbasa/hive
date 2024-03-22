import { YtdlpChannelArgs } from './ChannelArgs';
import { ytdlp } from './cli';
import { YTDLP_CHANNEL_PATH } from './constants';
import { server } from '../../server';
import { moveChannel } from '../fs/channels';

export async function downloadChannel(id: string): Promise<void> {
	const args = new YtdlpChannelArgs() //
		.saveJson()
		.saveThumbnails()
		.writeTo(`${YTDLP_CHANNEL_PATH}/thumbnail.%(ext)s`);

	await ytdlp(`https://www.youtube.com/channel/${id}`, args, {
		onError: (data) => {
			server.log.error(data.toString());
		}
	});

	await moveChannel(id);
}
