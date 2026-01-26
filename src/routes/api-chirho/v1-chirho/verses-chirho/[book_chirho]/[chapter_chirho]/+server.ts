// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { validateApiKeyChirho, jsonResponseChirho, errorResponseChirho } from '$lib/server/api-auth-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

interface WordRowChirho {
	verse_number_chirho: number;
	word_id_chirho: string;
	text_chirho: string;
	lemma_id_chirho: string;
	grammar_chirho: string;
}

/**
 * GET /api-chirho/v1-chirho/verses-chirho/:book/:chapter
 * Returns all words for a chapter with lemma and grammar info
 *
 * Query params:
 *   - book_chirho: Book name (e.g., "Genesis", "John") or book ID
 *   - chapter_chirho: Chapter number
 */
export const GET: RequestHandlerChirho = async (eventChirho) => {
	validateApiKeyChirho(eventChirho);

	const bookParamChirho = eventChirho.params.book_chirho;
	const chapterParamChirho = eventChirho.params.chapter_chirho;

	const chapterNumChirho = parseInt(chapterParamChirho, 10);
	if (isNaN(chapterNumChirho) || chapterNumChirho < 1) {
		return errorResponseChirho('Invalid chapter number', 400);
	}

	// Try to find book by name or ID
	const bookIdChirho = parseInt(bookParamChirho, 10);
	const bookWhereChirho = isNaN(bookIdChirho)
		? `LOWER(b.name) = LOWER($1)`
		: `b.id = $1`;

	const wordsChirho = await queryRawChirho<WordRowChirho>(
		`
		SELECT
			v.number as verse_number_chirho,
			w.id as word_id_chirho,
			w.text as text_chirho,
			w.lemma_id as lemma_id_chirho,
			w.grammar as grammar_chirho
		FROM word w
		JOIN verse v ON w.verse_id = v.id
		JOIN book b ON v.book_id = b.id
		WHERE ${bookWhereChirho}
		  AND v.chapter = $2
		ORDER BY v.number, w.id
		`,
		[isNaN(bookIdChirho) ? bookParamChirho : bookIdChirho, chapterNumChirho]
	);

	if (wordsChirho.length === 0) {
		return errorResponseChirho('Chapter not found', 404);
	}

	// Group by verse
	const versesChirho: Record<number, typeof wordsChirho> = {};
	for (const wordChirho of wordsChirho) {
		const vNumChirho = wordChirho.verse_number_chirho;
		if (!versesChirho[vNumChirho]) {
			versesChirho[vNumChirho] = [];
		}
		versesChirho[vNumChirho].push(wordChirho);
	}

	return jsonResponseChirho({
		book_chirho: bookParamChirho,
		chapter_chirho: chapterNumChirho,
		verses_chirho: Object.entries(versesChirho).map(([verseNumChirho, wordsArrChirho]) => ({
			verse_chirho: parseInt(verseNumChirho, 10),
			words_chirho: wordsArrChirho.map((wChirho) => ({
				id_chirho: wChirho.word_id_chirho,
				text_chirho: wChirho.text_chirho,
				lemma_id_chirho: wChirho.lemma_id_chirho,
				grammar_chirho: wChirho.grammar_chirho
			}))
		}))
	});
};
