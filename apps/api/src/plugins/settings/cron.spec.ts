import { Time } from '@hive/common';
import { describe, expect, test } from 'vitest';
import { parseCron } from './cron.js';

describe('cron utils', () => {
	test('one day', () => {
		const result = parseCron('0 1 * * *');

		const before = result?.next().getTime() ?? 0;
		const after = result?.next().getTime() ?? 0;

		expect(after - before).toBe(Time.Day);
	});

	test('invalid', () => {
		const result = parseCron('string');

		expect(result).toBe(null);
	});
});
