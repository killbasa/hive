<script lang="ts">
	import type { PageProps } from './$types';
	import DownloadPage from '$components/videos/DownloadPage.svelte';

	let { data }: PageProps = $props();
</script>

<DownloadPage videos={data.videos} total={data.total} invalidateKey="state:downloads" />
