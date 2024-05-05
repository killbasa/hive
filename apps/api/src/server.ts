import { LogLevel, app } from './app.js';
import { initDb } from './db/client.js';
import { config } from './lib/config.js';
import { API_HOST, DOWNLOADS_DIR, MEDIA_DIR } from './lib/constants.js';
import { setupGracefulShutdown, startupLog } from './lib/lifecycle.js';
import { validateDirs } from './lib/utils.js';
import { initHandlers, initWorkers } from './plugins/tasks/loader.js';
import { routes } from './routes.js';

await validateDirs(DOWNLOADS_DIR, MEDIA_DIR);

export const server = await app();

const start = async () => {
	try {
		await initDb();
		await initWorkers();

		await server.settings.init();
		await server.register(routes);

		server.log.level = 'silent';
		server.listen({ host: API_HOST, port: config.PORT }, () => {
			server.log.level = LogLevel;
			server.log.info(`server listening on http://${API_HOST}:${config.PORT}`);
		});

		await initHandlers();

		setupGracefulShutdown();
		startupLog();
	} catch (err: unknown) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();
