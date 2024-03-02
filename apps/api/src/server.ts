import { routes } from './routes';
import { app } from './app';
import { initDb } from './db/pool';
import { config } from './lib/config';
import { initJobs, initQueues } from './jobs/queues';
import { initWorkers } from './jobs/workers';

export const server = await app();

await initDb();
await initQueues();
await initWorkers();

await server.register(routes);

const start = async (): Promise<void> => {
	try {
		await server.listen({ host: config.HOST, port: config.PORT });
		await initJobs();
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();
