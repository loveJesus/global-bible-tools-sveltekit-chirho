// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { validateApiKeyChirho, jsonResponseChirho } from '$lib/server/api-auth-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

interface BookRowChirho {
	id_chirho: number;
	name_chirho: string;
	verse_count_chirho: number;
	chapter_count_chirho: number;
}

/**
 * GET /api-chirho/v1-chirho/books-chirho
 * Returns list of all Bible books with verse counts
 */
export const GET: RequestHandlerChirho = async (eventChirho) => {
	validateApiKeyChirho(eventChirho);

	const booksChirho = await queryRawChirho<BookRowChirho>(`
		SELECT
			b.id as id_chirho,
			b.name as name_chirho,
			COUNT(DISTINCT v.id) as verse_count_chirho,
			MAX(v.chapter) as chapter_count_chirho
		FROM book b
		LEFT JOIN verse v ON v.book_id = b.id
		GROUP BY b.id, b.name
		ORDER BY b.id
	`);

	return jsonResponseChirho({
		books_chirho: booksChirho.map((bChirho) => ({
			id_chirho: bChirho.id_chirho,
			name_chirho: bChirho.name_chirho,
			verse_count_chirho: Number(bChirho.verse_count_chirho),
			chapter_count_chirho: Number(bChirho.chapter_count_chirho)
		}))
	});
};
