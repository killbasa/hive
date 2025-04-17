import { decorate, registerSwagger, server } from './server.js';
import { initDb } from './db/client.js';
import { API_HOST, DOWNLOADS_DIR, MEDIA_DIR, UiContentSecurityPolicies } from './lib/constants.js';
import { setupGracefulShutdown, startupLog } from './lib/lifecycle.js';
import { validateDirs } from './lib/utils.js';
import { initHandlers, initWorkers } from './tasks/loader.js';
import { routes } from './routes.js';
import { ZodError } from 'zod';
import HiveWebPlugin from '@hive/web/plugin';

await validateDirs(DOWNLOADS_DIR, MEDIA_DIR);

const start = async (): Promise<void> => {
	try {
		decorate(server);
		initDb();

		await initWorkers();

		await server.settings.init();

		await server.register(routes, { prefix: 'api' });

		if (server.config.server.ui) {
			await server.register(HiveWebPlugin, {
				prefix: 'ui',
				csp: UiContentSecurityPolicies,
			});
		}

		await server.listen({
			host: API_HOST,
			port: server.config.server.port,
		});

		await initHandlers();

		setupGracefulShutdown();
		await startupLog();
	} catch (err: unknown) {
		if (err instanceof ZodError) {
			server.log.error(err.errors);
		} else {
			server.log.error(err);
		}

		process.exit(1);
	}
};

await start();

export { registerSwagger, routes };
