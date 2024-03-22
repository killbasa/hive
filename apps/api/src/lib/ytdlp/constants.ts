import { DATA_DIR } from '../constants';
import { execSync } from 'node:child_process';

export const YTDLP_CHANNEL_PATH = 'downloads/%(channel_id)s/assets';
export const YTDLP_VIDEO_PATH = 'downloads/%(channel_id)s/videos/%(id)s';

let YTDLP_VERSION: string | undefined;
export function getYtdlpVersion(): string {
	if (YTDLP_VERSION) return YTDLP_VERSION;

	const task = execSync(`"${DATA_DIR}/yt-dlp" --version`);
	YTDLP_VERSION = task.toString().trim();

	return YTDLP_VERSION;
}
