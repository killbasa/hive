import { DATA_DIR } from '../constants';
import { spawnAsync } from '../utils';
import { server } from '../../server';
import { exec } from 'node:child_process';
import type { Awaitable } from '../types';

export type YtdlpProgress = {
	status: 'downloading' | 'error' | 'finished';
	id: string;
	percentage: string;
	total: string;
	speed: string;
	eta: string;
};

export type YtdlpArgs = {
	data: string[];
};

function parseDownloadProgress(data: Buffer | string): { valid: false } | { valid: true; data: YtdlpProgress } {
	if (typeof data !== 'string') {
		data = data.toString().trim();
	}

	if (!data.startsWith('{')) {
		server.log.debug(data);
		return { valid: false };
	}

	try {
		const parsed = JSON.parse(data);
		return {
			valid: true,
			data: parsed
		};
	} catch (e) {
		server.log.error(e);
		return { valid: false };
	}
}

export async function ytdlp(
	urls: string[] | string,
	args: YtdlpArgs,
	cb?: {
		onComplete?: (progress: YtdlpProgress) => Awaitable<void>;
		onUpdate?: (progress: YtdlpProgress) => Awaitable<void>;
		onError?: (data: Buffer) => Awaitable<void>;
	}
): Promise<void> {
	if (typeof urls === 'string') {
		urls = [urls];
	}

	for (const url of urls) {
		args.data.push(url);
	}

	server.log.debug(`yt-dlp ${args.data.join(' ')}`);
	await spawnAsync('./yt-dlp', args.data, {
		cwd: 'data',
		stdout: async (data) => {
			const parsed = parseDownloadProgress(data);
			if (!parsed.valid) return;

			if (parsed.data.status === 'downloading') {
				await cb?.onUpdate?.(parsed.data);
			} else if (parsed.data.status === 'finished') {
				await cb?.onComplete?.(parsed.data);
			}
		},
		stderr: async (data) => {
			await cb?.onError?.(data);
		}
	});
}

export async function ytdlpExec(urls: string[] | string, args: YtdlpArgs): Promise<string> {
	if (typeof urls === 'string') {
		urls = [urls];
	}

	for (const url of urls) {
		args.data.push(url);
	}

	return await new Promise((resolve, reject) => {
		exec(`"${DATA_DIR}/yt-dlp" ${args.data.join(' ')}`, (err, stdout) => {
			if (err) {
				reject(err);
			}

			resolve(stdout);
		});
	});
}
