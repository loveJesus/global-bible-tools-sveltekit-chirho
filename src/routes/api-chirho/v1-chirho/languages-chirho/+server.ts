// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { validateApiKeyChirho, jsonResponseChirho } from '$lib/server/api-auth-chirho';
import { queryRawChirho } from '$lib/server/db-chirho';

interface LanguageRowChirho {
	id_chirho: string;
	code_chirho: string;
	name_chirho: string;
	font_chirho: string | null;
	text_direction_chirho: string;
	gloss_count_chirho: number;
}

/**
 * GET /api-chirho/v1-chirho/languages-chirho
 * Returns list of available languages with translation coverage
 */
export const GET: RequestHandlerChirho = async (eventChirho) => {
	validateApiKeyChirho(eventChirho);

	const languagesChirho = await queryRawChirho<LanguageRowChirho>(`
		SELECT
			l.id as id_chirho,
			l.code as code_chirho,
			l.name as name_chirho,
			l.font as font_chirho,
			l.text_direction as text_direction_chirho,
			COUNT(DISTINCT g.phrase_id) as gloss_count_chirho
		FROM language l
		LEFT JOIN phrase p ON p.language_id = l.id AND p.deleted_at IS NULL
		LEFT JOIN gloss g ON g.phrase_id = p.id
		GROUP BY l.id, l.code, l.name, l.font, l.text_direction
		ORDER BY l.name
	`);

	return jsonResponseChirho({
		languages_chirho: languagesChirho.map((langChirho) => ({
			id_chirho: langChirho.id_chirho,
			code_chirho: langChirho.code_chirho,
			name_chirho: langChirho.name_chirho,
			font_chirho: langChirho.font_chirho,
			text_direction_chirho: langChirho.text_direction_chirho,
			gloss_count_chirho: Number(langChirho.gloss_count_chirho)
		}))
	});
};
