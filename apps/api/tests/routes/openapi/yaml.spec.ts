import server from '../../vitest.setup.js';

describe('/spec.yaml', async () => {
	it('should return 200', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/spec.yaml',
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('text/plain; charset=utf-8');
	});
});
