<script lang="ts">
	import DownloadPage from '$components/videos/DownloadPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<DownloadPage videos={data.videos} total={data.total} invalidateKey="state:downloads" />
