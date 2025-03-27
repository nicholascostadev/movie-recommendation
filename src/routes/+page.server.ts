import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	explore: async () => {
		throw redirect(303, '/movies');
	}
};
