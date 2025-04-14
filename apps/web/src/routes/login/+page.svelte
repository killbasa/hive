<script lang="ts">
	import { client } from '$lib/client';
	import { toast } from '$lib/stores/toasts';
	import type { FormEventHandler } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import { debounce } from '@hive/common';

	let username = $state('');
	let exists = $state<boolean>();

	let loginPassword = $state('');
	let loginRemember = $state(false);

	let signupPassword = $state('');
	let signupConfirmPassword = $state('');
	let signupDisabled = $derived(
		username === '' || signupPassword === '' || signupPassword !== signupConfirmPassword,
	);

	const checkUsername = debounce(async () => {
		if (username === '') {
			exists = undefined;
			return;
		}

		const response = await client.POST('/auth/exists', {
			body: {
				username,
			},
		});

		if (response.error) {
			toast.error('Something went wrong');
		} else {
			exists = response.data.exists;
		}
	}, 500);

	const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		const response = await client.POST('/auth/credentials/login', {
			body: {
				username,
				password: loginPassword,
				remember: loginRemember,
			},
		});

		if (response.response.ok) {
			await goto('/');
		} else {
			toast.error(response.error?.message ?? 'An error occurred');
		}
	};

	const handleSignup: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();

		if (signupPassword !== signupConfirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		const { response, error } = await client.PUT('/auth/credentials/signup', {
			body: {
				username,
				password: signupPassword,
			},
		});

		if (response.ok) {
			toast.success('Account created');
			await goto('/login');
		} else if (response.status === 403) {
			toast.error('User registration is disabled');
		} else if (response.status === 409) {
			toast.error('User already exists');
		} else {
			toast.error(error?.message ?? 'An error occurred');
		}
	};
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col items-center">
	<h1>Hive</h1>

	<div class="flex flex-col gap-2 w-80">
		<input
			type="text"
			name="username"
			placeholder="Username"
			class="input input-bordered focus:input-primary"
			bind:value={username}
			oninput={async () => {
				await checkUsername();
			}}
		/>

		{#if exists === true}
			<form onsubmit={handleLogin} class="flex flex-col gap-2">
				<input
					type="password"
					name="password"
					placeholder="Password"
					class="input input-bordered focus:input-primary"
					bind:value={loginPassword}
				/>
				<button type="submit" class="btn btn-neutral">Log in</button>
				<label class="label cursor-pointer justify-normal gap-2">
					<input
						type="checkbox"
						class="checkbox checkbox-primary"
						bind:checked={loginRemember}
					/>
					<span>Remember me</span>
				</label>
			</form>
		{:else if exists === false}
			<form onsubmit={handleSignup} class="flex flex-col gap-2">
				<input
					type="password"
					name="password"
					placeholder="Password"
					class="input input-bordered focus:input-primary"
					bind:value={signupPassword}
				/>
				<input
					type="password"
					name="password"
					placeholder="Confirm password"
					class="input input-bordered focus:input-primary"
					bind:value={signupConfirmPassword}
				/>
				<button type="submit" class="btn btn-neutral" disabled={signupDisabled}
					>Create account</button
				>
			</form>
		{/if}
	</div>
</div>
