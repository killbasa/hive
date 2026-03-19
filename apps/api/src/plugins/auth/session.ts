/* eslint-disable @typescript-eslint/no-floating-promises */

import { Redis } from 'ioredis';
import type { RedisOptions } from 'ioredis';
import type { SessionStore } from '@fastify/session';
import type { Session } from 'fastify';

export class RedisStore implements SessionStore {
	private readonly client: Redis;
	private readonly ttl: number;

	public constructor(client: RedisOptions & { ttl: number }) {
		this.client = new Redis(client);
		this.ttl = client.ttl;
	}
	public set(sessionId: string, session: Session, callback: (err?: Error | null) => void): void {
		this.client.setex(
			sessionId, //
			Math.ceil(this.ttl / 1000),
			JSON.stringify(session),
			callback,
		);
	}

	public get(sessionId: string, callback: (err?: Error | null, result?: Session | null) => void): void {
		this.client.get(sessionId, (err, result) => {
			if (err) {
				callback(err);
			} else if (result) {
				callback(null, JSON.parse(result));
			} else {
				callback(null, null);
			}
		});
	}

	public destroy(sessionId: string, callback: (err?: Error | null) => void): void {
		this.client.del(sessionId, callback);
	}
}
