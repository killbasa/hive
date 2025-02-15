import { parseCron } from './cron.js';
import { server } from '../../server.js';
import { Time } from '@hive/common';

describe('cron utils', () => {
	test('one day', () => {
		const result = parseCron('0 1 * * *');
		const next = result?.getNextDates(2);

		const before = next?.[0].getTime() ?? 0;
		const after = next?.[1].getTime() ?? 0;

		expect(after - before).toBe(Time.Day);
	});

	test('invalid', () => {
		const spy = vi.spyOn(server.log, 'error').mockImplementation(() => {});

		const result = parseCron('string');

		expect(result).toBe(null);
		expect(spy).toHaveBeenCalled();
	});
});
