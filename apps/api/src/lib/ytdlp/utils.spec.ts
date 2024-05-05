import { describe, expect, test } from 'vitest';
import { parseDurationString } from './utils.js';

describe('parseDurationString', () => {
	test('valid', () => {
		expect(parseDurationString('4:01:33', 0)).toBe(14493);

		expect(parseDurationString('13:41', 0)).toBe(821);

		expect(parseDurationString('37', 0)).toBe(37);
	});

	test('invalid', () => {
		expect(parseDurationString(undefined, 0)).toBe(0);

		expect(parseDurationString('string', 0)).toBe(0);
	});
});
