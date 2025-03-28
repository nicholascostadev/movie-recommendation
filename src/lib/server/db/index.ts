import { drizzle } from 'drizzle-orm/node-postgres';
import { account, movieRating, session, user, verification } from './schema';
import A from 'pg';
import { DATABASE_URL } from '$env/static/private';

const pool = new A.Pool({
	connectionString: DATABASE_URL
});

export const db = drizzle(pool, {
	schema: {
		account,
		session,
		user,
		verification,
		movieRating
	}
});
