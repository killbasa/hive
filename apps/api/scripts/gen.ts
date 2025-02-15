import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { fastify } from 'fastify';
import { writeFile } from 'node:fs/promises';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const run = async (): Promise<void> => {
	const { registerSwagger } = await import('../dist/server.js');
	const { routes } = await import('../dist/routes.js');

	const server = fastify({
		disableRequestLogging: true,
	})
		.withTypeProvider<TypeBoxTypeProvider>()
		.setValidatorCompiler(TypeBoxValidatorCompiler);

	await registerSwagger(server);
	await server.register(routes);
	await server.ready();

	const doc = server.swagger();
	await writeFile('openapi.json', JSON.stringify(doc, null, 2));

	await server.close();
	process.exit(0);
};

void run();
