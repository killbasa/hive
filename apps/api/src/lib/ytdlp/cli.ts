import { exec, spawn } from 'node:child_process';
import type { Awaitable } from '@hive/common';
import { server } from '../../server.js';
import { CLI_PATH, DATA_DIR } from '../constants.js';

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
			data: parsed,
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
	},
	signal?: AbortSignal,
): Promise<boolean> {
	if (typeof urls === 'string') {
		urls = [urls];
	}

	for (const url of urls) {
		args.data.push(url);
	}

	server.log.debug(`starting process (${new Date().toISOString()})`);
	server.log.debug(`yt-dlp ${args.data.join(' ')}`);

	const subprocess = spawn(CLI_PATH, args.data, {
		shell: false,
		detached: false,
		cwd: DATA_DIR,
		signal,
	});

	const logAbort = (): void => {
		server.log.info('aborting yt-dlp...');
	};

	signal?.addEventListener('abort', logAbort);

	subprocess.stdout.on('data', async (data) => {
		const parsed = parseDownloadProgress(data);
		if (!parsed.valid || parsed.data.eta === 'Unknown') {
			return;
		}

		if (parsed.data.status === 'downloading') {
			await cb?.onUpdate?.(parsed.data);
		} else if (parsed.data.status === 'finished') {
			await cb?.onComplete?.(parsed.data);
		}
	});

	subprocess.stderr.on('data', async (data) => {
		await cb?.onError?.(data);
	});

	return await new Promise<boolean>((resolve, reject) => {
		subprocess.on('error', (err) => {
			if (!signal?.aborted) {
				reject(err);
			}
		});

		subprocess.on('close', (code) => {
			signal?.removeEventListener('abort', logAbort);

			if (code === 0 || code === 1 || signal?.aborted) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

export async function ytdlpExec(urls: string[] | string, args: YtdlpArgs): Promise<string> {
	if (typeof urls === 'string') {
		urls = [urls];
	}

	for (const url of urls) {
		args.data.push(url);
	}

	server.log.debug(`starting exec (${new Date().toISOString()})`);
	server.log.debug(`yt-dlp ${args.data.join(' ')}`);

	return await new Promise((resolve, reject) => {
		exec(`${CLI_PATH} ${args.data.join(' ')}`, { cwd: DATA_DIR }, (err, stdout) => {
			if (err) {
				reject(err);
			}

			resolve(stdout);
		});
	});
}
