<script lang="ts">
	import { page } from '$app/state';
	import { authClient } from '@/auth-client';
	import '../app.css';
	import ProfileButton from '@/components/profile-button/profile-button.svelte';

	const session = authClient.useSession();
</script>

<div class="flex min-h-screen flex-col">
	<nav class="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<a href="/" class="flex items-center">
				<span
					class="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent"
					>MovieRec</span
				>
			</a>

			<div class="flex items-center space-x-6">
				<a
					href="/movies"
					class="text-sm font-medium transition-colors {page.url.pathname.startsWith('/movies')
						? 'text-white'
						: 'text-gray-400 hover:text-white'}"
				>
					Movies
				</a>

				<!-- Add more navigation items here in the future -->

				<!-- User button placeholder - this would be connected to your auth system -->
				{#if $session.data?.user}
					<ProfileButton />
				{:else}
					<a href="/login" class="text-sm font-medium text-gray-400 hover:text-white">Login</a>
				{/if}
			</div>
		</div>
	</nav>

	<main class="flex-1">
		<slot />
	</main>

	<footer class="border-t border-gray-800 bg-gray-900">
		<div class="container mx-auto px-4 py-6">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-gray-400">
					Movie data provided by <a
						href="https://www.themoviedb.org"
						target="_blank"
						rel="noopener noreferrer"
						class="text-indigo-400 hover:text-indigo-300">TMDB</a
					>
				</p>
				<p class="text-sm text-gray-500">© {new Date().getFullYear()} MovieRec</p>
			</div>
		</div>
	</footer>
</div>
