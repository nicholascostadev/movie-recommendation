import { PUBLIC_BASE_URL } from '$env/static/public';
import { authFetch } from '@/auth-client';

type Rating = {
	id: string;
	movieId: string;
	userId: string;
	liked: boolean;
};

class RatingsStoreClass {
	ratings: Record<string, Rating> = $state({});
	isLoading = $state(false);
	error: string | null = $state(null);

	setRatings(ratings: Rating[]) {
		const newRatings: Record<string, Rating> = {};
		ratings.forEach((rating) => {
			newRatings[rating.movieId] = rating;
		});
		this.ratings = newRatings;
	}

	addRating(rating: Rating) {
		this.ratings[rating.movieId] = rating;
	}

	removeRating(movieId: string) {
		delete this.ratings[movieId];
	}

	setLoading(isLoading: boolean) {
		this.isLoading = isLoading;
	}

	setError(error: string | null) {
		this.error = error;
	}
}

export const ratingsStore = new RatingsStoreClass();

export async function rateMovie(movieId: string, liked: boolean) {
	ratingsStore.setLoading(true);
	ratingsStore.setError(null);

	try {
		const response = await authFetch<{ rating: Rating }>('/api/movie-rating', {
			baseURL: PUBLIC_BASE_URL,
			method: 'POST',
			body: { movieId, liked }
		});

		if (response.error) {
			throw new Error(response.error.message || 'Failed to rate movie');
		}

		ratingsStore.addRating(response.data.rating);
	} catch (error) {
		ratingsStore.setError(error instanceof Error ? error.message : 'Failed to rate movie');
		console.error('Error rating movie:', error);
	} finally {
		ratingsStore.setLoading(false);
	}
}

export async function removeRating(movieId: string) {
	ratingsStore.setLoading(true);
	ratingsStore.setError(null);

	try {
		const response = await authFetch<{ rating: Rating }>('/api/movie-rating', {
			method: 'DELETE',
			baseURL: PUBLIC_BASE_URL,
			body: { movieId }
		});

		if (response.error) {
			throw new Error(response.error.message || 'Failed to remove rating');
		}

		ratingsStore.removeRating(movieId);
	} catch (error) {
		ratingsStore.setError(error instanceof Error ? error.message : 'Failed to remove rating');
		console.error('Error removing rating:', error);
	} finally {
		ratingsStore.setLoading(false);
	}
}
