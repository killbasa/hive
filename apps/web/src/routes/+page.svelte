<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section>
	<div class="grid grid-cols-4 gap-8">
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Channels</div>
				<div class="stat-value">{data.channels}</div>
			</div>
		</div>
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Videos</div>
				<div class="stat-value">{data.videos}</div>
			</div>
		</div>
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Comments</div>
				<div class="stat-value">{data.comments}</div>
			</div>
		</div>
		<div class="stats border">
			<div class="stat">
				<div class="stat-title">Stream comments</div>
				<div class="stat-value">0</div>
			</div>
		</div>
	</div>
</section>
