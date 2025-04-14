import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const authentication: Handle = async ({ event, resolve }) => {
	const { cookies, request } = event;
	const path = new URL(request.url).pathname;

	const cookie = cookies.get('hive');

	if (cookie === undefined) {
		if (path === '/login') {
			return resolve(event);
		}

		redirect(307, '/login');
	}

	if (path === '/login') {
		redirect(307, '/');
	}

	return resolve(event);
};
