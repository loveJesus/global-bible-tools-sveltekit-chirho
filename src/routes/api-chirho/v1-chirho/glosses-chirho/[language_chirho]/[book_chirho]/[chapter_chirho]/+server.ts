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

// Map common book names to IDs
const BOOK_NAME_MAP_CHIRHO: Record<string, number> = {
	genesis: 1, gen: 1, gn: 1,
	exodus: 2, exo: 2, ex: 2,
	leviticus: 3, lev: 3, lv: 3,
	numbers: 4, num: 4, nm: 4,
	deuteronomy: 5, deu: 5, dt: 5, deut: 5,
	joshua: 6, jos: 6, josh: 6,
	judges: 7, jdg: 7, judg: 7,
	ruth: 8, rut: 8, ru: 8,
	'1samuel': 9, '1sam': 9, '1sm': 9,
	'2samuel': 10, '2sam': 10, '2sm': 10,
	'1kings': 11, '1kgs': 11, '1ki': 11,
	'2kings': 12, '2kgs': 12, '2ki': 12,
	'1chronicles': 13, '1chr': 13, '1ch': 13,
	'2chronicles': 14, '2chr': 14, '2ch': 14,
	ezra: 15, ezr: 15,
	nehemiah: 16, neh: 16, ne: 16,
	esther: 17, est: 17, esth: 17,
	job: 18, jb: 18,
	psalms: 19, psa: 19, ps: 19, psalm: 19,
	proverbs: 20, pro: 20, prov: 20, pr: 20,
	ecclesiastes: 21, ecc: 21, eccl: 21, ec: 21,
	songofsolomon: 22, sos: 22, song: 22, sng: 22,
	isaiah: 23, isa: 23, is: 23,
	jeremiah: 24, jer: 24, je: 24,
	lamentations: 25, lam: 25, la: 25,
	ezekiel: 26, eze: 26, ezek: 26,
	daniel: 27, dan: 27, da: 27,
	hosea: 28, hos: 28, ho: 28,
	joel: 29, jol: 29, jl: 29,
	amos: 30, amo: 30, am: 30,
	obadiah: 31, oba: 31, ob: 31,
	jonah: 32, jon: 32, jnh: 32,
	micah: 33, mic: 33, mi: 33,
	nahum: 34, nah: 34, na: 34,
	habakkuk: 35, hab: 35, hb: 35,
	zephaniah: 36, zep: 36, zph: 36,
	haggai: 37, hag: 37, hg: 37,
	zechariah: 38, zec: 38, zech: 38,
	malachi: 39, mal: 39, ml: 39,
	matthew: 40, mat: 40, matt: 40, mt: 40,
	mark: 41, mrk: 41, mk: 41, mar: 41,
	luke: 42, luk: 42, lk: 42,
	john: 43, jhn: 43, jn: 43,
	acts: 44, act: 44, ac: 44,
	romans: 45, rom: 45, ro: 45,
	'1corinthians': 46, '1cor': 46, '1co': 46,
	'2corinthians': 47, '2cor': 47, '2co': 47,
	galatians: 48, gal: 48, ga: 48,
	ephesians: 49, eph: 49,
	philippians: 50, php: 50, phil: 50,
	colossians: 51, col: 51,
	'1thessalonians': 52, '1thess': 52, '1th': 52,
	'2thessalonians': 53, '2thess': 53, '2th': 53,
	'1timothy': 54, '1tim': 54, '1ti': 54,
	'2timothy': 55, '2tim': 55, '2ti': 55,
	titus: 56, tit: 56, ti: 56,
	philemon: 57, phm: 57, phlm: 57,
	hebrews: 58, heb: 58,
	james: 59, jas: 59, jam: 59, jm: 59,
	'1peter': 60, '1pet': 60, '1pe': 60, '1pt': 60,
	'2peter': 61, '2pet': 61, '2pe': 61, '2pt': 61,
	'1john': 62, '1jn': 62, '1jo': 62,
	'2john': 63, '2jn': 63, '2jo': 63,
	'3john': 64, '3jn': 64, '3jo': 64,
	jude: 65, jud: 65, jd: 65,
	revelation: 66, rev: 66, re: 66, apocalypse: 66
};

function resolveBookIdChirho(bookParamChirho: string): number | null {
	const numericIdChirho = parseInt(bookParamChirho, 10);
	if (!isNaN(numericIdChirho) && numericIdChirho >= 1 && numericIdChirho <= 66) {
		return numericIdChirho;
	}
	const normalizedChirho = bookParamChirho.toLowerCase().replace(/\s+/g, '');
	return BOOK_NAME_MAP_CHIRHO[normalizedChirho] ?? null;
}

// Languages where en-dash parts should be joined (no separator) rather than spaced
const JOIN_ENDASH_LANGUAGES_CHIRHO = new Set(['heb', 'arb']);

/**
 * Format a gloss by handling en-dashes based on language and format preference.
 * - format=undefined (default): return as-is (backward compatible)
 * - format=plain: replace en-dashes with space (most languages) or join (Hebrew, Arabic)
 */
function formatGlossChirho(glossChirho: string | null, formatChirho: string | null, langCodeChirho: string): string | null {
	if (!glossChirho || formatChirho !== 'plain') return glossChirho;
	if (JOIN_ENDASH_LANGUAGES_CHIRHO.has(langCodeChirho)) {
		return glossChirho.replace(/\u2013/g, '');
	}
	return glossChirho.replace(/\u2013/g, ' ');
}

/**
 * GET /api-chirho/v1-chirho/glosses-chirho/:language/:book/:chapter
 * Returns words with their glosses (translations) for a specific language
 *
 * Params:
 *   - language_chirho: Language code (e.g., "spa", "hin", "ben")
 *   - book_chirho: Book name (e.g., "Genesis", "John", "Jhn", "43") or book ID
 *   - chapter_chirho: Chapter number
 *
 * Query params:
 *   - type: "terse" (default) or "readers" — translation style
 *   - format: "plain" — strip en-dashes (joined for Hebrew/Arabic, spaced for others)
 */
export const GET: RequestHandlerChirho = async (eventChirho) => {
	validateApiKeyChirho(eventChirho);

	const langCodeChirho = eventChirho.params.language_chirho;
	const bookParamChirho = eventChirho.params.book_chirho;
	const chapterParamChirho = eventChirho.params.chapter_chirho;
	const typeParamChirho = eventChirho.url.searchParams.get('type');
	const translationTypeChirho: string | null = typeParamChirho === 'readers' ? 'readers' : null;
	const formatParamChirho = eventChirho.url.searchParams.get('format');

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

	// Resolve book to ID
	const resolvedBookIdChirho = resolveBookIdChirho(bookParamChirho);
	if (resolvedBookIdChirho === null) {
		return errorResponseChirho(`Book '${bookParamChirho}' not found`, 404);
	}

	const glossesChirho = await queryRawChirho<GlossRowChirho>(
		`
		SELECT
			v.number as verse_number_chirho,
			w.id as word_id_chirho,
			w.text as source_text_chirho,
			lf.lemma_id as lemma_id_chirho,
			gl.gloss as gloss_chirho,
			gl.state as state_chirho
		FROM word w
		JOIN verse v ON w.verse_id = v.id
		JOIN book b ON v.book_id = b.id
		LEFT JOIN lemma_form lf ON w.form_id = lf.id
		LEFT JOIN LATERAL (
			SELECT g.gloss, g.state
			FROM phrase_word pw
			JOIN phrase p ON p.id = pw.phrase_id
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE pw.word_id = w.id
				AND p.language_id = (SELECT id FROM language WHERE code = $3)
				AND p.deleted_at IS NULL
				AND p.translation_type_chirho IS NOT DISTINCT FROM $4
			LIMIT 1
		) gl ON true
		WHERE b.id = $1
		  AND v.chapter = $2
		ORDER BY v.number, w.id
		`,
		[resolvedBookIdChirho, chapterNumChirho, langCodeChirho, translationTypeChirho]
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
		translation_type_chirho: translationTypeChirho ?? 'terse',
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
				gloss_chirho: formatGlossChirho(rChirho.gloss_chirho, formatParamChirho, langCodeChirho),
				state_chirho: rChirho.state_chirho
			}))
		}))
	});
};
