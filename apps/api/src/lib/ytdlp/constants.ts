import { execSync } from 'node:child_process';
import { CLI_PATH, DATA_DIR } from '../constants.js';

export const YTDLP_CHANNEL_PATH = 'downloads/%(channel_id)s/assets';
export const YTDLP_VIDEO_PATH = 'downloads/%(channel_id)s/videos/%(id)s';

let YTDLP_VERSION: string | undefined;
export function getYtdlpVersion(): string {
	if (YTDLP_VERSION) return YTDLP_VERSION;

	const task = execSync(`${CLI_PATH} --version`, { cwd: DATA_DIR });
	YTDLP_VERSION = task.toString().trim();

	return YTDLP_VERSION;
}
