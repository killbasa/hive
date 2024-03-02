import { config } from './config';
import { Client as MinioClient } from 'minio';

export const client = new MinioClient({
	endPoint: config.MINIO_ENDPOINT,
	port: config.MINIO_PORT,
	accessKey: config.MINIO_KEYID,
	secretKey: config.MINIO_SECRET,
	useSSL: false
});
