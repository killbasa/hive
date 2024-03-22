export class YtdlpChannelArgs {
	public readonly data: string[] = [];

	public constructor() {
		this.data.push('--no-warnings', '--playlist-items', '0');
	}

	public saveJson(): this {
		this.data.push('--write-info-json');
		return this;
	}

	public saveThumbnails(): this {
		this.data.push('--write-all-thumbnails', '--convert-thumbnails', 'png');
		return this;
	}

	public writeTo(data: string, options?: { type: 'thumbnail' }): this {
		switch (options?.type) {
			case 'thumbnail':
				this.data.push('--output', `thumbnail:${data}`);
				break;
			default:
				this.data.push('--output', data);
		}

		return this;
	}

	public arg(...args: string[]): this {
		this.data.push(...args);
		return this;
	}
}
