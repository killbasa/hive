import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./index.html', './src/**/*.{vue,ts}'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light']
	}
};

export default config;
