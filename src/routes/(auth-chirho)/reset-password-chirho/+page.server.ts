// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { fail as failChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { userRepositoryChirho } from '$lib/modules-chirho/users-chirho/data-access-chirho/user-repository-chirho';
import { InvalidPasswordResetTokenChirho } from '$lib/modules-chirho/users-chirho/model-chirho/errors-chirho';
import { createSessionChirho } from '$lib/server/session-chirho';

export const load: PageServerLoadChirho = async ({ url: urlChirho }) => {
	const tokenChirho = urlChirho.searchParams.get('token');

	if (!tokenChirho) {
		return { validChirho: false, errorChirho: 'Missing reset token. Please request a new password reset link.' };
	}

	const userChirho = await userRepositoryChirho.findByResetPasswordTokenChirho(tokenChirho);
	if (!userChirho) {
		return { validChirho: false, errorChirho: 'Invalid or expired reset link. Please request a new one.' };
	}

	return { validChirho: true, errorChirho: null };
};

export const actions: ActionsChirho = {
	default: async ({ request: requestChirho, url: urlChirho, cookies: cookiesChirho }) => {
		const tokenChirho = urlChirho.searchParams.get('token');
		if (!tokenChirho) {
			return failChirho(400, { errorChirho: 'Missing reset token' });
		}

		const formDataChirho = await requestChirho.formData();
		const newPasswordChirho = formDataChirho.get('passwordChirho') as string;
		const confirmPasswordChirho = formDataChirho.get('confirmPasswordChirho') as string;

		if (!newPasswordChirho || newPasswordChirho.length < 8) {
			return failChirho(400, { errorChirho: 'Password must be at least 8 characters' });
		}

		if (newPasswordChirho !== confirmPasswordChirho) {
			return failChirho(400, { errorChirho: 'Passwords do not match' });
		}

		const userChirho = await userRepositoryChirho.findByResetPasswordTokenChirho(tokenChirho);
		if (!userChirho) {
			return failChirho(400, { errorChirho: 'Invalid or expired reset link. Please request a new one.' });
		}

		try {
			await userChirho.completePasswordResetChirho(tokenChirho, newPasswordChirho);
			await userRepositoryChirho.commitChirho(userChirho);

			// Log the user in automatically
			await createSessionChirho(userChirho.idChirho, cookiesChirho);

			throw redirectChirho(302, '/?password-reset=true');
		} catch (errorChirho) {
			if (errorChirho instanceof Response || (errorChirho as { status?: number }).status === 302) {
				throw errorChirho;
			}
			if (errorChirho instanceof InvalidPasswordResetTokenChirho) {
				return failChirho(400, { errorChirho: 'Invalid or expired reset link. Please request a new one.' });
			}
			console.error('[reset-password-chirho] Error:', errorChirho);
			return failChirho(500, { errorChirho: 'An unexpected error occurred. Please try again.' });
		}
	}
};
