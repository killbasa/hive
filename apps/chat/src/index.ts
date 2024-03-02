import { config } from './config';
import { Job, Worker } from 'bullmq';

new Worker(
	'notifications',
	async (job: Job) => {
		console.log(job.data);
	},
	{
		connection: {
			host: config.REDIS_HOST,
			port: config.REDIS_PORT,
			password: config.REDIS_PASSWORD
		}
	}
);
