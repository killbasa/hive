import { authentication } from '$hooks/authentication';
import { authorization } from '$hooks/authorization';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
	authentication, //
	authorization,
);
