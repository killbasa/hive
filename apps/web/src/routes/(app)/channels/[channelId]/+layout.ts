import { apiFetch } from '$lib/fetch';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import type { Channel } from '@hive/common';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const channel = await apiFetch<Channel>(`/channels/${params.channelId}`, {
		fetch
	});

	if (channel.raw.status === 404) {
		error(404, 'Channel not found');
	}

	const data = await channel.json();

	return {
		channel: data
	};
};
