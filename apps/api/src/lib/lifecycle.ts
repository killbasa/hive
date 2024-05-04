import { config } from './config.js';
import { getYtdlpVersion } from './ytdlp/constants.js';
import { API_HOST } from './constants.js';
import { server } from '../server.js';
import { Time } from '@hive/common';

let closing = false;
const padding = ' '.repeat(3);

function print(msg: string): void {
	server.log.info(`${padding}${msg}`);
}

export function startupLog(): void {
	server.log.info('');

	print(`version:       ${config.VERSION}`);
	print(`yt-dlp:        ${getYtdlpVersion()}`);
	print(`proxy:         http://${API_HOST}:3001`);
	print(`documentation: http://${API_HOST}:3001/reference`);
	print(`metrics:       http://${API_HOST}:3001/metrics`);

	server.log.info('');
}

export function setupGracefulShutdown(): void {
	const gracefullyClose = async (signal: string): Promise<void> => {
		if (closing) return;
		closing = true;

		server.log.warn(`graceful shutdown from signal="${signal}" (30s)`);

		setTimeout(() => {
			server.log.fatal('failed to gracefully shutdown before timeout');
			process.exit(1);
		}, Time.Second * 30);

		await new Promise<void>(async (resolve) => {
			await server.close();
			await server.metrics?.destroy();

			resolve();
		});

		process.exit(0);
	};

	process.on('SIGTERM', gracefullyClose);
	process.on('SIGINT', gracefullyClose);
}
