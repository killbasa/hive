import { routes } from './routes.js';
import { app } from './app.js';
import { initDb } from './db/client.js';
import { config } from './lib/config.js';
import { DOWNLOADS_DIR, MEDIA_DIR } from './lib/constants.js';
import { getYtdlpVersion } from './lib/ytdlp/constants.js';
import { validateDirs } from './lib/utils.js';
import { setupGracefulShutdown } from './lib/process.js';
import { initHandlers, initWorkers } from './plugins/tasks/loader.js';

await validateDirs(DOWNLOADS_DIR, MEDIA_DIR);
export const server = await app();

const start = async (): Promise<void> => {
	try {
		await initDb();
		await initWorkers();

		await server.settings.init();

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
