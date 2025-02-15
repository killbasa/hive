import { server } from '../../server.js';
import { parseCronExpression } from 'cron-schedule';
import type { Cron } from 'cron-schedule';

export function parseCron(data: string): Cron | null {
	try {
		return parseCronExpression(data);
	} catch (err) {
		server.log.error(err);
		return null;
	}
}
