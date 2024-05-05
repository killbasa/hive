export const isDev = process.env.NODE_ENV !== 'production';
export const isTesting = process.env.TESTING === 'true';

export const DATA_DIR: string = isDev ? 'data' : '/var/lib/hive';
export const CLI_PATH: string = isDev ? '../bin/yt-dlp' : 'yt-dlp';
export const API_HOST: string = isDev ? '127.0.0.1' : '0.0.0.0';

export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;
