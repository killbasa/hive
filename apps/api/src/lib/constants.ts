/* eslint-disable @typescript-eslint/prefer-literal-enum-member */

export const DATA_DIR = 'data';
export const DOWNLOADS_DIR = `${DATA_DIR}/downloads`;
export const MEDIA_DIR = `${DATA_DIR}/media`;

export const isDev = process.env.NODE_ENV !== 'production';
