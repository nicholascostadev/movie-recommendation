<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { authFetch } from '@/auth-client.js';
	import { ratingsStore } from '@/stores/ratings.svelte.js';
	import type { Movie } from '@/tmdb.js';
	import { Loader2Icon, SearchIcon } from '@lucide/svelte';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	let { data } = $props();

	const searchQuery = createInfiniteQuery(() => ({
		queryKey: ['search', data.query],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await authFetch<{ results: Movie[] }>(
				`/api/search?query=${encodeURIComponent(data.query)}&limit=50&page=${pageParam}`,
				{
					baseURL: PUBLIC_BASE_URL
				}
			);

			if (response.error) throw new Error('Search failed');

			return response.data?.results;
		},
		getNextPageParam: (lastPage, pages) => {
			return lastPage.length > 0 ? pages.length + 1 : undefined;
		},
		initialPageParam: 1,
		initialData: {
			pages: [data.results],
			pageParams: [1]
		}
	}));

	let query = $derived(data.query);
	let results = $derived(searchQuery.data?.pages.flatMap((page) => page) || []);
	let totalResults = $derived(data.totalResults || 0);
	let error = $derived(data.error);

	// For sorting and filtering
	let sortOption = $state('popularity');

	let sortedResults = $derived(
		[...(searchQuery.data?.pages.flatMap((page) => page) || [])].sort((a, b) => {
			if (sortOption === 'popularity') {
				return b.popularity - a.popularity;
			} else if (sortOption === 'rating') {
				return b.vote_average - a.vote_average;
			} else if (sortOption === 'date') {
				return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
			} else if (sortOption === 'title') {
				return a.title.localeCompare(b.title);
			}
			return 0;
		})
	);

	function getRatingForMovie(movieId: number): boolean | undefined {
		const rating = ratingsStore.ratings[movieId.toString()];
		return rating ? rating.liked : undefined;
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
	<div class="container mx-auto px-4 py-8">
		<header class="mb-8">
			<h1 class="text-3xl font-bold">Search Results</h1>

			{#if query}
				<div class="mt-2 flex items-center text-gray-400">
					<span>Results for</span>
					<span class="ml-1 rounded-md bg-gray-800 px-2 py-0.5 text-sm font-medium text-white"
						>"{query}"</span
					>
					<span class="ml-2"
						>{results.length}
						{results.length === 1 ? 'result' : 'results'}
						{#if totalResults > results.length}
							<span class="text-sm">(showing top {results.length} of {totalResults})</span>
						{/if}
					</span>
				</div>
			{:else}
				<p class="mt-2 text-gray-400">Enter a search term to find movies</p>
			{/if}
		</header>

		{#if error}
			<div class="mt-8 rounded-lg border border-red-900 bg-red-900/20 p-4 text-red-300">
				<p>{error}</p>
			</div>
		{/if}

		{#if results.length === 0 && !error && query}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="rounded-full bg-gray-800 p-8">
					<SearchIcon size={48} class="text-gray-600" />
				</div>
				<h2 class="mt-6 text-xl font-medium">No results found</h2>
				<p class="mt-2 text-gray-400">
					We couldn't find any movies matching "{query}". Try with a different search term.
				</p>
			</div>
		{:else if results.length > 0}
			<div class="mb-6 flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<span class="text-sm text-gray-400">Sort by:</span>
					<select
						bind:value={sortOption}
						class="rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
					>
						<option value="popularity">Popularity</option>
						<option value="rating">Rating</option>
						<option value="date">Release Date</option>
						<option value="title">Title</option>
					</select>
				</div>
			</div>

			<div
				class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
			>
				{#each sortedResults as movie (movie.id)}
					<MovieCard {movie} isLiked={getRatingForMovie(movie.id)} />
				{/each}
			</div>

			{#if searchQuery.hasNextPage}
				<div class="flex justify-center">
					<button
						class="mt-4 flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
						onclick={() => searchQuery.fetchNextPage()}
						disabled={searchQuery.isFetchingNextPage}
					>
						{#if searchQuery.isFetchingNextPage}
							<Loader2Icon class="animate-spin" size={16} />
						{/if}
						Load more
					</button>
				</div>
			{/if}
		{/if}

		{#if !query}
			<div class="mt-8 flex flex-col items-center text-center">
				<div class="rounded-full bg-gray-800 p-6">
					<SearchIcon size={32} class="text-gray-600" />
				</div>
				<h2 class="mt-4 text-xl font-semibold">Search for your favorite movies</h2>
				<p class="mt-2 max-w-md text-gray-400">
					Use the search bar above to find movies by title, actor, or director.
				</p>
			</div>
		{/if}
	</div>
</div>
