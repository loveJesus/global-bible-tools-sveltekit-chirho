// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * PDF generation utilities for Bible PDFs
 *
 * This module provides rendering functions for:
 * - Book/chapter PDFs
 * - Full Bible PDFs
 * - Interlinear layouts
 *
 * Font handling and sanitization are imported from pdf-utils-chirho.ts
 * (single source of truth for font loading, script detection, and text sanitization)
 */

import { dbChirho, queryRawChirho, eqChirho } from './db-chirho';
import { bookTableChirho, referenceVersionTableChirho } from './schema-chirho';

// Import shared PDF utilities (single source of truth)
import {
	createPdfDocumentChirho,
	getMainFontChirho,
	getBoldFontChirho,
	getFontForTextChirho,
	stripPuaChirho,
	sanitizeGlossChirho,
	getStrongLinkChirho,
	isRtlTextChirho,
	type WordRowChirho
} from './pdf-utils-chirho';

// Re-export for consumers of this module
export {
	createPdfDocumentChirho,
	getMainFontChirho,
	getBoldFontChirho,
	getFontForTextChirho,
	stripPuaChirho,
	sanitizeGlossChirho,
	getStrongLinkChirho,
	isRtlTextChirho,
	type WordRowChirho
};

// Type alias for PDF document instance
type PdfDocumentInstanceChirho = ReturnType<typeof createPdfDocumentChirho>;

// Types
export interface PdfOptionsChirho {
	titleChirho?: string;
	subtitleChirho?: string;
	languageNameChirho?: string;
	showCoverPageChirho?: boolean;
	showStrongsLinksChirho?: boolean;
	versionInfoChirho?: string;
}

// Book name mapping
export const BOOK_NAME_TO_ID_CHIRHO: Record<string, number> = {
	// Old Testament
	genesis: 1, gen: 1,
	exodus: 2, exo: 2, exod: 2,
	leviticus: 3, lev: 3,
	numbers: 4, num: 4,
	deuteronomy: 5, deu: 5, deut: 5,
	joshua: 6, jos: 6, josh: 6,
	judges: 7, jdg: 7, judg: 7,
	ruth: 8, rut: 8,
	'1 samuel': 9, '1samuel': 9, '1sam': 9, 'i samuel': 9,
	'2 samuel': 10, '2samuel': 10, '2sam': 10, 'ii samuel': 10,
	'1 kings': 11, '1kings': 11, '1kgs': 11, 'i kings': 11,
	'2 kings': 12, '2kings': 12, '2kgs': 12, 'ii kings': 12,
	'1 chronicles': 13, '1chronicles': 13, '1chr': 13, 'i chronicles': 13,
	'2 chronicles': 14, '2chronicles': 14, '2chr': 14, 'ii chronicles': 14,
	ezra: 15, ezr: 15,
	nehemiah: 16, neh: 16,
	esther: 17, est: 17,
	job: 18,
	psalms: 19, psa: 19, psalm: 19, pss: 19,
	proverbs: 20, pro: 20, prov: 20,
	ecclesiastes: 21, ecc: 21, eccl: 21,
	'song of solomon': 22, songofsolomon: 22, sos: 22, song: 22,
	isaiah: 23, isa: 23,
	jeremiah: 24, jer: 24,
	lamentations: 25, lam: 25,
	ezekiel: 26, eze: 26, ezek: 26,
	daniel: 27, dan: 27,
	hosea: 28, hos: 28,
	joel: 29,
	amos: 30, amo: 30,
	obadiah: 31, oba: 31, obad: 31,
	jonah: 32, jon: 32,
	micah: 33, mic: 33,
	nahum: 34, nah: 34,
	habakkuk: 35, hab: 35,
	zephaniah: 36, zep: 36, zeph: 36,
	haggai: 37, hag: 37,
	zechariah: 38, zec: 38, zech: 38,
	malachi: 39, mal: 39,
	// New Testament
	matthew: 40, mat: 40, matt: 40,
	mark: 41, mar: 41, mrk: 41,
	luke: 42, luk: 42,
	john: 43, joh: 43, jhn: 43,
	acts: 44, act: 44,
	romans: 45, rom: 45,
	'1 corinthians': 46, '1corinthians': 46, '1cor': 46, 'i corinthians': 46,
	'2 corinthians': 47, '2corinthians': 47, '2cor': 47, 'ii corinthians': 47,
	galatians: 48, gal: 48,
	ephesians: 49, eph: 49,
	philippians: 50, phi: 50, phil: 50,
	colossians: 51, col: 51,
	'1 thessalonians': 52, '1thessalonians': 52, '1thess': 52, 'i thessalonians': 52,
	'2 thessalonians': 53, '2thessalonians': 53, '2thess': 53, 'ii thessalonians': 53,
	'1 timothy': 54, '1timothy': 54, '1tim': 54, 'i timothy': 54,
	'2 timothy': 55, '2timothy': 55, '2tim': 55, 'ii timothy': 55,
	titus: 56, tit: 56,
	philemon: 57, phm: 57, philem: 57,
	hebrews: 58, heb: 58,
	james: 59, jas: 59, jam: 59,
	'1 peter': 60, '1peter': 60, '1pet': 60, 'i peter': 60,
	'2 peter': 61, '2peter': 61, '2pet': 61, 'ii peter': 61,
	'1 john': 62, '1john': 62, '1jn': 62, 'i john': 62,
	'2 john': 63, '2john': 63, '2jn': 63, 'ii john': 63,
	'3 john': 64, '3john': 64, '3jn': 64, 'iii john': 64,
	jude: 65, jud: 65,
	revelation: 66, rev: 66
};

export const BOOK_ID_TO_NAME_CHIRHO: Record<number, string> = {
	1: 'Genesis', 2: 'Exodus', 3: 'Leviticus', 4: 'Numbers', 5: 'Deuteronomy',
	6: 'Joshua', 7: 'Judges', 8: 'Ruth', 9: '1 Samuel', 10: '2 Samuel',
	11: '1 Kings', 12: '2 Kings', 13: '1 Chronicles', 14: '2 Chronicles',
	15: 'Ezra', 16: 'Nehemiah', 17: 'Esther', 18: 'Job', 19: 'Psalms',
	20: 'Proverbs', 21: 'Ecclesiastes', 22: 'Song of Solomon', 23: 'Isaiah',
	24: 'Jeremiah', 25: 'Lamentations', 26: 'Ezekiel', 27: 'Daniel',
	28: 'Hosea', 29: 'Joel', 30: 'Amos', 31: 'Obadiah', 32: 'Jonah',
	33: 'Micah', 34: 'Nahum', 35: 'Habakkuk', 36: 'Zephaniah', 37: 'Haggai',
	38: 'Zechariah', 39: 'Malachi',
	40: 'Matthew', 41: 'Mark', 42: 'Luke', 43: 'John', 44: 'Acts',
	45: 'Romans', 46: '1 Corinthians', 47: '2 Corinthians', 48: 'Galatians',
	49: 'Ephesians', 50: 'Philippians', 51: 'Colossians', 52: '1 Thessalonians',
	53: '2 Thessalonians', 54: '1 Timothy', 55: '2 Timothy', 56: 'Titus',
	57: 'Philemon', 58: 'Hebrews', 59: 'James', 60: '1 Peter', 61: '2 Peter',
	62: '1 John', 63: '2 John', 64: '3 John', 65: 'Jude', 66: 'Revelation'
};

/**
 * Add a cover page to the PDF
 */
export function addCoverPageChirho(
	docChirho: PdfDocumentInstanceChirho,
	optionsChirho: {
		titleChirho: string;
		subtitleChirho?: string;
		versionNameChirho?: string;
		languageNameChirho?: string;
		yearChirho?: number;
	}
): void {
	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	// Center the title vertically
	docChirho.font(boldFontChirho).fontSize(36).fillColor('#1e293b');
	docChirho.moveDown(8);

	// Main title - THE HOLY BIBLE or version name
	docChirho.text(optionsChirho.titleChirho, { align: 'center' });

	// Subtitle (version info)
	if (optionsChirho.subtitleChirho) {
		docChirho.moveDown(1);
		docChirho.font(mainFontChirho).fontSize(18).fillColor('#475569');
		docChirho.text(optionsChirho.subtitleChirho, { align: 'center' });
	}

	// Version name (e.g., "King James Version")
	if (optionsChirho.versionNameChirho) {
		docChirho.moveDown(0.5);
		docChirho.font(mainFontChirho).fontSize(16).fillColor('#64748b');
		docChirho.text(optionsChirho.versionNameChirho, { align: 'center' });
	}

	// Language name
	if (optionsChirho.languageNameChirho) {
		docChirho.moveDown(0.5);
		docChirho.font(mainFontChirho).fontSize(14).fillColor('#94a3b8');
		docChirho.text(`(${optionsChirho.languageNameChirho})`, { align: 'center' });
	}

	// Decorative line
	docChirho.moveDown(3);
	const lineYChirho = docChirho.y;
	docChirho.moveTo(150, lineYChirho).lineTo(445, lineYChirho).stroke('#cbd5e1');

	// Attribution at bottom
	docChirho.moveDown(10);
	docChirho.font(mainFontChirho).fontSize(10).fillColor('#94a3b8');
	docChirho.text('Global Bible Tools', { align: 'center' });
	docChirho.text('global-tools.bible.systems', { align: 'center', link: 'https://global-tools.bible.systems' });

	if (optionsChirho.yearChirho) {
		docChirho.moveDown(0.5);
		docChirho.text(`${optionsChirho.yearChirho}`, { align: 'center' });
	}

	// Add page break
	docChirho.addPage();
}

/**
 * Add a table of contents page
 */
export function addTableOfContentsChirho(
	docChirho: PdfDocumentInstanceChirho,
	booksChirho: { idChirho: number; nameChirho: string }[]
): void {
	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	docChirho.font(boldFontChirho).fontSize(24).fillColor('#1e293b');
	docChirho.text('Table of Contents', { align: 'center' });
	docChirho.moveDown(2);

	// Old Testament header
	docChirho.font(boldFontChirho).fontSize(14).fillColor('#475569');
	docChirho.text('Old Testament', { align: 'left' });
	docChirho.moveDown(0.5);

	const otBooksChirho = booksChirho.filter(bChirho => bChirho.idChirho <= 39);
	const ntBooksChirho = booksChirho.filter(bChirho => bChirho.idChirho > 39);

	// OT books in 3 columns
	docChirho.font(mainFontChirho).fontSize(10).fillColor('#334155');
	const colWidthChirho = 160;
	let colChirho = 0;
	let startYChirho = docChirho.y;

	for (const bookChirho of otBooksChirho) {
		const xChirho = 50 + (colChirho * colWidthChirho);
		docChirho.text(bookChirho.nameChirho, xChirho, docChirho.y, { width: colWidthChirho - 10 });

		colChirho++;
		if (colChirho >= 3) {
			colChirho = 0;
			startYChirho = docChirho.y;
		} else {
			docChirho.y = startYChirho;
		}
	}

	// Reset for NT
	if (colChirho !== 0) {
		docChirho.moveDown(2);
	}
	docChirho.moveDown(1);

	// New Testament header
	docChirho.font(boldFontChirho).fontSize(14).fillColor('#475569');
	docChirho.text('New Testament', { align: 'left' });
	docChirho.moveDown(0.5);

	// NT books in 3 columns
	docChirho.font(mainFontChirho).fontSize(10).fillColor('#334155');
	colChirho = 0;
	startYChirho = docChirho.y;

	for (const bookChirho of ntBooksChirho) {
		const xChirho = 50 + (colChirho * colWidthChirho);
		docChirho.text(bookChirho.nameChirho, xChirho, docChirho.y, { width: colWidthChirho - 10 });

		colChirho++;
		if (colChirho >= 3) {
			colChirho = 0;
			startYChirho = docChirho.y;
		} else {
			docChirho.y = startYChirho;
		}
	}

	docChirho.addPage();
}

/**
 * Add a book title page/header
 */
export function addBookHeaderChirho(
	docChirho: PdfDocumentInstanceChirho,
	bookNameChirho: string,
	startNewPageChirho: boolean = true
): void {
	if (startNewPageChirho) {
		docChirho.addPage();
	}

	const boldFontChirho = getBoldFontChirho();

	docChirho.font(boldFontChirho).fontSize(20).fillColor('#1e293b');
	docChirho.text(bookNameChirho, { align: 'center' });
	docChirho.moveDown(1);
}

/**
 * Render verse text (simple paragraph style for reference versions)
 * Supports RTL layout for Hebrew and Arabic text
 */
export function renderVerseTextChirho(
	docChirho: PdfDocumentInstanceChirho,
	verseNumChirho: number,
	textChirho: string
): void {
	// Use sanitizeGlossChirho to handle non-Latin punctuation (Bengali, Urdu, etc.)
	const cleanTextChirho = sanitizeGlossChirho(textChirho);
	const boldFontChirho = getBoldFontChirho();
	const textFontChirho = getFontForTextChirho(cleanTextChirho);
	const isRtlChirho = isRtlTextChirho(cleanTextChirho);

	// Check if we need a new page
	if (docChirho.y > 750) {
		docChirho.addPage();
	}

	if (isRtlChirho) {
		// RTL rendering for Hebrew/Arabic
		const PAGE_WIDTH_CHIRHO = 495;
		const RIGHT_MARGIN_CHIRHO = 545;
		const LEFT_MARGIN_CHIRHO = 50;

		// Measure the verse number
		const verseNumTextChirho = ` ${verseNumChirho}`;
		docChirho.font(boldFontChirho).fontSize(9);
		const numWidthChirho = docChirho.widthOfString(verseNumTextChirho);

		// Render verse text with RTL alignment
		docChirho.font(textFontChirho).fontSize(11).fillColor('#1e293b');

		const textOptionsChirho = {
			align: 'right' as const,
			width: PAGE_WIDTH_CHIRHO - numWidthChirho - 10
		};

		// Calculate text height to position verse number
		const textHeightChirho = docChirho.heightOfString(cleanTextChirho, textOptionsChirho);
		const startYChirho = docChirho.y;

		// Render the text right-aligned
		docChirho.text(cleanTextChirho, LEFT_MARGIN_CHIRHO, startYChirho, textOptionsChirho);

		// Add verse number at the end (right side for RTL)
		docChirho.font(boldFontChirho).fontSize(9).fillColor('#64748b');
		docChirho.text(verseNumTextChirho, RIGHT_MARGIN_CHIRHO - numWidthChirho, startYChirho);

		// Move past the text
		docChirho.y = startYChirho + textHeightChirho + 2;
	} else {
		// LTR rendering (original behavior)
		const verseNumTextChirho = `${verseNumChirho} `;
		docChirho.font(boldFontChirho).fontSize(9).fillColor('#64748b');
		docChirho.text(verseNumTextChirho, { continued: true });

		// Verse text with appropriate font
		docChirho.font(textFontChirho).fontSize(11).fillColor('#1e293b');
		docChirho.text(cleanTextChirho);
	}
}

/**
 * Render interlinear words (Greek/Hebrew + gloss)
 * Supports RTL rendering for Hebrew text with proper right-alignment
 */
export function renderInterlinearVerseChirho(
	docChirho: PdfDocumentInstanceChirho,
	verseNumChirho: number,
	wordsChirho: WordRowChirho[],
	showStrongsChirho: boolean = true,
	isRtlChirho: boolean = false
): void {
	const mainFontChirho = getMainFontChirho();
	const PAGE_WIDTH_CHIRHO = 495;
	const WORD_PADDING_CHIRHO = 12;
	const WORD_HEIGHT_CHIRHO = showStrongsChirho ? 45 : 32;
	const LEFT_MARGIN_CHIRHO = 50;
	const RIGHT_MARGIN_CHIRHO = 545; // 595 (A4 width) - 50 margin

	// Calculate word widths (use appropriate font for script)
	// Use sanitizeGlossChirho to handle non-Latin punctuation
	const wordWidthsChirho = wordsChirho.map((wordItemChirho) => {
		const cleanTextChirho = stripPuaChirho(wordItemChirho.textChirho);
		const cleanGlossChirho = sanitizeGlossChirho(wordItemChirho.glossChirho ?? '');
		const textFontChirho = getFontForTextChirho(cleanTextChirho);
		const glossFontChirho = getFontForTextChirho(cleanGlossChirho);
		const originalWidthChirho = docChirho.font(textFontChirho).fontSize(10).widthOfString(cleanTextChirho);
		const glossWidthChirho = docChirho.font(glossFontChirho).fontSize(9).widthOfString(cleanGlossChirho || '—');
		const strongsWidthChirho = wordItemChirho.lemmaIdChirho && showStrongsChirho
			? docChirho.font(mainFontChirho).fontSize(7).widthOfString(wordItemChirho.lemmaIdChirho)
			: 0;
		return Math.max(originalWidthChirho, glossWidthChirho, strongsWidthChirho) + WORD_PADDING_CHIRHO;
	});

	// Break into rows
	const rowsChirho: { wordsChirho: WordRowChirho[]; widthsChirho: number[] }[] = [];
	let currentRowChirho: WordRowChirho[] = [];
	let currentWidthsChirho: number[] = [];
	let currentWidthChirho = 25;

	for (let indexChirho = 0; indexChirho < wordsChirho.length; indexChirho++) {
		const wordWidthChirho = wordWidthsChirho[indexChirho];
		if (currentWidthChirho + wordWidthChirho > PAGE_WIDTH_CHIRHO && currentRowChirho.length > 0) {
			rowsChirho.push({ wordsChirho: currentRowChirho, widthsChirho: currentWidthsChirho });
			currentRowChirho = [];
			currentWidthsChirho = [];
			currentWidthChirho = 15;
		}
		currentRowChirho.push(wordsChirho[indexChirho]);
		currentWidthsChirho.push(wordWidthChirho);
		currentWidthChirho += wordWidthChirho;
	}
	if (currentRowChirho.length > 0) {
		rowsChirho.push({ wordsChirho: currentRowChirho, widthsChirho: currentWidthsChirho });
	}

	// Check if verse fits
	const verseHeightChirho = rowsChirho.length * WORD_HEIGHT_CHIRHO + 10;
	if (docChirho.y + verseHeightChirho > 780) {
		docChirho.addPage();
	}

	// Render each row
	for (let rowIndexChirho = 0; rowIndexChirho < rowsChirho.length; rowIndexChirho++) {
		const rowChirho = rowsChirho[rowIndexChirho];
		const rowYChirho = docChirho.y;

		if (isRtlChirho) {
			// RTL layout: start from right, move left
			let xPositionChirho = RIGHT_MARGIN_CHIRHO;

			// Verse number on the right
			if (rowIndexChirho === 0) {
				docChirho.font(mainFontChirho).fontSize(9).fillColor('#666').text(`${verseNumChirho}`, xPositionChirho - 20, rowYChirho);
				xPositionChirho -= 25;
			} else {
				xPositionChirho -= 20;
			}

			// Render words from right to left
			for (let wordIndexChirho = 0; wordIndexChirho < rowChirho.wordsChirho.length; wordIndexChirho++) {
				const currentWordChirho = rowChirho.wordsChirho[wordIndexChirho];
				const cleanTextChirho = stripPuaChirho(currentWordChirho.textChirho);
				const cleanGlossChirho = sanitizeGlossChirho(currentWordChirho.glossChirho ?? '');
				const strongsLinkChirho = showStrongsChirho ? getStrongLinkChirho(currentWordChirho.lemmaIdChirho) : null;
				const selectedFontChirho = getFontForTextChirho(cleanTextChirho);
				const glossFontChirho = getFontForTextChirho(cleanGlossChirho);

				// Move x left by the word width before rendering
				xPositionChirho -= rowChirho.widthsChirho[wordIndexChirho];

				// Original text (Hebrew/Arabic)
				docChirho.font(selectedFontChirho).fontSize(10).fillColor('#333').text(cleanTextChirho, xPositionChirho, rowYChirho);

				// Gloss (use appropriate font for script)
				docChirho.font(glossFontChirho).fontSize(9).fillColor('#000').text(cleanGlossChirho || '—', xPositionChirho, rowYChirho + 14);

				// Strong's number
				if (currentWordChirho.lemmaIdChirho && strongsLinkChirho && showStrongsChirho) {
					docChirho.font(mainFontChirho).fontSize(7).fillColor('#0066cc')
						.text(currentWordChirho.lemmaIdChirho, xPositionChirho, rowYChirho + 28, { link: strongsLinkChirho, underline: true });
				}
			}
		} else {
			// LTR layout (original)
			let xPositionChirho = LEFT_MARGIN_CHIRHO;

			if (rowIndexChirho === 0) {
				docChirho.font(mainFontChirho).fontSize(9).fillColor('#666').text(`${verseNumChirho}`, xPositionChirho, rowYChirho);
				xPositionChirho += 25;
			} else {
				xPositionChirho += 20;
			}

			for (let wordIndexChirho = 0; wordIndexChirho < rowChirho.wordsChirho.length; wordIndexChirho++) {
				const currentWordChirho = rowChirho.wordsChirho[wordIndexChirho];
				const cleanTextChirho = stripPuaChirho(currentWordChirho.textChirho);
				const cleanGlossChirho = sanitizeGlossChirho(currentWordChirho.glossChirho ?? '');
				const strongsLinkChirho = showStrongsChirho ? getStrongLinkChirho(currentWordChirho.lemmaIdChirho) : null;
				const selectedFontChirho = getFontForTextChirho(cleanTextChirho);
				const glossFontChirho = getFontForTextChirho(cleanGlossChirho);

				// Original text (Greek or other)
				docChirho.font(selectedFontChirho).fontSize(10).fillColor('#333').text(cleanTextChirho, xPositionChirho, rowYChirho);

				// Gloss (use appropriate font for script)
				docChirho.font(glossFontChirho).fontSize(9).fillColor('#000').text(cleanGlossChirho || '—', xPositionChirho, rowYChirho + 14);

				// Strong's number
				if (currentWordChirho.lemmaIdChirho && strongsLinkChirho && showStrongsChirho) {
					docChirho.font(mainFontChirho).fontSize(7).fillColor('#0066cc')
						.text(currentWordChirho.lemmaIdChirho, xPositionChirho, rowYChirho + 28, { link: strongsLinkChirho, underline: true });
				}

				xPositionChirho += rowChirho.widthsChirho[wordIndexChirho];
			}
		}

		docChirho.y = rowYChirho + WORD_HEIGHT_CHIRHO;
	}

	docChirho.moveDown(0.3);
}

/**
 * Get all books from database
 */
export async function getAllBooksChirho(): Promise<{ idChirho: number; nameChirho: string }[]> {
	return await dbChirho.select({
		idChirho: bookTableChirho.idChirho,
		nameChirho: bookTableChirho.nameChirho
	}).from(bookTableChirho).orderBy(bookTableChirho.idChirho);
}

/**
 * Get reference version by code
 */
export async function getReferenceVersionChirho(codeChirho: string) {
	const resultChirho = await dbChirho
		.select()
		.from(referenceVersionTableChirho)
		.where(eqChirho(referenceVersionTableChirho.codeChirho, codeChirho))
		.limit(1);
	return resultChirho[0] ?? null;
}

/**
 * Get all reference versions
 */
export async function getAllReferenceVersionsChirho() {
	return await dbChirho.select().from(referenceVersionTableChirho).orderBy(referenceVersionTableChirho.idChirho);
}

/**
 * Get reference verses for a book
 */
export async function getReferenceVersesForBookChirho(versionIdChirho: number, bookIdChirho: number) {
	const bookPrefixChirho = bookIdChirho.toString().padStart(2, '0');

	const versesChirho = await queryRawChirho<{ verseIdChirho: string; textChirho: string }>(
		`SELECT verse_id_chirho AS "verseIdChirho", text_chirho AS "textChirho"
		 FROM reference_verse_chirho
		 WHERE version_id_chirho = $1 AND verse_id_chirho LIKE $2
		 ORDER BY verse_id_chirho`,
		[versionIdChirho, `${bookPrefixChirho}%`]
	);

	return versesChirho;
}

/**
 * Get all reference verses for a version
 */
export async function getAllReferenceVersesChirho(versionIdChirho: number) {
	const versesChirho = await queryRawChirho<{ verseIdChirho: string; textChirho: string }>(
		`SELECT verse_id_chirho AS "verseIdChirho", text_chirho AS "textChirho"
		 FROM reference_verse_chirho
		 WHERE version_id_chirho = $1
		 ORDER BY verse_id_chirho`,
		[versionIdChirho]
	);

	return versesChirho;
}

/**
 * Finalize PDF and return buffer
 */
export async function finalizePdfChirho(docChirho: PdfDocumentInstanceChirho): Promise<Buffer> {
	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	docChirho.end();
	await new Promise<void>((resolveChirho) => docChirho.on('end', resolveChirho));

	return Buffer.concat(chunksChirho);
}
