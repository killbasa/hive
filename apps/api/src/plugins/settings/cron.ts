import { parseCronExpression } from 'cron-schedule';
import type { Cron } from 'cron-schedule';

export function parseCron(data: string): Cron | null {
	try {
		return parseCronExpression(data);
	} catch (err) {
		console.error(err);
		return null;
	}
}
