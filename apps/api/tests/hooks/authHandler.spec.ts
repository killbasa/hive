import server from '../vitest.setup.js';

describe('authHandler', () => {
	it('should return 401', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/version',
		});

		expect(response.statusCode).toBe(401);
	});

	it('should return 200 with cookie', async () => {
		const token = server.jwt.sign({
			id: 1,
			name: 'test-noapikey',
		});

		const response = await server.inject({
			method: 'GET',
			url: '/version',
			cookies: {
				[server.config.auth.cookie]: token,
			},
		});

		expect(response.statusCode).toBe(200);
	});

	// TODO - Fix, this now involves a database call
	it.skip('should return 200 with api key', async () => {
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
