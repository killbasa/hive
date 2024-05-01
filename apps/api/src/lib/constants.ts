/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export const isDev = process.env.NODE_ENV !== 'production';
export const isTesting = process.env.TESTING === 'true';

export const DATA_DIR = isDev ? 'data' : '/var/lib/hive';
export const CLI_PATH = isDev ? '../bin/yt-dlp' : 'yt-dlp';

export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;
