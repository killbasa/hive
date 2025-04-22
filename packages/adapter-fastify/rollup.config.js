import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { builtinModules } from 'module';

const external = [
	'ENV', //
	'PLUGIN',
	'MANIFEST',
	'SERVER',
	'SHIMS',
	/node/,
	/rollup/,
	/fastify/,
	...builtinModules,
];

/**@type {import('rollup').RollupOptions[]} */
export default [
	{
		input: {
			index: 'src/index.ts',
			'files/env': 'src/files/env.ts',
			'files/plugin': 'src/files/plugin.ts',
			'files/shims': 'src/files/shims.ts',
		},
		output: {
			dir: 'dist',
			format: 'esm',
		},
		plugins: [esbuild({ sourceMap: false, minify: false, target: 'ESNext' })],
		external,
	},
	{
		input: {
			index: 'src/index.ts',
			plugin: 'src/files/plugin.ts',
		},
		external,
		output: {
			dir: 'dist',
			format: 'esm',
		},
		plugins: [dts()],
	},
];
