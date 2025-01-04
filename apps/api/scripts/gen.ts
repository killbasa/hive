import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import Fastify from 'fastify';
import { writeFile } from 'node:fs/promises';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const run = async (): Promise<void> => {
	const { registerSwagger, routes } = await import('../dist/main.js');

	const server = Fastify({
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
