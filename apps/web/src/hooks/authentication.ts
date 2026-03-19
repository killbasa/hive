import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const authentication: Handle = async ({ event, resolve }) => {
	const { cookies, request } = event;
	const path = new URL(request.url).pathname;

	const cookie = cookies.get('hive');

	if (cookie === undefined) {
		if (path === `${base}/login`) {
			return resolve(event);
		}

		redirect(307, `${base}/login`);
	}

	if (path === `${base}/login`) {
		redirect(307, `${base}/`);
	}

	return await resolve(event);
};
