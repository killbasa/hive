import { decorate, registerSwagger, server } from './server.js';
import { initDb } from './db/client.js';
import { config } from './lib/config.js';
import { API_HOST, DOWNLOADS_DIR, MEDIA_DIR } from './lib/constants.js';
import { setupGracefulShutdown, startupLog } from './lib/lifecycle.js';
import { validateDirs } from './lib/utils.js';
import { initHandlers, initWorkers } from './tasks/loader.js';
import { routes } from './routes.js';

await validateDirs(DOWNLOADS_DIR, MEDIA_DIR);

const start = async (): Promise<void> => {
	try {
		decorate(server);
		initDb();

		await initWorkers();

		await server.settings.init();
		await server.register(routes);

		await server.listen({ host: API_HOST, port: config.PORT });

		await initHandlers();

		setupGracefulShutdown();
		await startupLog();
	} catch (err: unknown) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();

export { registerSwagger, routes };
