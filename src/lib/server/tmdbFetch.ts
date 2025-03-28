import { TMDB_API_KEY } from '$env/static/private';
import { createFetch } from '@better-fetch/fetch';

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbFetch = createFetch({
	baseURL: TMDB_BASE_URL,
	auth: {
		type: 'Bearer',
		token: TMDB_API_KEY
	}
});
