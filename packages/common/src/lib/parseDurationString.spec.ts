import { parseDurationString } from './parseDurationString.js';
import { Time } from '../enums.js';

describe('parseDurationString', () => {
	test('valid', () => {
		expect(parseDurationString('4:01:33')) //
			.toBe((Time.Hour * 4 + Number(Time.Minute) + Time.Second * 33) / 1000);

		expect(parseDurationString('13:41')) //
			.toBe((Time.Minute * 13 + Time.Second * 41) / 1000);

		expect(parseDurationString('37')) //
			.toBe((Time.Second * 37) / 1000);
	});

	test('invalid', () => {
		expect(parseDurationString(undefined)).toBe(null);

		expect(parseDurationString('string')).toBe(null);
	});
});
