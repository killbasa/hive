import { routes } from '#/routes';
import { app } from '#/app';

const server = await app();

await server.register(routes);

const start = async (): Promise<void> => {
	try {
		await server.listen({ port: 4001 });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

await start();
