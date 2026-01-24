// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho, Actions as ActionsChirho } from './$types';
import { queryRawChirho } from '$lib/server/db-chirho';
import { error as errorChirho, redirect as redirectChirho, fail as failChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';

interface FeedbackRowChirho {
	idChirho: number;
	userIdChirho: string | null;
	userNameChirho: string | null;
	userEmailChirho: string | null;
	emailChirho: string | null;
	categoryChirho: string;
	messageChirho: string;
	pageUrlChirho: string | null;
	statusChirho: string;
	aiSentimentChirho: string | null;
	adminReplyChirho: string | null;
	createdAtChirho: string;
	updatedAtChirho: string;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	// Check authentication
	const sessionChirho = localsChirho.sessionChirho;
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check admin role
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	if (!isAdminChirho) {
		throw errorChirho(403, 'Access denied. Admin privileges required.');
	}

	// Check if feedback table exists, create if not
	try {
		await queryRawChirho(
			`
			CREATE TABLE IF NOT EXISTS feedback_chirho (
				id_chirho SERIAL PRIMARY KEY,
				user_id_chirho UUID REFERENCES users(id),
				email_chirho TEXT,
				category_chirho TEXT NOT NULL,
				message_chirho TEXT NOT NULL,
				page_url_chirho TEXT,
				status_chirho TEXT DEFAULT 'new',
				ai_sentiment_chirho TEXT,
				admin_reply_chirho TEXT,
				created_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
				updated_at_chirho TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			)
		`,
			[]
		);
	} catch {
		// Table might already exist, ignore
	}

	// Get all feedback with optional user info
	const feedbackChirho = await queryRawChirho<FeedbackRowChirho>(
		`
		SELECT
			f.id_chirho AS "idChirho",
			f.user_id_chirho AS "userIdChirho",
			u.name AS "userNameChirho",
			u.email AS "userEmailChirho",
			f.email_chirho AS "emailChirho",
			f.category_chirho AS "categoryChirho",
			f.message_chirho AS "messageChirho",
			f.page_url_chirho AS "pageUrlChirho",
			f.status_chirho AS "statusChirho",
			f.ai_sentiment_chirho AS "aiSentimentChirho",
			f.admin_reply_chirho AS "adminReplyChirho",
			f.created_at_chirho AS "createdAtChirho",
			f.updated_at_chirho AS "updatedAtChirho"
		FROM feedback_chirho AS f
		LEFT JOIN users AS u ON u.id = f.user_id_chirho
		ORDER BY f.created_at_chirho DESC
		LIMIT 200
		`
	);

	// Get summary stats
	const statsChirho = await queryRawChirho<{
		totalChirho: number;
		newChirho: number;
		reviewedChirho: number;
		resolvedChirho: number;
		bugsChirho: number;
		suggestionsChirho: number;
		praiseChirho: number;
	}>(
		`
		SELECT
			COUNT(*)::int AS "totalChirho",
			COUNT(CASE WHEN status_chirho = 'new' THEN 1 END)::int AS "newChirho",
			COUNT(CASE WHEN status_chirho = 'reviewed' THEN 1 END)::int AS "reviewedChirho",
			COUNT(CASE WHEN status_chirho = 'resolved' THEN 1 END)::int AS "resolvedChirho",
			COUNT(CASE WHEN category_chirho = 'bug' THEN 1 END)::int AS "bugsChirho",
			COUNT(CASE WHEN category_chirho = 'suggestion' THEN 1 END)::int AS "suggestionsChirho",
			COUNT(CASE WHEN category_chirho = 'praise' THEN 1 END)::int AS "praiseChirho"
		FROM feedback_chirho
		`
	);

	return {
		feedbackChirho,
		statsChirho: statsChirho[0] ?? {
			totalChirho: 0,
			newChirho: 0,
			reviewedChirho: 0,
			resolvedChirho: 0,
			bugsChirho: 0,
			suggestionsChirho: 0,
			praiseChirho: 0
		}
	};
};

export const actions: ActionsChirho = {
	updateStatusChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			throw redirectChirho(302, '/login-chirho');
		}

		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			throw errorChirho(403, 'Access denied');
		}

		const formDataChirho = await requestChirho.formData();
		const feedbackIdChirho = formDataChirho.get('feedbackIdChirho') as string;
		const statusChirho = formDataChirho.get('statusChirho') as string;

		if (!feedbackIdChirho || !statusChirho) {
			return failChirho(400, { errorChirho: 'Missing required fields' });
		}

		if (!['new', 'reviewed', 'resolved'].includes(statusChirho)) {
			return failChirho(400, { errorChirho: 'Invalid status' });
		}

		await queryRawChirho(
			`UPDATE feedback_chirho SET status_chirho = $1, updated_at_chirho = NOW() WHERE id_chirho = $2`,
			[statusChirho, feedbackIdChirho]
		);

		return { successChirho: true };
	},

	addReplyChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			throw redirectChirho(302, '/login-chirho');
		}

		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			throw errorChirho(403, 'Access denied');
		}

		const formDataChirho = await requestChirho.formData();
		const feedbackIdChirho = formDataChirho.get('feedbackIdChirho') as string;
		const replyChirho = formDataChirho.get('replyChirho') as string;

		if (!feedbackIdChirho || !replyChirho?.trim()) {
			return failChirho(400, { errorChirho: 'Missing required fields' });
		}

		await queryRawChirho(
			`UPDATE feedback_chirho SET admin_reply_chirho = $1, status_chirho = 'reviewed', updated_at_chirho = NOW() WHERE id_chirho = $2`,
			[replyChirho.trim(), feedbackIdChirho]
		);

		return { successChirho: true };
	},

	deleteChirho: async ({ request: requestChirho, locals: localsChirho }) => {
		const sessionChirho = localsChirho.sessionChirho;
		if (!sessionChirho?.userIdChirho) {
			throw redirectChirho(302, '/login-chirho');
		}

		const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
		if (!isAdminChirho) {
			throw errorChirho(403, 'Access denied');
		}

		const formDataChirho = await requestChirho.formData();
		const feedbackIdChirho = formDataChirho.get('feedbackIdChirho') as string;

		if (!feedbackIdChirho) {
			return failChirho(400, { errorChirho: 'Missing feedback ID' });
		}

		await queryRawChirho(`DELETE FROM feedback_chirho WHERE id_chirho = $1`, [feedbackIdChirho]);

		return { successChirho: true };
	}
};
