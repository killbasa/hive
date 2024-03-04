<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<script lang="ts">
const links = [
	{ name: 'Dashboard', path: '/' },
	{ name: 'Channels', path: '/channels' },
	{ name: 'Videos', path: '/videos' }
];
</script>

<template>
	<nav class="flex justify-center bg-slate-800 px-4 text-slate-50">
		<div class="flex w-full max-w-7xl justify-between">
			<span class="select-none p-3 text-3xl">Hive</span>

			<ul class="flex flex-row items-center">
				<template v-for="(link, i) in links" :key="i">
					<RouterLink :to="link.path" class="flex h-full items-center px-4 text-lg hover:bg-slate-700">
						<li>{{ link.name }}</li>
					</RouterLink>
				</template>
			</ul>

			<div class="p-4">(Icon)</div>
		</div>
	</nav>
</template>

<style scoped></style>
