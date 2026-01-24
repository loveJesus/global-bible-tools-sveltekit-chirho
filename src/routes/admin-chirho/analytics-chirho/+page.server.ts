// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import { error as errorChirho, redirect as redirectChirho } from '@sveltejs/kit';
import { isUserAdminChirho } from '$lib/server/auth-helpers-chirho';
import {
	dbChirho,
	queryRawChirho,
	countChirho,
	countDistinctChirho,
	eqChirho,
	andChirho,
	isNullChirho,
	gteChirho,
	descChirho,
	sqlChirho
} from '$lib/server/db-chirho';
import {
	languageTableChirho,
	userTableChirho,
	glossTableChirho,
	machineGlossTableChirho,
	phraseTableChirho,
	phraseWordTableChirho,
	languageMemberTableChirho
} from '$lib/server/schema-chirho';

interface LanguageProgressChirho {
	codeChirho: string;
	nameChirho: string;
	wordCountChirho: number;
	approvedCountChirho: number;
	pendingCountChirho: number;
	memberCountChirho: number;
}

interface RecentActivityChirho {
	dateChirho: string;
	languageCodeChirho: string;
	languageNameChirho: string;
	glossCountChirho: number;
	approvedCountChirho: number;
}

interface BookProgressChirho {
	bookIdChirho: number;
	bookNameChirho: string;
	languageCodeChirho: string;
	totalWordsChirho: number;
	approvedCountChirho: number;
}

export const load: PageServerLoadChirho = async ({ locals: localsChirho }) => {
	const sessionChirho = localsChirho.sessionChirho;

	// Check authentication
	if (!sessionChirho?.userIdChirho) {
		throw redirectChirho(302, '/login-chirho');
	}

	// Check admin role
	const isAdminChirho = await isUserAdminChirho(sessionChirho.userIdChirho);
	if (!isAdminChirho) {
		throw errorChirho(403, 'Access denied. Admin privileges required.');
	}

	// Get overview stats using Drizzle queries (parallel execution)
	const [
		totalLanguagesResultChirho,
		totalUsersResultChirho,
		totalGlossesResultChirho,
		approvedGlossesResultChirho,
		machineGlossesResultChirho
	] = await Promise.all([
		dbChirho.select({ countChirho: countChirho() }).from(languageTableChirho),
		dbChirho
			.select({ countChirho: countChirho() })
			.from(userTableChirho)
			.where(eqChirho(userTableChirho.statusChirho, 'active')),
		dbChirho.select({ countChirho: countChirho() }).from(glossTableChirho),
		dbChirho
			.select({ countChirho: countChirho() })
			.from(glossTableChirho)
			.where(eqChirho(glossTableChirho.stateChirho, 'APPROVED')),
		dbChirho.select({ countChirho: countChirho() }).from(machineGlossTableChirho)
	]);

	const overviewStatsChirho = {
		totalLanguagesChirho: Number(totalLanguagesResultChirho[0]?.countChirho ?? 0),
		totalUsersChirho: Number(totalUsersResultChirho[0]?.countChirho ?? 0),
		totalGlossesChirho: Number(totalGlossesResultChirho[0]?.countChirho ?? 0),
		approvedGlossesChirho: Number(approvedGlossesResultChirho[0]?.countChirho ?? 0),
		machineGlossesChirho: Number(machineGlossesResultChirho[0]?.countChirho ?? 0)
	};

	// Get language progress using LATERAL joins for performance
	// NOTE: LATERAL joins are PostgreSQL-specific and optimize this query significantly.
	// Converting to pure Drizzle would require N+1 queries or complex subqueries.
	const languageProgressChirho = await queryRawChirho<LanguageProgressChirho>(
		`
		SELECT
			l.code AS "codeChirho",
			l.name AS "nameChirho",
			COALESCE(word_stats.word_count, 0)::int AS "wordCountChirho",
			COALESCE(word_stats.approved_count, 0)::int AS "approvedCountChirho",
			COALESCE(word_stats.pending_count, 0)::int AS "pendingCountChirho",
			COALESCE(member_stats.member_count, 0)::int AS "memberCountChirho"
		FROM language l
		LEFT JOIN LATERAL (
			SELECT
				COUNT(DISTINCT pw.word_id)::int AS word_count,
				COUNT(DISTINCT CASE WHEN g.state = 'APPROVED' THEN pw.word_id END)::int AS approved_count,
				COUNT(DISTINCT CASE WHEN g.state != 'APPROVED' OR g.state IS NULL THEN pw.word_id END)::int AS pending_count
			FROM phrase p
			JOIN phrase_word pw ON pw.phrase_id = p.id
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE p.language_id = l.id AND p.deleted_at IS NULL
		) AS word_stats ON true
		LEFT JOIN LATERAL (
			SELECT COUNT(DISTINCT user_id)::int AS member_count
			FROM language_member
			WHERE language_id = l.id
		) AS member_stats ON true
		ORDER BY l.name
		`
	);

	// Get recent activity (last 7 days by language) using Drizzle
	const sevenDaysAgoChirho = new Date();
	sevenDaysAgoChirho.setDate(sevenDaysAgoChirho.getDate() - 7);

	const recentActivityRawChirho = await dbChirho
		.select({
			dateChirho: sqlChirho<string>`DATE(${glossTableChirho.updatedAtChirho})::text`,
			languageCodeChirho: languageTableChirho.codeChirho,
			languageNameChirho: languageTableChirho.nameChirho,
			glossCountChirho: countChirho(),
			approvedCountChirho: countChirho(
				sqlChirho`CASE WHEN ${glossTableChirho.stateChirho} = 'APPROVED' THEN 1 END`
			)
		})
		.from(glossTableChirho)
		.innerJoin(phraseTableChirho, eqChirho(phraseTableChirho.idChirho, glossTableChirho.phraseIdChirho))
		.innerJoin(languageTableChirho, eqChirho(languageTableChirho.idChirho, phraseTableChirho.languageIdChirho))
		.where(
			andChirho(
				gteChirho(glossTableChirho.updatedAtChirho, sevenDaysAgoChirho),
				isNullChirho(phraseTableChirho.deletedAtChirho)
			)
		)
		.groupBy(
			sqlChirho`DATE(${glossTableChirho.updatedAtChirho})`,
			languageTableChirho.codeChirho,
			languageTableChirho.nameChirho
		)
		.orderBy(
			descChirho(sqlChirho`DATE(${glossTableChirho.updatedAtChirho})`),
			languageTableChirho.nameChirho
		)
		.limit(50);

	const recentActivityChirho: RecentActivityChirho[] = recentActivityRawChirho.map((rowChirho) => ({
		dateChirho: rowChirho.dateChirho,
		languageCodeChirho: rowChirho.languageCodeChirho,
		languageNameChirho: rowChirho.languageNameChirho,
		glossCountChirho: Number(rowChirho.glossCountChirho),
		approvedCountChirho: Number(rowChirho.approvedCountChirho)
	}));

	// Get top 5 languages by approved word count using Drizzle subquery
	const topLanguagesResultChirho = await dbChirho
		.select({
			codeChirho: languageTableChirho.codeChirho,
			approvedCountChirho: countDistinctChirho(phraseWordTableChirho.wordIdChirho)
		})
		.from(languageTableChirho)
		.leftJoin(
			phraseTableChirho,
			andChirho(
				eqChirho(phraseTableChirho.languageIdChirho, languageTableChirho.idChirho),
				isNullChirho(phraseTableChirho.deletedAtChirho)
			)
		)
		.leftJoin(phraseWordTableChirho, eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho))
		.leftJoin(
			glossTableChirho,
			andChirho(
				eqChirho(glossTableChirho.phraseIdChirho, phraseTableChirho.idChirho),
				eqChirho(glossTableChirho.stateChirho, 'APPROVED')
			)
		)
		.groupBy(languageTableChirho.codeChirho)
		.orderBy(descChirho(countDistinctChirho(phraseWordTableChirho.wordIdChirho)))
		.limit(5);

	const topLanguagesChirho = topLanguagesResultChirho.map((lChirho) => lChirho.codeChirho);

	// Get book progress for top languages
	// NOTE: LATERAL joins with CROSS JOIN are optimal here to avoid 66 * N separate queries.
	// This query benefits from PostgreSQL's query planner optimizations.
	let bookProgressChirho: BookProgressChirho[] = [];
	if (topLanguagesChirho.length > 0) {
		bookProgressChirho = await queryRawChirho<BookProgressChirho>(
			`
			SELECT
				b.id::int AS "bookIdChirho",
				b.name AS "bookNameChirho",
				l.code AS "languageCodeChirho",
				COALESCE(word_counts.total, 0)::int AS "totalWordsChirho",
				COALESCE(approved_counts.approved, 0)::int AS "approvedCountChirho"
			FROM book b
			CROSS JOIN language l
			LEFT JOIN LATERAL (
				SELECT COUNT(*)::int AS total
				FROM word w
				JOIN verse v ON v.id = w.verse_id
				WHERE v.book_id = b.id
			) AS word_counts ON true
			LEFT JOIN LATERAL (
				SELECT COUNT(DISTINCT pw.word_id)::int AS approved
				FROM phrase p
				JOIN phrase_word pw ON pw.phrase_id = p.id
				JOIN gloss g ON g.phrase_id = p.id AND g.state = 'APPROVED'
				JOIN word w ON w.id = pw.word_id
				JOIN verse v ON v.id = w.verse_id
				WHERE p.language_id = l.id
					AND p.deleted_at IS NULL
					AND v.book_id = b.id
			) AS approved_counts ON true
			WHERE l.code = ANY($1)
			ORDER BY b.id, l.code
			`,
			[topLanguagesChirho]
		);
	}

	return {
		overviewStatsChirho,
		languageProgressChirho,
		recentActivityChirho,
		bookProgressChirho,
		topLanguagesChirho
	};
};
