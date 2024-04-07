import { routes } from './routes';
import { app } from './app';
import { initDb } from './db/client';
import { config } from './lib/config';
import { DOWNLOADS_DIR, MEDIA_DIR } from './lib/constants';
import { getYtdlpVersion } from './lib/ytdlp/constants';
import { validateDirs } from './lib/utils';
import { setupGracefulShutdown } from './lib/process';
import { initHandlers, initWorkers } from './plugins/tasks/loader';

await validateDirs(DOWNLOADS_DIR, MEDIA_DIR);
export const server = await app();

const start = async (): Promise<void> => {
	try {
		await initDb();
		await initWorkers();

		await server.register(routes);
		await server.listen({ host: '0.0.0.0', port: config.PORT });
		server.log.info(`yt-dlp version: ${getYtdlpVersion()}`);

		await initHandlers();
		setupGracefulShutdown();
	} catch (err: unknown) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();
