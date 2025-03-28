import { tmdbFetch } from '@/server/tmdbFetch';
import type { PageServerLoad } from './$types';
import type { Movie } from '@/tmdb';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return {
			query: '',
			results: []
		};
	}

	try {
		const searchParams = new URLSearchParams();
		searchParams.append('query', query);
		searchParams.append('include_adult', 'false');

		const response = await tmdbFetch(`/search/movie?${searchParams.toString()}`);

		if (response.error) {
			throw new Error(`TMDB API error: ${response.error.status} ${response.error.message}`);
		}

		const data = response.data as {
			results: Movie[];
			total_results: number;
		};

		// Limit to 50 results
		const results = data.results.slice(0, 50);

		return {
			query,
			results,
			totalResults: data.total_results
		};
	} catch (error) {
		console.error('Search error:', error);
		return {
			query,
			results: [],
			error: 'Failed to search movies'
		};
	}
};
