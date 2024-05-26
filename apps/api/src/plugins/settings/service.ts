/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { db } from '../../db/client.js';
import { settings } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core';

export class HiveSettings {
	readonly #id = 1;

	public async get() {
		const result = await db.query.settings.findFirst({
			where: eq(settings.id, this.#id),
		});
		if (result === undefined) {
			throw new Error('Settings not found');
		}

		return result;
	}

	public async set(data: SQLiteUpdateSetSource<typeof settings>) {
		await db //
			.update(settings)
			.set(data)
			.where(eq(settings.id, this.#id))
			.execute();
	}

	public async init() {
		const result = await this.get().catch(() => null);
		if (result !== null) {
			return;
		}

		await db //
			.insert(settings)
			.values({
				id: this.#id,
			})
			.execute();
	}
}
