import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import type { AdapterOptions } from '@sveltejs/adapter-node';
import type { Adapter, Builder } from '@sveltejs/kit';

function getPath(p: string): string {
	return fileURLToPath(new URL(p, import.meta.url).href);
}

const files = getPath('./files');
const pluginTypes = getPath('./plugin.d.ts');

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
export interface AdapterFastifyOptions extends Omit<AdapterOptions, 'precompress'> {}

export default function adapter(opts: AdapterFastifyOptions = {}): Adapter {
	const { out = 'build', envPrefix = '' } = opts;

	return {
		name: '@killbasa/adapter-fastify',

		async adapt(builder: Builder): Promise<void> {
			const tmp = builder.getBuildDirectory('adapter-fastify');

			builder.rimraf(out);
			builder.rimraf(tmp);
			builder.mkdirp(tmp);

			builder.log.minor('Copying assets');
			builder.writeClient(`${out}/client${builder.config.kit.paths.base}`);
			builder.writePrerendered(`${out}/prerendered${builder.config.kit.paths.base}`);

			builder.log.minor('Building server');

			builder.writeServer(tmp);

			writeFileSync(
				`${tmp}/manifest.js`,
				[
					`export const manifest = ${builder.generateManifest({ relativePath: './' })};`,
					`export const prerendered = new Set(${JSON.stringify(builder.prerendered.paths)});`,
					`export const base = ${JSON.stringify(builder.config.kit.paths.base)};`,
				].join('\n\n'),
			);

			const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

			const bundle = await rollup({
				input: {
					index: `${tmp}/index.js`,
					manifest: `${tmp}/manifest.js`,
				},
				external: [
					// dependencies could have deep exports, so we need a regex
					...Object.keys(pkg.dependencies ?? {}).map((d) => new RegExp(`^${d}(\\/.*)?$`)),
				],
				plugins: [
					nodeResolve({
						preferBuiltins: true,
						exportConditions: ['node'],
					}),
					commonjs({ strictRequires: true }),
					json(),
				],
			});

			await bundle.write({
				dir: `${out}/server`,
				format: 'esm',
				sourcemap: true,
				chunkFileNames: 'chunks/[name]-[hash].js',
			});

			builder.copy(files, out, {
				replace: {
					ENV: './env.js',
					PLUGIN: './plugin.js',
					MANIFEST: './server/manifest.js',
					SERVER: './server/index.js',
					SHIMS: './shims.js',
					ENV_PREFIX: JSON.stringify(envPrefix),
				},
			});

			builder.copy(pluginTypes, `${out}/plugin.d.ts`);
		},

		supports: {
			read: () => true,
		},
	};
}
