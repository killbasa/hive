import { server } from '../server';
export function setupGracefulShutdown(): void {
	const gracefullyClose = async (signal: string): Promise<void> => {
		console.warn(`Fastify is gracefully closing from signal="${signal}" ...`);

		setTimeout(() => {
			console.warn('Failed to gracefully close before timeout');
			process.exit(1);
		}, 5000);

		await new Promise<void>(async (resolve) => {
			await server.close();
			resolve();
		});

		process.exit(0);
	};

	process.on('SIGTERM', gracefullyClose);
	process.on('SIGINT', gracefullyClose);
}
