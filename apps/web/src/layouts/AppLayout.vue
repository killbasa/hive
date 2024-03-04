<script setup lang="ts">
import AppNavbar from './AppNavbar.vue';
</script>

<script lang="ts"></script>

<template>
	<div class="flex flex-col">
		<app-navbar></app-navbar>
		<div class="flex min-h-screen flex-col justify-between p-[7rem,2rem,2rem,4rem]">
			<div class="mx-auto w-full max-w-7xl px-8 py-8 xl:px-0">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
