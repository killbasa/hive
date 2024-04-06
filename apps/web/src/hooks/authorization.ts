import type { Handle } from '@sveltejs/kit';

export const authorization: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
