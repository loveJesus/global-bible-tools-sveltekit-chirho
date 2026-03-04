// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Actions as ActionsChirho } from './$types';
import { fail as failChirho } from '@sveltejs/kit';
import { env as envChirho } from '$env/dynamic/private';
import { userRepositoryChirho } from '$lib/modules-chirho/users-chirho/data-access-chirho/user-repository-chirho';
import { sendEmailChirho, passwordResetEmailChirho } from '$lib/server/email-chirho';

export const actions: ActionsChirho = {
	default: async ({ request: requestChirho, url: urlChirho }) => {
		const formDataChirho = await requestChirho.formData();
		const emailChirho = (formDataChirho.get('emailChirho') as string)?.trim().toLowerCase();

		if (!emailChirho) {
			return failChirho(400, { errorChirho: 'Email is required', emailChirho });
		}

		// Always show success to prevent email enumeration
		const successResponseChirho = { successChirho: true, emailChirho };

		const userChirho = await userRepositoryChirho.findByEmailChirho(emailChirho);
		if (!userChirho) {
			// Don't reveal whether the email exists
			return successResponseChirho;
		}

		try {
			const resetChirho = userChirho.startPasswordResetChirho();
			await userRepositoryChirho.commitChirho(userChirho);

			const baseUrlChirho = envChirho.PUBLIC_URL_CHIRHO || urlChirho.origin;
			const resetLinkChirho = `${baseUrlChirho}/reset-password-chirho?token=${resetChirho.tokenChirho}`;

			const emailContentChirho = passwordResetEmailChirho(
				userChirho.nameChirho ?? '',
				resetLinkChirho
			);
			await sendEmailChirho({
				toChirho: emailChirho,
				subjectChirho: emailContentChirho.subjectChirho,
				htmlChirho: emailContentChirho.htmlChirho
			});
		} catch (errorChirho) {
			// Log but don't expose to user
			console.error('[forgot-password-chirho] Error:', errorChirho);
		}

		return successResponseChirho;
	}
};
