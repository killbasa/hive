import server from '../../vitest.setup.js';

describe('/spec.json', async () => {
	it('should return 200', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/spec.json',
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
	});
});
