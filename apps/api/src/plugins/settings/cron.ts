import { server } from '../../server.js';
import cron from 'cron-parser';
import type { CronExpression } from 'cron-parser';

export function parseCron(data: string): CronExpression | null {
	try {
		return cron.parseExpression(data);
	} catch (err) {
		server.log.error(err);
		return null;
	}
}
