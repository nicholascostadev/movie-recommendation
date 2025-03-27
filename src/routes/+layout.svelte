<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { authClient } from '$lib/auth-client';
	import ProfileButton from '$lib/components/profile-button/profile-button.svelte';
	const session = authClient.useSession();
</script>

<header class="flex h-16 items-center border-b border-border">
	<nav class="container flex items-center justify-between">
		<a href="/" class="text-2xl font-bold">AlgoSolve</a>
		<ul class="flex gap-4">
			{#if !$session.data}
				<li>
					<a href="/login" class="text-lg">Login</a>
				</li>
			{:else}
				<li>
					<ProfileButton />
				</li>
			{/if}
		</ul>
	</nav>
</header>

<div class="min-h-[calc(100vh-4rem)] overflow-clip">
	{@render children()}
</div>
