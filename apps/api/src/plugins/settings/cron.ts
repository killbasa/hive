import { parseExpression } from 'cron-parser';
import type { CronExpression } from 'cron-parser';

export function parseCron(data: string): CronExpression | null {
	try {
		return parseExpression(data);
	} catch (err: unknown) {
		return null;
	}
}
