// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Actions as ActionsChirho } from './$types';
import { fail as failChirho } from '@sveltejs/kit';
import { dbChirho } from '$lib/server/db-chirho';
import { feedbackTableChirho } from '$lib/server/schema-chirho';

export const actions: ActionsChirho = {
	default: async ({ request: requestChirho }) => {
		const formDataChirho = await requestChirho.formData();
		const emailChirho = (formDataChirho.get('emailChirho') as string) || null;
		const nameChirho = (formDataChirho.get('nameChirho') as string) || null;
		const categoryChirho = formDataChirho.get('categoryChirho') as
			| 'translation_error'
			| 'bug_report'
			| 'feature_request'
			| 'general'
			| 'sword_module';
		const subjectChirho = formDataChirho.get('subjectChirho') as string;
		const messageChirho = formDataChirho.get('messageChirho') as string;
		const referenceChirho = (formDataChirho.get('referenceChirho') as string) || null;

		if (!subjectChirho || !messageChirho) {
			return failChirho(400, {
				errorChirho: 'Subject and message are required',
				emailChirho,
				nameChirho,
				subjectChirho,
				messageChirho,
				referenceChirho
			});
		}

		try {
			await dbChirho.insert(feedbackTableChirho).values({
				emailChirho,
				nameChirho,
				categoryChirho: categoryChirho || 'general',
				subjectChirho,
				messageChirho,
				referenceChirho
			});

			return {
				successChirho: true,
				messageChirho: 'Thank you for your feedback! We will review it shortly.'
			};
		} catch (errorChirho) {
			console.error('Failed to save feedback:', errorChirho);
			return failChirho(500, {
				errorChirho: 'Failed to submit feedback. Please try again later.',
				emailChirho,
				nameChirho,
				subjectChirho,
				messageChirho,
				referenceChirho
			});
		}
	}
};
