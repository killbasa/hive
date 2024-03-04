import type { Awaitable } from './types';

export class Socket extends WebSocket {
	public constructor(url: string) {
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
