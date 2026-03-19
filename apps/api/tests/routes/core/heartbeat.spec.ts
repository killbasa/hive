import server from '../../vitest.setup.js';

describe('/heartbeat', () => {
	it('should return 200', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/heartbeat',
		});

		expect(response.statusCode).toBe(200);
		expect(response.json()).toStrictEqual({
			message: 'OK',
		});
	});
});
