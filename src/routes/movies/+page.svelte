<script lang="ts">
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { ratingsStore } from '@/stores/ratings.svelte.js';
	import type { Category } from '@/tmdb.js';

	let { data } = $props();

	let categories: Category[] = data.categories;
	let userRatings = data.userRatings || [];

	// Initialize ratings store with user ratings from server
	$effect(() => {
		ratingsStore.setRatings(userRatings);
	});

	function getRatingForMovie(movieId: number): boolean | undefined {
		const rating = ratingsStore.ratings[movieId.toString()];
		return rating ? rating.liked : undefined;
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
	<div class="container mx-auto px-4 py-8">
		<header class="mb-12">
			<h1
				class="mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl"
			>
				Movie Recommendations
			</h1>
			<p class="mx-auto max-w-2xl text-center text-gray-400">
				Discover the best movies across different categories and find your next favorite film
			</p>
		</header>

		<main>
			{#each categories as category (category.id)}
				<section class="mb-14">
					<h2 class="mb-6 flex items-center px-4 text-2xl font-bold">
						{category.name}
						{#if category.id === 'recommended'}
							<span
								class="ml-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 text-xs"
								>For You</span
							>
						{/if}
					</h2>

					<div class="relative">
						<div
							class="grid grid-cols-2 gap-6 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
						>
							{#each category.movies as movie (movie.id)}
								<MovieCard {movie} isLiked={getRatingForMovie(movie.id)} />
							{/each}
						</div>
					</div>
				</section>
			{/each}
		</main>
	</div>
</div>
