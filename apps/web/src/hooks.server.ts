import { authorization } from '$hooks/authorization';
import { authentication } from '$hooks/authentication';
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(
	authentication, //
	authorization
);
