export const isDev = process.env.NODE_ENV !== 'production';
export const isTesting = process.env.TESTING === 'true';

export const DATA_DIR: string = isDev ? 'data' : '/var/lib/hive';
export const CLI_PATH: string = isDev ? '../bin/yt-dlp' : 'yt-dlp';
export const API_HOST: string = isDev ? '127.0.0.1' : '0.0.0.0';

export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;

export const UiContentSecurityPolicies: string = [
	"default-src 'none'", //
	"script-src-elem 'self' 'unsafe-inline'",
	"script-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	"connect-src 'self' ws:",
	"img-src 'self' data:",
	"media-src 'self'",
	"manifest-src 'self'",
	...(isDev ? ['report-uri /api/csp'] : []),
].join('; ');
