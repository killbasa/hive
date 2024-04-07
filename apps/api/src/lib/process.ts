import { server } from '../server.js';
import { Time } from '@hive/common';

export function setupGracefulShutdown(): void {
	const gracefullyClose = async (signal: string): Promise<void> => {
		console.warn(`Fastify is gracefully closing from signal="${signal}" (5s)`);

		setTimeout(() => {
			console.warn('Failed to gracefully close before timeout');
			process.exit(1);
		}, Time.Second * 5);

		await new Promise<void>(async (resolve) => {
			await server.close();
			resolve();
		});

		process.exit(0);
	};

	process.on('SIGTERM', gracefullyClose);
	process.on('SIGINT', gracefullyClose);
}
