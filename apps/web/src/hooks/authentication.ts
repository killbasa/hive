import { type Handle, redirect } from '@sveltejs/kit';

export const authentication: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const path = new URL(event.request.url).pathname;

	const cookie = cookies.get('hive');

	if (cookie === undefined) {
		if (path === '/login') {
			return resolve(event);
		}

		redirect(307, '/login');
	}

	if (path === '/logout') {
		return resolve(event);
	}

	if (path === '/signup' || path === '/login') {
		redirect(307, '/');
	}

	return await resolve(event);
};
