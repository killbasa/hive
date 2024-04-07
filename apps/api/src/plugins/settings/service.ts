/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { db } from '../../db/client';
import { settings } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

export const hiveSettings = {
	async get() {
		const result = await db.query.settings.findFirst({
			where: eq(settings.id, 1)
		});
		if (result === undefined) {
			throw new Error('Settings not found');
		}

		return result;
	},
	async set(data: SQLiteUpdateSetSource<typeof settings>) {
		await db //
			.update(settings)
			.set(data)
			.where(eq(settings.id, 1))
			.execute();
	},
	async init() {
		const result = await this.get().catch(() => null);
		if (result !== null) return;

		await db //
			.insert(settings)
			.values({
				id: 1
			})
			.execute();
	}
};
