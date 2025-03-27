<script lang="ts">
	import { ChevronRightIcon, FilmIcon, PopcornIcon, ThumbsUpIcon } from '@lucide/svelte';

	let isLoaded = $state(false);

	$effect(() => {
		setTimeout(() => {
			isLoaded = true;
		}, 300);

		return () => (isLoaded = false);
	});
</script>

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black"
>
	<!-- Background animated gradient -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute -inset-[10px] opacity-50">
			<div
				class="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl"
			></div>
			<div
				class="absolute bottom-0 right-0 h-[500px] w-[800px] rounded-full bg-indigo-600/20 blur-3xl"
			></div>
			<div
				class="absolute bottom-40 left-20 h-[400px] w-[400px] rounded-full bg-pink-600/20 blur-3xl"
			></div>
		</div>
	</div>

	<!-- Content -->
	<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-white">
		<header
			class="text-center transition-all duration-1000 ease-out {isLoaded
				? 'translate-y-0 opacity-100'
				: 'translate-y-10 opacity-0'}"
		>
			<h1 class="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
				<span
					class="block bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
					>Discover Your</span
				>
				<span class="mt-2 block">Next Favorite Movie</span>
			</h1>

			<p class="mx-auto mt-6 max-w-xl text-lg text-gray-300 sm:text-xl">
				Explore curated recommendations, popular releases, and personalize your experience by rating
				the movies you love.
			</p>
		</header>

		<div
			class="mt-12 transition-all delay-200 duration-1000 ease-out {isLoaded
				? 'translate-y-0 opacity-100'
				: 'translate-y-10 opacity-0'}"
		>
			<a
				href="/movies"
				class="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 text-lg font-medium"
			>
				<span
					class="relative rounded-full bg-gray-900 px-8 py-3.5 transition-all duration-300 ease-out group-hover:bg-opacity-0"
				>
					<span class="relative flex items-center gap-2 text-white">
						Explore Movies
						<ChevronRightIcon size="16" />
					</span>
				</span>
			</a>
		</div>

		<!-- Floating movie posters -->
		<div class="absolute bottom-[-100px] left-0 right-0 flex justify-center overflow-hidden">
			<div
				class="flex items-end gap-2 transition-all delay-500 duration-1000 ease-out md:gap-4 {isLoaded
					? 'translate-y-0 opacity-70'
					: 'translate-y-20 opacity-0'}"
			>
				<div
					class="h-44 w-32 rotate-[-15deg] rounded-lg shadow-2xl md:h-64 md:w-48"
					style="background-image: url('https://image.tmdb.org/t/p/w500/bkpPTZUdq31UGDovmszsg2CchiI.jpg'); background-size: cover;"
				></div>
				<div
					class="h-52 w-36 rounded-lg shadow-2xl md:h-72 md:w-52"
					style="background-image: url('https://image.tmdb.org/t/p/w500/kdPMUMJzyYAc4roD52qavX0nLIC.jpg'); background-size: cover;"
				></div>
				<div
					class="h-40 w-28 rotate-[15deg] rounded-lg shadow-2xl md:h-60 md:w-44"
					style="background-image: url('https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'); background-size: cover;"
				></div>
			</div>
		</div>

		<!-- Features -->
		<div
			class="container mx-auto mt-16 max-w-6xl px-4 pt-16 transition-all delay-300 duration-1000 ease-out {isLoaded
				? 'translate-y-0 opacity-100'
				: 'translate-y-10 opacity-0'}"
		>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
					<div class="mb-4 w-fit rounded-full bg-indigo-500/20 p-3">
						<PopcornIcon size="20" />
					</div>
					<h3 class="text-xl font-semibold">Curated Categories</h3>
					<p class="mt-2 text-gray-400">
						Browse through top-rated, popular, and upcoming movies organized in beautiful
						categories.
					</p>
				</div>

				<div class="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
					<div class="mb-4 w-fit rounded-full bg-purple-500/20 p-3">
						<ThumbsUpIcon size="20" />
					</div>
					<h3 class="text-xl font-semibold">Rate & Save</h3>
					<p class="mt-2 text-gray-400">
						Like or dislike movies to build your personalized recommendation profile.
					</p>
				</div>

				<div class="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
					<div class="mb-4 w-fit rounded-full bg-pink-500/20 p-3">
						<FilmIcon size="20" />
					</div>
					<h3 class="text-xl font-semibold">Detailed Information</h3>
					<p class="mt-2 text-gray-400">
						Get comprehensive details, cast information, and trailers for every movie.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
