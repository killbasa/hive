import { isDev } from '../constants.js';
import type { YtdlpArgs } from './cli.js';

export class YtdlpVideoArgs implements YtdlpArgs {
	public readonly data: string[] = [];

	public constructor() {
		this.data.push('--no-warnings');

		if (isDev) {
			// ffprobe ref: https://github.com/yt-dlp/yt-dlp/issues/9228#issuecomment-1949621546
			this.data.push('--ffmpeg-location', '../bin/ffmpeg');
		}
	}

	public format(data: string): this {
		this.data.push('--format', data);
		return this;
	}

	public saveThumbnail(): this {
		this.data.push('--write-thumbnail', '--convert-thumbnails', 'png');
		return this;
	}

	public saveJson(): this {
		this.data.push('--write-info-json', '--parse-metadata', 'video::(?P<formats>)');
		return this;
	}

	public skipDownload(): this {
		this.data.push('--skip-download');
		return this;
	}

	public downloadArchive(channelId: string): this {
		this.data.push(
			'--download-archive', //
			`media/${channelId}/assets/archive.txt`,
			'--force-write-archive',
		);
		return this;
	}

	public writeTo(data: string, options?: { type: 'infojson' | 'none' | 'thumbnail' }): this {
		switch (options?.type) {
			case 'infojson':
				this.data.push('--output', `infojson:${data}`);
				break;
			case 'thumbnail':
				this.data.push('--output', `thumbnail:${data}`);
				break;
			case 'none':
			case undefined:
			default:
				this.data.push('--output', data);
		}

		return this;
	}

	public showProgress(): this {
		const statusStr = '%(progress.status)s';
		const idStr = '%(info.id)s';
		const percentStr = '%(progress._percent_str)s';
		const totalStr = '%(progress._total_bytes_str)s';
		const speedStr = '%(progress._speed_str)s';
		const etaStr = '%(progress._eta_str)s';

		this.data.push(
			'--progress-template', //
			`{"status":"${statusStr}","id":"${idStr}","percentage":"${percentStr}","total":"${totalStr}","speed":"${speedStr}","eta":"${etaStr}"}`,
		);
		return this;
	}

	public live(): this {
		this.data.push('--live-from-start');
		return this;
	}

	public ignoreNoFormatError(): this {
		this.data.push('--ignore-no-formats-error');
		return this;
	}

	public arg(...args: string[]): this {
		this.data.push(...args);
		return this;
	}
}
