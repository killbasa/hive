import { ScalarContentSecurityPolicies } from '../../../src/plugins/openapi/constants.js';
import server from '../../vitest.setup.js';

describe('/spec.json', () => {
	it('should return 200', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/reference',
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
		expect(response.headers['content-security-policy']).toBe(ScalarContentSecurityPolicies);
	});
});
