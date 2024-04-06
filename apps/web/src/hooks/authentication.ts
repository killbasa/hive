import { redirect, type Handle } from '@sveltejs/kit';

export const authentication: Handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const path = new URL(event.request.url).pathname;

	const cookie = cookies.get('hive-auth');

	if (cookie === undefined) {
		if (path === '/login') {
			return resolve(event);
		} else {
			redirect(307, '/login');
		}
	}

	if (path === '/signup' || path === '/login') {
		redirect(307, '/');
	}

	return resolve(event);
};
