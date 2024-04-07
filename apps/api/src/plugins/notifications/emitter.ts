import EventEmitter from 'node:events';
import type { HiveNotifications } from './types.js';

export class HiveNotifier extends EventEmitter {
	public override on<T extends keyof HiveNotifications>(
		event: T, //
		listener: (this: EventEmitter, data: HiveNotifications[T], ...args: any[]) => void
	): this {
		return super.on(event, listener);
	}

	public override off<T extends keyof HiveNotifications>(
		event: T, //
		listener: (this: EventEmitter, data: HiveNotifications[T], ...args: any[]) => void
	): this {
		return super.off(event, listener);
	}

	public override emit<T extends keyof HiveNotifications>(event: T, data: HiveNotifications[T]): boolean {
		return super.emit(event, data);
	}
}
