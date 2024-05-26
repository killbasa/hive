import { server } from '../../server.js';

export const RepeatJobIds = {
	SyncVideoStatus: 'SyncVideoStatus',
	ScanChannels: 'ScanChannels',
	DownloadPending: 'DownloadPending',
	ChannelMetadata: 'ChannelMetadata',
} as const;
type JobsIds = (typeof RepeatJobIds)[keyof typeof RepeatJobIds];

const jobKeys = new Map<JobsIds, string>();

export async function initRepeatTasks(): Promise<void> {
	await server.tasks.internal.add(
		RepeatJobIds.SyncVideoStatus, //
		{ page: 0 },
		{
			jobId: RepeatJobIds.SyncVideoStatus,
			repeat: { pattern: '0 */30 * * * *' },
		},
	);

	const {
		cronCheckSubscriptions, //
		cronDownloadPending,
		cronChannelMetadata,
	} = await server.settings.get();

	await Promise.all([
		setRepeatJob(RepeatJobIds.ScanChannels, cronCheckSubscriptions), //
		setRepeatJob(RepeatJobIds.DownloadPending, cronDownloadPending),
		setRepeatJob(RepeatJobIds.ChannelMetadata, cronChannelMetadata),
	]);
}

export async function setRepeatJob(id: JobsIds, pattern: string | null): Promise<void> {
	const jobKey = jobKeys.get(id);
	if (jobKey) {
		await server.tasks.internal.removeRepeatableByKey(jobKey);
	}

	if (pattern === null || pattern === '') {
		jobKeys.delete(id);
		server.log.info(`disabled cron task: ${id}`);
		return;
	}

	const job = await server.tasks.internal.add(
		id, //
		undefined,
		{
			jobId: id,
			repeat: { pattern },
		},
	);

	if (job.repeatJobKey === undefined) {
		throw new Error(`repeatJobKey is undefined: ${id}`);
	}

	jobKeys.set(id, job.repeatJobKey);

	server.log.info(`set cron task: ${id} (${pattern})`);
}
