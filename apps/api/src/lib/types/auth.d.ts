/* eslint-disable @typescript-eslint/consistent-type-definitions */

import '@fastify/jwt';

declare module '@fastify/jwt' {
	interface FastifyJWT {
		// Signing and verifying tokens
		payload: {
			name: string;
		};
		// User object
		user: {
			name: string;
		};
	}
}
