<script lang="ts">
	import Navbar from '$components/navigation/Navbar.svelte';
	import Footer from '$components/navigation/Footer.svelte';
</script>

<Navbar />
<div class="flex min-h-screen flex-col justify-between p-[7rem,2rem,2rem,4rem]">
	<div class="mx-auto w-full max-w-7xl px-8 py-8 xl:px-0">
		<slot />
	</div>
</div>
<Footer />
