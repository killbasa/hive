/* eslint-disable @typescript-eslint/prefer-ts-expect-error */

import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { fastify } from 'fastify';
import { rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { DeepPartial } from '@hive/common';
import type { HiveConfig } from '../src/lib/config.js';

const { registerSwagger } = await import(
	// @ts-ignore - file might not exist
	'../dist/server.js'
);
const { routes } = await import(
	// @ts-ignore - file might not exist
	'../dist/routes.js'
);

const server = fastify({
	disableRequestLogging: true,
})
	.withTypeProvider<TypeBoxTypeProvider>()
	.setValidatorCompiler(TypeBoxValidatorCompiler);

const cfg = {
	server: {
		version: process.env.npm_package_version,
	},
} as DeepPartial<HiveConfig>;

server.decorate('config', cfg as HiveConfig);
await registerSwagger(server);
await server.register(routes);
await server.ready();

const doc = server.swagger();
await writeFile('openapi.json', JSON.stringify(doc, null, 2));

await server.close();

await rm(resolve('dist/routes.js'));
await rm(resolve('dist/routes.js.map'));
await rm(resolve('dist/server.js'));
await rm(resolve('dist/server.js.map'));
