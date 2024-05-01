import { parseCron } from './cron.js';
import { Time } from '@hive/common';
import { describe, expect, test } from 'vitest';

describe('cron utils', () => {
	test('one day', async () => {
		const result = parseCron('0 1 * * *');

		const before = result?.next().getTime() ?? 0;
		const after = result?.next().getTime() ?? 0;

		expect(after - before).toBe(Time.Day);
	});

	test('invalid', async () => {
		const result = parseCron('string');

		expect(result).toBe(null);
	});
});
