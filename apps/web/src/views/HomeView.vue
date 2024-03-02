<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<script lang="ts">
import { ref } from 'vue';

const messages = ref<string[]>([]);
const socket = new WebSocket('ws://localhost:3001/notifications');

socket.onmessage = function (event) {
	messages.value.push(event.data);
};

function sendPing() {
	socket.send(JSON.stringify({ type: 'ping', data: 'ping' }));
}

function joinRoom() {
	socket.send(JSON.stringify({ type: 'join', data: 'test_id' }));
}

function leaveRoom() {
	socket.send(JSON.stringify({ type: 'leave', data: 'test_id' }));
}
</script>

<template>
	<div class="wrapper">
		<nav>
			<RouterLink to="/">Home</RouterLink>
		</nav>
	</div>
	<div style="display: flex">
		<button @click="sendPing">Send Message</button>
		<button @click="joinRoom">Join</button>
		<button @click="leaveRoom">Leave</button>
	</div>
	<div v-for="(item, i) in messages" :key="i">
		{{ item }}
	</div>
</template>

<style scoped>
header {
	line-height: 1.5;
	max-height: 100vh;
}

nav {
	width: 100%;
	font-size: 12px;
	text-align: center;
	margin-top: 2rem;
}

nav a.router-link-exact-active {
	color: var(--color-text);
}

nav a.router-link-exact-active:hover {
	background-color: transparent;
}

nav a {
	display: inline-block;
	padding: 0 1rem;
	border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
	border: 0;
}

@media (min-width: 1024px) {
	header {
		display: flex;
		place-items: center;
		padding-right: calc(var(--section-gap) / 2);
	}

	.logo {
		margin: 0 2rem 0 0;
	}

	header .wrapper {
		display: flex;
		place-items: flex-start;
		flex-wrap: wrap;
	}

	nav {
		text-align: left;
		margin-left: -1rem;
		font-size: 1rem;

		padding: 1rem 0;
		margin-top: 1rem;
	}
}
</style>
