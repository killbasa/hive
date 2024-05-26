import { config } from '../../src/lib/config.js';
import server from '../vitest.setup.js';

describe('authHandler', async () => {
	it('should return 401', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/version',
		});

		expect(response.statusCode).toBe(401);
	});

	it('should return 200 with cookie', async () => {
		const token = server.jwt.sign({
			name: 'test-noapikey',
		});

		const response = await server.inject({
			method: 'GET',
			url: '/version',
			cookies: {
				[config.COOKIE_NAME]: token,
			},
		});

		expect(response.statusCode).toBe(200);
	});

	it('should return 200 with api key', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/version',
			headers: {
				'x-api-key': 'test',
			},
		});

		expect(response.statusCode).toBe(200);
	});
});
