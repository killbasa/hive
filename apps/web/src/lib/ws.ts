import { config } from './config';
import type { Awaitable } from '@hive/common';

export class HiveWebSocket extends WebSocket {
	public constructor(path: string) {
		const api = new URL(window.location.href);
		api.protocol = 'ws';

		const url = new URL(`${config.apiPath}${path}`, api);
		super(url);
	}

	public onOpen(callback: () => void) {
		super.onopen = callback;
	}

	public onClose(callback: () => void) {
		super.onclose = callback;
	}

	public onMessage<T>(callback: (event: MessageEvent<T>) => Awaitable<unknown>) {
		super.onmessage = (event: MessageEvent<T>) => callback(event);
	}

	public override send<T>(data: T) {
		super.send(JSON.stringify(data));
	}
}
