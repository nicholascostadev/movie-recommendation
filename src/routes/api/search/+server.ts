import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { tmdbFetch } from '@/server/tmdbFetch';
import type { Movie } from '@/tmdb';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('query');
	const page = Number(url.searchParams.get('page') || '1');
	const limit = Number(url.searchParams.get('limit') || '10');

	if (!query) {
		return json({ results: [] });
	}

	try {
		const searchParams = new URLSearchParams();

		searchParams.append('query', query);
		searchParams.append('include_adult', 'false');

		const response = await tmdbFetch(`/search/movie?${searchParams.toString()}&page=${page}`);

		if (response.error) {
			throw new Error(`TMDB API error: ${response.error.status} ${response.error.message}`);
		}

		const data = response.data as {
			results: Movie[];
		};

		// Return only the amount of results requested (limit)
		const results = data.results.slice(0, Math.min(limit, 50));

		return json({ results });
	} catch (error) {
		console.error('Search error:', error);
		return json({ error: 'Failed to search movies', results: [] }, { status: 500 });
	}
};
