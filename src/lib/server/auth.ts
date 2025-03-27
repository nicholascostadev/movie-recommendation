import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { account, session, user, verification } from './db/schema';
import { username } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user,
			session,
			account,
			verification
		}
	}),
	user: {
		additionalFields: {
			username: {
				type: 'string',
				nullable: false
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true
	},
	socialProviders: {
		github: {
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET
		}
	},
	plugins: [
		username({
			maxUsernameLength: 20,
			minUsernameLength: 5,
			usernameValidator: (username) => {
				if (!/^[a-zA-Z0-9_]+$/.test(username)) {
					return false;
				}

				if (username === 'admin') return false;

				return true;
			}
		})
	]
});
