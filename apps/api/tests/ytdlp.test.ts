import { Time } from '../src/lib/utils';
import { downloadChannel } from '../src/lib/ytdlp/channels';
import { describe, expect, test } from 'vitest';

describe('ytdlp', () => {
	test('Download channel', { timeout: Time.Hour }, async () => {
		await downloadChannel('UCdubotSy4pPOsiaW4MrYn3Q');

		expect(true).toBe(true);
	});
});
