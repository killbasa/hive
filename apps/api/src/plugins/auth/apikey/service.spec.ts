import { generateApiKey, verifyApiKey } from './service.js';

describe('apikey utils', () => {
	it('should generate key with prefix', () => {
		const { apikey } = generateApiKey();

		expect(apikey.startsWith('hive')).toBe(true);
	});

	it('should be fixed length', () => {
		const { apikey } = generateApiKey();

		expect(apikey.length).toBe(58);
	});

	it('should be verifiable', () => {
		const { apikey, hashedkey } = generateApiKey();
		const result = verifyApiKey(apikey, hashedkey);

		expect(result).toBe(true);
	});
});
