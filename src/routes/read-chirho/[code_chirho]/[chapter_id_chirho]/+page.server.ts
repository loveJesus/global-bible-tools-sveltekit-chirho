// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { PageServerLoad as PageServerLoadChirho } from './$types';
import {
	dbChirho,
	eqChirho,
	andChirho,
	likeChirho,
	maxChirho,
	isNullChirho,
	queryRawChirho
} from '$lib/server/db-chirho';
import {
	languageTableChirho,
	bookTableChirho,
	verseTableChirho,
	wordTableChirho,
	lemmaFormTableChirho,
	phraseTableChirho,
	phraseWordTableChirho,
	referenceVersionTableChirho,
	referenceVerseTableChirho
} from '$lib/server/schema-chirho';
import { error as errorChirho } from '@sveltejs/kit';
import { parseChapterIdChirho } from '$lib/modules-chirho/bible-core-chirho/queries-chirho';

// NOTE: The words-with-glosses query uses raw SQL with LATERAL join for performance.
// This is a PostgreSQL-specific optimization that avoids duplicates when a word has
// phrases in multiple languages. Simpler queries have been converted to Drizzle.

interface WordWithGlossRowChirho {
	wordId: string;
	text: string;
	lemmaId: string | null;
	grammar: string | null;
	gloss: string | null;
	state: string | null;
	source: string | null;
}

export const load: PageServerLoadChirho = async ({ params: paramsChirho, url: urlChirho }) => {
	const codeChirho = paramsChirho.code_chirho;
	const chapterIdChirho = paramsChirho.chapter_id_chirho;
	const refVersionParamChirho = urlChirho.searchParams.get('ref');

	// Parse chapter ID
	const { bookIdChirho, chapterChirho } = parseChapterIdChirho(chapterIdChirho);

	// Get language
	const languageResultChirho = await dbChirho
		.select()
		.from(languageTableChirho)
		.where(eqChirho(languageTableChirho.codeChirho, codeChirho))
		.limit(1);

	const languageChirho = languageResultChirho[0];
	if (!languageChirho) {
		throw errorChirho(404, `Language '${codeChirho}' not found`);
	}

	// Get book
	const bookResultChirho = await dbChirho
		.select()
		.from(bookTableChirho)
		.where(eqChirho(bookTableChirho.idChirho, bookIdChirho))
		.limit(1);

	const bookChirho = bookResultChirho[0];
	if (!bookChirho) {
		throw errorChirho(404, `Book not found`);
	}

	// Get verses for chapter
	const versesChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho)
			)
		)
		.orderBy(verseTableChirho.numberChirho);

	if (versesChirho.length === 0) {
		throw errorChirho(404, `Chapter not found`);
	}

	// Get words with glosses for each verse using raw SQL with lateral join
	// to avoid duplicates when a word has phrases in multiple languages
	const versesWithWordsChirho = await Promise.all(
		versesChirho.map(async (verseChirho) => {
			const wordsResultChirho = await queryRawChirho<WordWithGlossRowChirho>(
				`
				SELECT
					w.id AS "wordId",
					w.text,
					lf.lemma_id AS "lemmaId",
					lf.grammar,
					ph.gloss,
					ph.state,
					ph.source
				FROM word AS w
				LEFT JOIN lemma_form AS lf ON lf.id = w.form_id
				LEFT JOIN LATERAL (
					SELECT g.gloss, g.state, g.source
					FROM phrase_word AS pw
					JOIN phrase AS p ON p.id = pw.phrase_id
					LEFT JOIN gloss AS g ON g.phrase_id = p.id
					WHERE pw.word_id = w.id
						AND p.language_id = $2
						AND p.deleted_at IS NULL
					LIMIT 1
				) AS ph ON true
				WHERE w.verse_id = $1
				ORDER BY w.id
				`,
				[verseChirho.idChirho, languageChirho.idChirho]
			);

			return {
				verseIdChirho: verseChirho.idChirho,
				verseNumberChirho: verseChirho.numberChirho,
				wordsChirho: wordsResultChirho.map((rowChirho) => ({
					wordIdChirho: rowChirho.wordId,
					textChirho: rowChirho.text,
					lemmaIdChirho: rowChirho.lemmaId,
					grammarChirho: rowChirho.grammar,
					glossChirho: rowChirho.gloss,
					glossStateChirho: rowChirho.state,
					glossSourceChirho: rowChirho.source
				}))
			};
		})
	);

	// Calculate prev/next chapter IDs
	const prevChapterIdChirho = chapterChirho > 1
		? `${bookIdChirho.toString().padStart(2, '0')}${(chapterChirho - 1).toString().padStart(3, '0')}`
		: null;

	// Check if next chapter exists
	const nextChapterCheckChirho = await dbChirho
		.select()
		.from(verseTableChirho)
		.where(
			andChirho(
				eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
				eqChirho(verseTableChirho.chapterChirho, chapterChirho + 1)
			)
		)
		.limit(1);

	const nextChapterIdChirho = nextChapterCheckChirho.length > 0
		? `${bookIdChirho.toString().padStart(2, '0')}${(chapterChirho + 1).toString().padStart(3, '0')}`
		: null;

	// Get all books with their chapter counts for navigation (Drizzle typed query)
	const allBooksChirho = await dbChirho
		.select({
			idChirho: bookTableChirho.idChirho,
			nameChirho: bookTableChirho.nameChirho,
			maxChapterChirho: maxChirho(verseTableChirho.chapterChirho)
		})
		.from(bookTableChirho)
		.innerJoin(verseTableChirho, eqChirho(verseTableChirho.bookIdChirho, bookTableChirho.idChirho))
		.groupBy(bookTableChirho.idChirho, bookTableChirho.nameChirho)
		.orderBy(bookTableChirho.idChirho);

	// Generate chapter list for current book using maxChapter from query
	const currentBookInfoChirho = allBooksChirho.find((bChirho) => bChirho.idChirho === bookIdChirho);
	const maxChapterChirho = currentBookInfoChirho?.maxChapterChirho ?? 1;
	const chaptersInBookChirho = Array.from(
		{ length: maxChapterChirho },
		(_, iChirho) => iChirho + 1
	);

	// Get languages that have translations for current book (Drizzle typed query)
	const languagesWithTranslationsChirho = await dbChirho
		.selectDistinct({
			codeChirho: languageTableChirho.codeChirho,
			nameChirho: languageTableChirho.nameChirho
		})
		.from(languageTableChirho)
		.innerJoin(phraseTableChirho, eqChirho(phraseTableChirho.languageIdChirho, languageTableChirho.idChirho))
		.innerJoin(phraseWordTableChirho, eqChirho(phraseWordTableChirho.phraseIdChirho, phraseTableChirho.idChirho))
		.innerJoin(wordTableChirho, eqChirho(wordTableChirho.idChirho, phraseWordTableChirho.wordIdChirho))
		.innerJoin(verseTableChirho, eqChirho(verseTableChirho.idChirho, wordTableChirho.verseIdChirho))
		.where(andChirho(
			eqChirho(verseTableChirho.bookIdChirho, bookIdChirho),
			isNullChirho(phraseTableChirho.deletedAtChirho)
		))
		.orderBy(languageTableChirho.nameChirho);

	// Get all reference versions
	const referenceVersionsChirho = await dbChirho
		.select({
			idChirho: referenceVersionTableChirho.idChirho,
			codeChirho: referenceVersionTableChirho.codeChirho,
			nameChirho: referenceVersionTableChirho.nameChirho,
			languageCodeChirho: referenceVersionTableChirho.languageCodeChirho
		})
		.from(referenceVersionTableChirho)
		.orderBy(referenceVersionTableChirho.nameChirho);

	// Find the best reference version: URL param > language match > English fallback
	let preferredVersionIdChirho: number;
	if (refVersionParamChirho) {
		// User explicitly selected a reference version - use it
		preferredVersionIdChirho = parseInt(refVersionParamChirho, 10);
	} else {
		// Auto-select based on current translation language
		// First, try to find a reference Bible in the same language
		const matchingVersionChirho = referenceVersionsChirho.find(
			(vChirho) => vChirho.languageCodeChirho === codeChirho
		);
		if (matchingVersionChirho) {
			preferredVersionIdChirho = matchingVersionChirho.idChirho;
		} else {
			// Fall back to English KJV (id=1) or first available version
			const kjvChirho = referenceVersionsChirho.find((vChirho) => vChirho.codeChirho === 'KJV');
			preferredVersionIdChirho = kjvChirho?.idChirho ?? referenceVersionsChirho[0]?.idChirho ?? 1;
		}
	}

	// Get reference verses for the chapter using the preferred version (Drizzle typed query)
	// Chapter verses match pattern: bookId (2 digits) + chapter (3 digits) + verse (3 digits)
	const chapterPrefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;
	const referenceVersesChirho = await dbChirho
		.select({
			verseIdChirho: referenceVerseTableChirho.verseIdChirho,
			textChirho: referenceVerseTableChirho.textChirho
		})
		.from(referenceVerseTableChirho)
		.where(andChirho(
			eqChirho(referenceVerseTableChirho.versionIdChirho, preferredVersionIdChirho),
			likeChirho(referenceVerseTableChirho.verseIdChirho, `${chapterPrefixChirho}%`)
		))
		.orderBy(referenceVerseTableChirho.verseIdChirho);

	// Convert reference verses to a map for easy lookup
	const referenceVersesMapChirho: Record<string, string> = {};
	for (const rvChirho of referenceVersesChirho) {
		referenceVersesMapChirho[rvChirho.verseIdChirho] = rvChirho.textChirho;
	}

	// Get the selected reference version info
	const selectedRefVersionChirho = referenceVersionsChirho.find(
		(vChirho) => vChirho.idChirho === preferredVersionIdChirho
	);

	// RTL languages for reference Bibles (Hebrew, Arabic, etc.)
	const rtlLanguagesChirho = ['hbo', 'heb', 'arc', 'arb', 'ara', 'fas', 'urd'];
	const isRefRtlChirho = selectedRefVersionChirho
		? rtlLanguagesChirho.includes(selectedRefVersionChirho.languageCodeChirho)
		: false;

	return {
		codeChirho,
		languageChirho,
		bookChirho,
		chapterChirho,
		versesChirho: versesWithWordsChirho,
		prevChapterIdChirho,
		nextChapterIdChirho,
		allBooksChirho,
		chaptersInBookChirho,
		languagesWithTranslationsChirho,
		referenceVersionsChirho,
		referenceVersesMapChirho,
		selectedRefVersionIdChirho: preferredVersionIdChirho,
		selectedRefLangCodeChirho: selectedRefVersionChirho?.languageCodeChirho ?? 'eng',
		isRefRtlChirho,
		selectedRefVersionNameChirho: selectedRefVersionChirho?.nameChirho ?? 'Reference'
	};
};
