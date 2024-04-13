/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export const isDev = process.env.NODE_ENV !== 'production';

export const DATA_DIR = isDev ? 'data' : '/var/lib/hive';
export const CLI_PATH = isDev ? './yt-dlp' : 'yt-dlp';

export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;
