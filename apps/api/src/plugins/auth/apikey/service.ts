import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const PREFIX = 'hive';

export function generateApiKey(): {
	kid: string;
	apikey: string;
	hashedkey: string;
} {
	const id = randomBytes(4).toString('hex');
	const key = randomBytes(32).toString('base64');

	const apikey = `${PREFIX}.${id}.${key}`;

	return {
		kid: id,
		apikey,
		hashedkey: hashKey(apikey),
	};
}

export function verifyApiKey(apikey: string, hashedkey: string): boolean {
	if (!apikey || !hashedkey) return false;

	const parts = apikey.split('.');
	if (parts.length !== 3) return false;

	const [prefix] = parts;
	if (prefix !== PREFIX) return false;

	const computedHash = hashKey(apikey);

	try {
		return timingSafeEqual(
			Buffer.from(hashedkey, 'hex'), //
			Buffer.from(computedHash, 'hex'),
		);
	} catch {
		return false;
	}
}

function hashKey(apiKey: string): string {
	return createHash('sha256').update(apiKey).digest('hex');
}
