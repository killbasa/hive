import { building } from '$app/environment';

function getConfig() {
	if (building) {
		return {
			apiPath: '/api',
			assetsPath: '/assets',
		};
	}

	return {
		apiPath: 'http://localhost:3001/api',
		assetsPath: 'http://localhost:3001/assets',
	};
}

export const config = getConfig();
