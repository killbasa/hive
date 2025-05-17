import { CLI_PATH, DATA_DIR } from '../constants.js';
import { execSync } from 'node:child_process';

export const YTDLP_CHANNEL_PATH = 'downloads/%(channel_id)s/assets';
export const YTDLP_VIDEO_PATH = 'downloads/%(channel_id)s/videos/%(id)s';

let YTDLP_VERSION: string | undefined;
export function getYtdlpVersion(): string {
	if (process.env.BUILDING) {
		return '0.0.0';
	}

	if (YTDLP_VERSION) {
		return YTDLP_VERSION;
	}

	const task = execSync(`${CLI_PATH} --version`, { cwd: DATA_DIR });
	YTDLP_VERSION = task.toString().trim();

	return YTDLP_VERSION;
}

const TagRegex = /^refs\/tags\/(\d{4}.\d{2}.\d{2})$/;

export function getYtdlpGitTag(): string {
	// Need to use wget due to alpine images not having curl
	const tags = execSync(`wget -qO- https://api.github.com/repos/yt-dlp/yt-dlp/git/matching-refs/tags`);
	const arr = JSON.parse(tags.toString());
	const latest = arr[arr.length - 1].ref;

	const match = latest.match(TagRegex);
	const latestTag = match[1];
	return latestTag;
}
