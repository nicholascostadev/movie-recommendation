import { db } from '$lib/server/db';
import { movieRating } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export type MovieRatingInput = {
	movieId: string;
	liked: boolean;
};

export async function getUserMovieRatings(userId: string) {
	return db.query.movieRating.findMany({
		where: eq(movieRating.userId, userId)
	});
}

export async function getMovieRating(userId: string, movieId: string) {
	const rating = await db.query.movieRating.findFirst({
		where: and(eq(movieRating.userId, userId), eq(movieRating.movieId, movieId))
	});

	return rating || null;
}

export async function rateMovie(userId: string, input: MovieRatingInput) {
	// Check if rating already exists
	const existingRating = await getMovieRating(userId, input.movieId);

	const now = new Date();

	if (existingRating) {
		// Update existing rating
		return db
			.update(movieRating)
			.set({
				liked: input.liked,
				updatedAt: now
			})
			.where(eq(movieRating.id, existingRating.id))
			.returning();
	} else {
		// Create new rating
		return db
			.insert(movieRating)
			.values({
				id: nanoid(),
				userId,
				movieId: input.movieId,
				liked: input.liked,
				createdAt: now,
				updatedAt: now
			})
			.returning();
	}
}

export async function deleteMovieRating(userId: string, movieId: string) {
	return db
		.delete(movieRating)
		.where(and(eq(movieRating.userId, userId), eq(movieRating.movieId, movieId)));
}
