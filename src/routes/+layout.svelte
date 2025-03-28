<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../app.css';
	import Navbar from '@/components/navbar/navbar.svelte';
	import { browser } from '$app/environment';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="flex min-h-screen flex-col">
		<Navbar />

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
</QueryClientProvider>
