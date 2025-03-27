const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type Movie = {
	id: number;
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	overview: string;
	release_date: string;
	vote_average: number;
	vote_count: number;
	genre_ids: number[];
	popularity: number;
};

export type MovieDetails = Movie & {
	genres: { id: number; name: string }[];
	runtime: number;
	tagline: string;
	status: string;
	production_companies: { id: number; name: string; logo_path: string | null }[];
	credits: {
		cast: {
			id: number;
			name: string;
			character: string;
			profile_path: string | null;
		}[];
		crew: {
			id: number;
			name: string;
			job: string;
			department: string;
			profile_path: string | null;
		}[];
	};
	videos: {
		results: {
			id: string;
			key: string;
			name: string;
			site: string;
			type: string;
		}[];
	};
};

export type Category = {
	id: string;
	name: string;
	movies: Movie[];
};

export function getPosterUrl(
	path: string | null,
	size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
) {
	if (!path) return null;
	return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
	path: string | null,
	size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'
) {
	if (!path) return null;
	return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getProfileUrl(
	path: string | null,
	size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'
) {
	if (!path) return null;
	return `${IMAGE_BASE_URL}/${size}${path}`;
}
