import { authentication } from '$hooks/authentication';
import { authorization } from '$hooks/authorization';
import { sequence } from '@sveltejs/kit/hooks';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {};

export const handle = sequence(
	authentication, //
	authorization,
);
