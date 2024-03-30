import { config } from './config';
import type { Awaitable } from './types';

export class Socket extends WebSocket {
	public constructor(path: string) {
		const url = new URL(path, `ws://${config.apiUrl}`);
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
