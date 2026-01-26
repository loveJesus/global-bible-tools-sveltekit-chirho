// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { validateApiKeyChirho, jsonResponseChirho, errorResponseChirho } from '$lib/server/api-auth-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

interface GlossRowChirho {
	verse_number_chirho: number;
	word_id_chirho: string;
	source_text_chirho: string;
	lemma_id_chirho: string;
	gloss_chirho: string | null;
	state_chirho: string | null;
}

/**
 * GET /api-chirho/v1-chirho/glosses-chirho/:language/:book/:chapter
 * Returns words with their glosses (translations) for a specific language
 *
 * Params:
 *   - language_chirho: Language code (e.g., "spa", "hin", "ben")
 *   - book_chirho: Book name or ID
 *   - chapter_chirho: Chapter number
 */
export const GET: RequestHandlerChirho = async (eventChirho) => {
	validateApiKeyChirho(eventChirho);

	const langCodeChirho = eventChirho.params.language_chirho;
	const bookParamChirho = eventChirho.params.book_chirho;
	const chapterParamChirho = eventChirho.params.chapter_chirho;

	const chapterNumChirho = parseInt(chapterParamChirho, 10);
	if (isNaN(chapterNumChirho) || chapterNumChirho < 1) {
		return errorResponseChirho('Invalid chapter number', 400);
	}

	// Validate language exists
	const langCheckChirho = await queryRawChirho<{ id_chirho: string }>(
		`SELECT id as id_chirho FROM language WHERE code = $1`,
		[langCodeChirho]
	);

	if (langCheckChirho.length === 0) {
		return errorResponseChirho(`Language '${langCodeChirho}' not found`, 404);
	}

	const bookIdChirho = parseInt(bookParamChirho, 10);
	const bookWhereChirho = isNaN(bookIdChirho)
		? `LOWER(b.name) = LOWER($1)`
		: `b.id = $1`;

	const glossesChirho = await queryRawChirho<GlossRowChirho>(
		`
		SELECT
			v.number as verse_number_chirho,
			w.id as word_id_chirho,
			w.text as source_text_chirho,
			w.lemma_id as lemma_id_chirho,
			g.gloss as gloss_chirho,
			g.state as state_chirho
		FROM word w
		JOIN verse v ON w.verse_id = v.id
		JOIN book b ON v.book_id = b.id
		LEFT JOIN phrase_word pw ON pw.word_id = w.id
		LEFT JOIN phrase p ON pw.phrase_id = p.id
			AND p.language_id = (SELECT id FROM language WHERE code = $3)
			AND p.deleted_at IS NULL
		LEFT JOIN gloss g ON g.phrase_id = p.id
		WHERE ${bookWhereChirho}
		  AND v.chapter = $2
		ORDER BY v.number, w.id
		`,
		[isNaN(bookIdChirho) ? bookParamChirho : bookIdChirho, chapterNumChirho, langCodeChirho]
	);

	if (glossesChirho.length === 0) {
		return errorResponseChirho('Chapter not found', 404);
	}

	// Group by verse
	const versesChirho: Record<number, typeof glossesChirho> = {};
	for (const rowChirho of glossesChirho) {
		const vNumChirho = rowChirho.verse_number_chirho;
		if (!versesChirho[vNumChirho]) {
			versesChirho[vNumChirho] = [];
		}
		versesChirho[vNumChirho].push(rowChirho);
	}

	// Calculate coverage stats
	let totalWordsChirho = 0;
	let glossedWordsChirho = 0;
	for (const rowChirho of glossesChirho) {
		totalWordsChirho++;
		if (rowChirho.gloss_chirho) glossedWordsChirho++;
	}

	return jsonResponseChirho({
		language_chirho: langCodeChirho,
		book_chirho: bookParamChirho,
		chapter_chirho: chapterNumChirho,
		coverage_chirho: {
			total_words_chirho: totalWordsChirho,
			glossed_words_chirho: glossedWordsChirho,
			percentage_chirho: totalWordsChirho > 0 ? Math.round((glossedWordsChirho / totalWordsChirho) * 100) : 0
		},
		verses_chirho: Object.entries(versesChirho).map(([verseNumChirho, rowsChirho]) => ({
			verse_chirho: parseInt(verseNumChirho, 10),
			words_chirho: rowsChirho.map((rChirho) => ({
				id_chirho: rChirho.word_id_chirho,
				source_chirho: rChirho.source_text_chirho,
				lemma_id_chirho: rChirho.lemma_id_chirho,
				gloss_chirho: rChirho.gloss_chirho,
				state_chirho: rChirho.state_chirho
			}))
		}))
	});
};
