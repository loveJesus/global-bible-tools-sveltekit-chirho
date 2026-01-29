#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate Full Interlinear Bible PDF
 *
 * Creates a complete Bible PDF with Greek/Hebrew text and word-by-word glosses
 * for a specified language translation. Optionally includes reference Bible text.
 *
 * Uses shared PDF utilities from pdf-generator-chirho.ts for proper font support
 * including Bengali, Hindi, Arabic, Thai, CJK, and other international scripts.
 *
 * Usage:
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts <language_code> [output_path] [reference_version] [--large-font]
 *
 * Examples:
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts spa
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts hin ./Hindi-Interlinear-Bible.pdf
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts eng ./KJV-Interlinear.pdf kjv
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts eng ./WEB-Interlinear.pdf web
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts hin ./Hindi-Large.pdf hinfbi --large-font
 */

import { writeFileSync as writeFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';
import pg from 'pg';

// Import standalone PDF utilities for proper font support (Bengali, Hindi, Arabic, etc.)
// This module doesn't depend on SvelteKit and can be used in CLI tools
import {
	createPdfDocumentChirho,
	getMainFontChirho,
	getBoldFontChirho,
	getFontForTextChirho,
	stripPuaChirho,
	getStrongLinkChirho,
	isHebrewTextChirho,
	sanitizeForArabicFontChirho,
	isRtlTextChirho
} from './pdf-fonts-chirho';

const { Pool: PoolChirho } = pg;

// Type alias for PDF document instance
type PdfDocumentInstanceChirho = ReturnType<typeof createPdfDocumentChirho>;

// Database connection
const poolChirho = new PoolChirho({
	connectionString: process.env.DATABASE_URL_CHIRHO || 'postgresql://postgres:asdfasdf@localhost:5435/postgres'
});

// Book definitions
const BOOKS_CHIRHO = [
	{ idChirho: 1, nameChirho: 'Genesis', chaptersChirho: 50 },
	{ idChirho: 2, nameChirho: 'Exodus', chaptersChirho: 40 },
	{ idChirho: 3, nameChirho: 'Leviticus', chaptersChirho: 27 },
	{ idChirho: 4, nameChirho: 'Numbers', chaptersChirho: 36 },
	{ idChirho: 5, nameChirho: 'Deuteronomy', chaptersChirho: 34 },
	{ idChirho: 6, nameChirho: 'Joshua', chaptersChirho: 24 },
	{ idChirho: 7, nameChirho: 'Judges', chaptersChirho: 21 },
	{ idChirho: 8, nameChirho: 'Ruth', chaptersChirho: 4 },
	{ idChirho: 9, nameChirho: '1 Samuel', chaptersChirho: 31 },
	{ idChirho: 10, nameChirho: '2 Samuel', chaptersChirho: 24 },
	{ idChirho: 11, nameChirho: '1 Kings', chaptersChirho: 22 },
	{ idChirho: 12, nameChirho: '2 Kings', chaptersChirho: 25 },
	{ idChirho: 13, nameChirho: '1 Chronicles', chaptersChirho: 29 },
	{ idChirho: 14, nameChirho: '2 Chronicles', chaptersChirho: 36 },
	{ idChirho: 15, nameChirho: 'Ezra', chaptersChirho: 10 },
	{ idChirho: 16, nameChirho: 'Nehemiah', chaptersChirho: 13 },
	{ idChirho: 17, nameChirho: 'Esther', chaptersChirho: 10 },
	{ idChirho: 18, nameChirho: 'Job', chaptersChirho: 42 },
	{ idChirho: 19, nameChirho: 'Psalms', chaptersChirho: 150 },
	{ idChirho: 20, nameChirho: 'Proverbs', chaptersChirho: 31 },
	{ idChirho: 21, nameChirho: 'Ecclesiastes', chaptersChirho: 12 },
	{ idChirho: 22, nameChirho: 'Song of Solomon', chaptersChirho: 8 },
	{ idChirho: 23, nameChirho: 'Isaiah', chaptersChirho: 66 },
	{ idChirho: 24, nameChirho: 'Jeremiah', chaptersChirho: 52 },
	{ idChirho: 25, nameChirho: 'Lamentations', chaptersChirho: 5 },
	{ idChirho: 26, nameChirho: 'Ezekiel', chaptersChirho: 48 },
	{ idChirho: 27, nameChirho: 'Daniel', chaptersChirho: 12 },
	{ idChirho: 28, nameChirho: 'Hosea', chaptersChirho: 14 },
	{ idChirho: 29, nameChirho: 'Joel', chaptersChirho: 3 },
	{ idChirho: 30, nameChirho: 'Amos', chaptersChirho: 9 },
	{ idChirho: 31, nameChirho: 'Obadiah', chaptersChirho: 1 },
	{ idChirho: 32, nameChirho: 'Jonah', chaptersChirho: 4 },
	{ idChirho: 33, nameChirho: 'Micah', chaptersChirho: 7 },
	{ idChirho: 34, nameChirho: 'Nahum', chaptersChirho: 3 },
	{ idChirho: 35, nameChirho: 'Habakkuk', chaptersChirho: 3 },
	{ idChirho: 36, nameChirho: 'Zephaniah', chaptersChirho: 3 },
	{ idChirho: 37, nameChirho: 'Haggai', chaptersChirho: 2 },
	{ idChirho: 38, nameChirho: 'Zechariah', chaptersChirho: 14 },
	{ idChirho: 39, nameChirho: 'Malachi', chaptersChirho: 4 },
	{ idChirho: 40, nameChirho: 'Matthew', chaptersChirho: 28 },
	{ idChirho: 41, nameChirho: 'Mark', chaptersChirho: 16 },
	{ idChirho: 42, nameChirho: 'Luke', chaptersChirho: 24 },
	{ idChirho: 43, nameChirho: 'John', chaptersChirho: 21 },
	{ idChirho: 44, nameChirho: 'Acts', chaptersChirho: 28 },
	{ idChirho: 45, nameChirho: 'Romans', chaptersChirho: 16 },
	{ idChirho: 46, nameChirho: '1 Corinthians', chaptersChirho: 16 },
	{ idChirho: 47, nameChirho: '2 Corinthians', chaptersChirho: 13 },
	{ idChirho: 48, nameChirho: 'Galatians', chaptersChirho: 6 },
	{ idChirho: 49, nameChirho: 'Ephesians', chaptersChirho: 6 },
	{ idChirho: 50, nameChirho: 'Philippians', chaptersChirho: 4 },
	{ idChirho: 51, nameChirho: 'Colossians', chaptersChirho: 4 },
	{ idChirho: 52, nameChirho: '1 Thessalonians', chaptersChirho: 5 },
	{ idChirho: 53, nameChirho: '2 Thessalonians', chaptersChirho: 3 },
	{ idChirho: 54, nameChirho: '1 Timothy', chaptersChirho: 6 },
	{ idChirho: 55, nameChirho: '2 Timothy', chaptersChirho: 4 },
	{ idChirho: 56, nameChirho: 'Titus', chaptersChirho: 3 },
	{ idChirho: 57, nameChirho: 'Philemon', chaptersChirho: 1 },
	{ idChirho: 58, nameChirho: 'Hebrews', chaptersChirho: 13 },
	{ idChirho: 59, nameChirho: 'James', chaptersChirho: 5 },
	{ idChirho: 60, nameChirho: '1 Peter', chaptersChirho: 5 },
	{ idChirho: 61, nameChirho: '2 Peter', chaptersChirho: 3 },
	{ idChirho: 62, nameChirho: '1 John', chaptersChirho: 5 },
	{ idChirho: 63, nameChirho: '2 John', chaptersChirho: 1 },
	{ idChirho: 64, nameChirho: '3 John', chaptersChirho: 1 },
	{ idChirho: 65, nameChirho: 'Jude', chaptersChirho: 1 },
	{ idChirho: 66, nameChirho: 'Revelation', chaptersChirho: 22 }
];

// Font size configuration (can be scaled with --large-font flag)
interface FontSizesChirho {
	titleChirho: number;
	subtitleChirho: number;
	languageChirho: number;
	bookHeaderChirho: number;
	chapterHeaderChirho: number;
	verseNumChirho: number;
	originalTextChirho: number;
	glossChirho: number;
	strongsChirho: number;
	refTextChirho: number;
	tocHeaderChirho: number;
	tocItemChirho: number;
	footerChirho: number;
	wordHeightChirho: number;
	wordHeightNoStrongsChirho: number;
}

// Normal font sizes (default)
const NORMAL_FONT_SIZES_CHIRHO: FontSizesChirho = {
	titleChirho: 36,
	subtitleChirho: 18,
	languageChirho: 16,
	bookHeaderChirho: 24,
	chapterHeaderChirho: 14,
	verseNumChirho: 9,
	originalTextChirho: 10,
	glossChirho: 9,
	strongsChirho: 7,
	refTextChirho: 9,
	tocHeaderChirho: 24,
	tocItemChirho: 10,
	footerChirho: 10,
	wordHeightChirho: 45,
	wordHeightNoStrongsChirho: 32
};

// Large font sizes (~40% larger)
const LARGE_FONT_SIZES_CHIRHO: FontSizesChirho = {
	titleChirho: 48,
	subtitleChirho: 24,
	languageChirho: 22,
	bookHeaderChirho: 32,
	chapterHeaderChirho: 20,
	verseNumChirho: 13,
	originalTextChirho: 14,
	glossChirho: 13,
	strongsChirho: 10,
	refTextChirho: 13,
	tocHeaderChirho: 32,
	tocItemChirho: 14,
	footerChirho: 14,
	wordHeightChirho: 60,
	wordHeightNoStrongsChirho: 45
};

// Global font sizes (set based on --large-font flag)
let fontSizesChirho: FontSizesChirho = NORMAL_FONT_SIZES_CHIRHO;

interface WordRowChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
	verseIdChirho: string;
}

/**
 * Get words with glosses for a chapter
 */
async function getChapterWordsChirho(
	languageIdChirho: number,
	bookIdChirho: number,
	chapterChirho: number
): Promise<WordRowChirho[]> {
	const resultChirho = await poolChirho.query<{
		wordIdChirho: string;
		textChirho: string;
		lemmaIdChirho: string | null;
		glossChirho: string | null;
		verseIdChirho: string;
	}>(
		`SELECT
			w.id AS "wordIdChirho",
			w.text AS "textChirho",
			lf.lemma_id AS "lemmaIdChirho",
			ph.gloss AS "glossChirho",
			w.verse_id AS "verseIdChirho"
		FROM word w
		JOIN verse v ON v.id = w.verse_id
		LEFT JOIN lemma_form lf ON lf.id = w.form_id
		LEFT JOIN LATERAL (
			SELECT g.gloss
			FROM phrase_word pw
			JOIN phrase p ON p.id = pw.phrase_id
			LEFT JOIN gloss g ON g.phrase_id = p.id
			WHERE pw.word_id = w.id
				AND p.language_id = $1
				AND p.deleted_at IS NULL
			LIMIT 1
		) AS ph ON true
		WHERE v.book_id = $2 AND v.chapter = $3
		ORDER BY w.id`,
		[languageIdChirho, bookIdChirho, chapterChirho]
	);

	return resultChirho.rows;
}

/**
 * Get language info
 */
async function getLanguageChirho(codeChirho: string): Promise<{ idChirho: number; nameChirho: string } | null> {
	const resultChirho = await poolChirho.query<{ idChirho: number; nameChirho: string }>(
		`SELECT id AS "idChirho", name AS "nameChirho" FROM language WHERE code = $1`,
		[codeChirho]
	);
	return resultChirho.rows[0] ?? null;
}

/**
 * Get reference version info
 */
async function getReferenceVersionChirho(codeChirho: string): Promise<{ idChirho: number; nameChirho: string } | null> {
	const resultChirho = await poolChirho.query<{ idChirho: number; nameChirho: string }>(
		`SELECT id_chirho AS "idChirho", name_chirho AS "nameChirho" FROM reference_version_chirho WHERE code_chirho = $1`,
		[codeChirho]
	);
	return resultChirho.rows[0] ?? null;
}

/**
 * Get reference verses for a chapter
 */
async function getChapterReferenceVersesChirho(
	versionIdChirho: number,
	bookIdChirho: number,
	chapterChirho: number
): Promise<Map<string, string>> {
	const prefixChirho = `${bookIdChirho.toString().padStart(2, '0')}${chapterChirho.toString().padStart(3, '0')}`;
	const resultChirho = await poolChirho.query<{ verseIdChirho: string; textChirho: string }>(
		`SELECT verse_id_chirho AS "verseIdChirho", text_chirho AS "textChirho"
		 FROM reference_verse_chirho
		 WHERE version_id_chirho = $1 AND verse_id_chirho LIKE $2
		 ORDER BY verse_id_chirho`,
		[versionIdChirho, `${prefixChirho}%`]
	);

	const mapChirho = new Map<string, string>();
	for (const rowChirho of resultChirho.rows) {
		mapChirho.set(rowChirho.verseIdChirho, rowChirho.textChirho);
	}
	return mapChirho;
}

/**
 * Add cover page - fits on single page
 */
function addCoverPageChirho(docChirho: PdfDocumentInstanceChirho, languageNameChirho: string): void {
	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	// Title at top third of page (reduced from moveDown(8) to moveDown(5))
	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.titleChirho).fillColor('#1e293b');
	docChirho.moveDown(5);
	docChirho.text('INTERLINEAR BIBLE', { align: 'center' });

	docChirho.moveDown(1);
	docChirho.font(mainFontChirho).fontSize(fontSizesChirho.subtitleChirho).fillColor('#475569');
	docChirho.text('Greek & Hebrew Text with Word-by-Word Translation', { align: 'center' });

	docChirho.moveDown(0.5);
	docChirho.fontSize(fontSizesChirho.languageChirho).fillColor('#64748b');
	docChirho.text(languageNameChirho, { align: 'center' });

	// Decorative line
	docChirho.moveDown(2);
	const lineYChirho = docChirho.y;
	docChirho.moveTo(150, lineYChirho).lineTo(445, lineYChirho).stroke('#cbd5e1');

	// Attribution - position at bottom of page (fixed Y position instead of moveDown)
	docChirho.font(mainFontChirho).fontSize(fontSizesChirho.footerChirho).fillColor('#94a3b8');
	docChirho.text('Global Bible Tools', 50, 700, { align: 'center', width: 495 });
	docChirho.text('global-tools.bible.systems', 50, 715, { align: 'center', width: 495 });
	docChirho.text(new Date().getFullYear().toString(), 50, 735, { align: 'center', width: 495 });

	docChirho.addPage();
}

/**
 * Add table of contents
 */
function addTableOfContentsChirho(docChirho: PdfDocumentInstanceChirho): void {
	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.tocHeaderChirho).fillColor('#1e293b');
	docChirho.text('Table of Contents', { align: 'center' });
	docChirho.moveDown(2);

	// Old Testament
	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.chapterHeaderChirho).fillColor('#475569');
	docChirho.text('Old Testament', { align: 'left' });
	docChirho.moveDown(0.5);

	const otBooksChirho = BOOKS_CHIRHO.filter(bChirho => bChirho.idChirho <= 39);
	const ntBooksChirho = BOOKS_CHIRHO.filter(bChirho => bChirho.idChirho > 39);

	docChirho.font(mainFontChirho).fontSize(fontSizesChirho.tocItemChirho).fillColor('#334155');
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

	if (colChirho !== 0) docChirho.moveDown(2);
	docChirho.moveDown(1);

	// New Testament
	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.chapterHeaderChirho).fillColor('#475569');
	docChirho.text('New Testament', { align: 'left' });
	docChirho.moveDown(0.5);

	docChirho.font(mainFontChirho).fontSize(fontSizesChirho.tocItemChirho).fillColor('#334155');
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
 * Add book header
 */
function addBookHeaderChirho(docChirho: PdfDocumentInstanceChirho, bookNameChirho: string): void {
	docChirho.addPage();
	const boldFontChirho = getBoldFontChirho();
	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.bookHeaderChirho).fillColor('#1e293b');
	docChirho.text(bookNameChirho, { align: 'center' });
	docChirho.moveDown(2);
}

/**
 * Add chapter header
 */
function addChapterHeaderChirho(docChirho: PdfDocumentInstanceChirho, chapterChirho: number): void {
	if (docChirho.y > 700) docChirho.addPage();

	const boldFontChirho = getBoldFontChirho();
	docChirho.moveDown(1);
	docChirho.font(boldFontChirho).fontSize(fontSizesChirho.chapterHeaderChirho).fillColor('#334155');
	docChirho.text(`Chapter ${chapterChirho}`, { align: 'left' });
	docChirho.moveDown(0.5);
}

/**
 * Render interlinear verse with proper font support for all scripts
 * Uses getFontForTextChirho() from shared module for Bengali, Hindi, Arabic, etc.
 */
function renderInterlinearVerseChirho(
	docChirho: PdfDocumentInstanceChirho,
	verseNumChirho: number,
	wordsChirho: WordRowChirho[],
	showStrongsChirho: boolean = true,
	isRtlChirho: boolean = false
): void {
	const mainFontChirho = getMainFontChirho();
	const PAGE_WIDTH_CHIRHO = 495;
	const WORD_PADDING_CHIRHO = fontSizesChirho === LARGE_FONT_SIZES_CHIRHO ? 16 : 12;
	const WORD_HEIGHT_CHIRHO = showStrongsChirho ? fontSizesChirho.wordHeightChirho : fontSizesChirho.wordHeightNoStrongsChirho;
	const LEFT_MARGIN_CHIRHO = 50;
	const RIGHT_MARGIN_CHIRHO = 545; // 595 (A4 width) - 50 margin

	// Calculate word widths using appropriate fonts for each script
	const wordWidthsChirho = wordsChirho.map((wChirho) => {
		const cleanTextChirho = stripPuaChirho(wChirho.textChirho);
		const cleanGlossChirho = sanitizeForArabicFontChirho(stripPuaChirho(wChirho.glossChirho ?? ''));
		// Use script-aware font selection for source text
		const textFontChirho = getFontForTextChirho(cleanTextChirho);
		// Use script-aware font selection for gloss (Bengali, Hindi, etc.)
		const glossFontChirho = getFontForTextChirho(cleanGlossChirho);

		const originalWidthChirho = docChirho.font(textFontChirho).fontSize(fontSizesChirho.originalTextChirho).widthOfString(cleanTextChirho);
		const glossWidthChirho = docChirho.font(glossFontChirho).fontSize(fontSizesChirho.glossChirho).widthOfString(cleanGlossChirho || '—');
		const strongsWidthChirho = wChirho.lemmaIdChirho && showStrongsChirho
			? docChirho.font(mainFontChirho).fontSize(fontSizesChirho.strongsChirho).widthOfString(wChirho.lemmaIdChirho)
			: 0;
		return Math.max(originalWidthChirho, glossWidthChirho, strongsWidthChirho) + WORD_PADDING_CHIRHO;
	});

	// Break into rows
	const rowsChirho: { wordsChirho: WordRowChirho[]; widthsChirho: number[] }[] = [];
	let currentRowChirho: WordRowChirho[] = [];
	let currentWidthsChirho: number[] = [];
	let currentWidthChirho = 25;

	for (let iChirho = 0; iChirho < wordsChirho.length; iChirho++) {
		const wordWidthChirho = wordWidthsChirho[iChirho];
		if (currentWidthChirho + wordWidthChirho > PAGE_WIDTH_CHIRHO && currentRowChirho.length > 0) {
			rowsChirho.push({ wordsChirho: currentRowChirho, widthsChirho: currentWidthsChirho });
			currentRowChirho = [];
			currentWidthsChirho = [];
			currentWidthChirho = 15;
		}
		currentRowChirho.push(wordsChirho[iChirho]);
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
	for (let rowIdxChirho = 0; rowIdxChirho < rowsChirho.length; rowIdxChirho++) {
		const rowChirho = rowsChirho[rowIdxChirho];
		const rowYChirho = docChirho.y;

		if (isRtlChirho) {
			// RTL layout: start from right, move left
			let xPositionChirho = RIGHT_MARGIN_CHIRHO;
			const glossYOffsetChirho = fontSizesChirho === LARGE_FONT_SIZES_CHIRHO ? 18 : 14;
			const strongsYOffsetChirho = fontSizesChirho === LARGE_FONT_SIZES_CHIRHO ? 36 : 28;

			// Verse number on the right
			if (rowIdxChirho === 0) {
				docChirho.font(mainFontChirho).fontSize(fontSizesChirho.verseNumChirho).fillColor('#666').text(`${verseNumChirho}`, xPositionChirho - 20, rowYChirho);
				xPositionChirho -= 25;
			} else {
				xPositionChirho -= 20;
			}

			// Render words from right to left
			for (let wordIdxChirho = 0; wordIdxChirho < rowChirho.wordsChirho.length; wordIdxChirho++) {
				const currentWordChirho = rowChirho.wordsChirho[wordIdxChirho];
				const cleanTextChirho = stripPuaChirho(currentWordChirho.textChirho);
				const cleanGlossChirho = sanitizeForArabicFontChirho(stripPuaChirho(currentWordChirho.glossChirho ?? ''));
				const strongsLinkChirho = showStrongsChirho ? getStrongLinkChirho(currentWordChirho.lemmaIdChirho) : null;
				// Use script-aware font selection
				const selectedFontChirho = getFontForTextChirho(cleanTextChirho);
				const glossFontChirho = getFontForTextChirho(cleanGlossChirho);

				// Move x left by the word width before rendering
				xPositionChirho -= rowChirho.widthsChirho[wordIdxChirho];

				// Original text (Hebrew/Aramaic)
				docChirho.font(selectedFontChirho).fontSize(fontSizesChirho.originalTextChirho).fillColor('#333').text(cleanTextChirho, xPositionChirho, rowYChirho);

				// Gloss (using appropriate font for Bengali, Hindi, etc.)
				docChirho.font(glossFontChirho).fontSize(fontSizesChirho.glossChirho).fillColor('#000').text(cleanGlossChirho || '—', xPositionChirho, rowYChirho + glossYOffsetChirho);

				// Strong's number
				if (currentWordChirho.lemmaIdChirho && strongsLinkChirho && showStrongsChirho) {
					docChirho.font(mainFontChirho).fontSize(fontSizesChirho.strongsChirho).fillColor('#0066cc')
						.text(currentWordChirho.lemmaIdChirho, xPositionChirho, rowYChirho + strongsYOffsetChirho, { link: strongsLinkChirho, underline: true });
				}
			}
		} else {
			// LTR layout (Greek NT, etc.)
			let xPositionChirho = LEFT_MARGIN_CHIRHO;
			const glossYOffsetChirho = fontSizesChirho === LARGE_FONT_SIZES_CHIRHO ? 18 : 14;
			const strongsYOffsetChirho = fontSizesChirho === LARGE_FONT_SIZES_CHIRHO ? 36 : 28;

			if (rowIdxChirho === 0) {
				docChirho.font(mainFontChirho).fontSize(fontSizesChirho.verseNumChirho).fillColor('#666').text(`${verseNumChirho}`, xPositionChirho, rowYChirho);
				xPositionChirho += 25;
			} else {
				xPositionChirho += 20;
			}

			for (let wordIdxChirho = 0; wordIdxChirho < rowChirho.wordsChirho.length; wordIdxChirho++) {
				const currentWordChirho = rowChirho.wordsChirho[wordIdxChirho];
				const cleanTextChirho = stripPuaChirho(currentWordChirho.textChirho);
				const cleanGlossChirho = sanitizeForArabicFontChirho(stripPuaChirho(currentWordChirho.glossChirho ?? ''));
				const strongsLinkChirho = showStrongsChirho ? getStrongLinkChirho(currentWordChirho.lemmaIdChirho) : null;
				// Use script-aware font selection
				const selectedFontChirho = getFontForTextChirho(cleanTextChirho);
				const glossFontChirho = getFontForTextChirho(cleanGlossChirho);

				// Original text (Greek)
				docChirho.font(selectedFontChirho).fontSize(fontSizesChirho.originalTextChirho).fillColor('#333').text(cleanTextChirho, xPositionChirho, rowYChirho);

				// Gloss (using appropriate font for Bengali, Hindi, etc.)
				docChirho.font(glossFontChirho).fontSize(fontSizesChirho.glossChirho).fillColor('#000').text(cleanGlossChirho || '—', xPositionChirho, rowYChirho + glossYOffsetChirho);

				// Strong's number
				if (currentWordChirho.lemmaIdChirho && strongsLinkChirho && showStrongsChirho) {
					docChirho.font(mainFontChirho).fontSize(fontSizesChirho.strongsChirho).fillColor('#0066cc')
						.text(currentWordChirho.lemmaIdChirho, xPositionChirho, rowYChirho + strongsYOffsetChirho, { link: strongsLinkChirho, underline: true });
				}

				xPositionChirho += rowChirho.widthsChirho[wordIdxChirho];
			}
		}

		docChirho.y = rowYChirho + WORD_HEIGHT_CHIRHO;
	}

	docChirho.moveDown(0.3);
}

/**
 * Render reference verse text below interlinear
 */
function renderReferenceVerseChirho(
	docChirho: PdfDocumentInstanceChirho,
	verseNumChirho: number,
	textChirho: string
): void {
	const cleanTextChirho = stripPuaChirho(textChirho);
	const textFontChirho = getFontForTextChirho(cleanTextChirho);

	// Check if we need a new page
	if (docChirho.y > 700) {
		docChirho.addPage();
	}

	// Detect RTL text (Hebrew, Arabic, Urdu) for proper alignment
	const alignmentChirho = isRtlTextChirho(cleanTextChirho) ? 'right' : 'left';

	// Render reference text with appropriate font and alignment
	docChirho.font(textFontChirho).fontSize(fontSizesChirho.refTextChirho).fillColor('#475569');
	docChirho.text(`  ${cleanTextChirho}`, 50, docChirho.y, {
		indent: 20,
		width: 495,
		align: alignmentChirho
	});
	docChirho.moveDown(0.4);
}

/**
 * Main function
 */
async function mainChirho(): Promise<void> {
	const rawArgsChirho = process.argv.slice(2);

	// Parse --large-font flag
	const largeFontChirho = rawArgsChirho.includes('--large-font');
	const argsChirho = rawArgsChirho.filter(aChirho => aChirho !== '--large-font');

	// Set font sizes based on flag
	if (largeFontChirho) {
		fontSizesChirho = LARGE_FONT_SIZES_CHIRHO;
		console.log('Using large font mode');
	}

	if (argsChirho.length === 0) {
		console.log('Usage: bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts <language_code> [output_path] [reference_version] [--large-font]');
		console.log('Example: bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts spa');
		console.log('         bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts hin ./Hindi-Bible.pdf');
		console.log('         bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts eng ./KJV-Interlinear.pdf kjv');
		console.log('         bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts hin ./Hindi-Large.pdf hinfbi --large-font');
		process.exit(1);
	}

	const langCodeChirho = argsChirho[0];
	const refVersionCodeChirho = argsChirho[2] ?? null;
	// Default: save to static/bibles-chirho/ with -chirho suffix
	const defaultFilenameChirho = refVersionCodeChirho
		? `interlinear-${refVersionCodeChirho}-chirho.pdf`
		: `interlinear-${langCodeChirho}-chirho.pdf`;
	const outputPathChirho = argsChirho[1] ?? joinChirho(process.cwd(), `static/bibles-chirho/${defaultFilenameChirho}`);

	console.log(`Generating interlinear Bible PDF for language: ${langCodeChirho}`);
	if (refVersionCodeChirho) {
		console.log(`Including reference version: ${refVersionCodeChirho}`);
	}

	// Get language
	const languageChirho = await getLanguageChirho(langCodeChirho);
	if (!languageChirho) {
		console.error(`Language '${langCodeChirho}' not found in database`);
		process.exit(1);
	}

	console.log(`Found language: ${languageChirho.nameChirho} (ID: ${languageChirho.idChirho})`);

	// Get reference version if specified
	let refVersionChirho: { idChirho: number; nameChirho: string } | null = null;
	if (refVersionCodeChirho) {
		refVersionChirho = await getReferenceVersionChirho(refVersionCodeChirho);
		if (!refVersionChirho) {
			console.error(`Reference version '${refVersionCodeChirho}' not found in database`);
			process.exit(1);
		}
		console.log(`Found reference version: ${refVersionChirho.nameChirho}`);
	}

	// Create PDF using shared utility (registers all fonts: Bengali, Hindi, Arabic, Thai, CJK, etc.)
	const docChirho = createPdfDocumentChirho({
		info: {
			Title: `Interlinear Bible - ${languageChirho.nameChirho}`,
			Author: 'Global Bible Tools',
			Subject: 'Interlinear Bible with Greek/Hebrew and word-by-word translation',
			Creator: 'Global Bible Tools (global-tools.bible.systems)'
		}
	});

	// Collect chunks
	const chunksChirho: Buffer[] = [];
	docChirho.on('data', (chunkChirho: Buffer) => chunksChirho.push(chunkChirho));

	// Add cover page and TOC
	const titleChirho = refVersionChirho
		? `${refVersionChirho.nameChirho} - Interlinear`
		: languageChirho.nameChirho;
	addCoverPageChirho(docChirho, titleChirho);
	addTableOfContentsChirho(docChirho);

	let totalVersesChirho = 0;
	let totalWordsChirho = 0;

	// Process each book
	for (const bookChirho of BOOKS_CHIRHO) {
		console.log(`Processing ${bookChirho.nameChirho}...`);
		let bookHasContentChirho = false;

		for (let chapterChirho = 1; chapterChirho <= bookChirho.chaptersChirho; chapterChirho++) {
			const wordsChirho = await getChapterWordsChirho(languageChirho.idChirho, bookChirho.idChirho, chapterChirho);

			if (wordsChirho.length === 0) continue;

			// Add book header if this is first chapter with content
			if (!bookHasContentChirho) {
				addBookHeaderChirho(docChirho, bookChirho.nameChirho);
				bookHasContentChirho = true;
			}

			// Add chapter header
			addChapterHeaderChirho(docChirho, chapterChirho);

			// Fetch reference verses for this chapter if a reference version is specified
			let refVersesMapChirho: Map<string, string> | null = null;
			if (refVersionChirho) {
				refVersesMapChirho = await getChapterReferenceVersesChirho(
					refVersionChirho.idChirho,
					bookChirho.idChirho,
					chapterChirho
				);
			}

			// Group words by verse
			const verseGroupsChirho = new Map<string, WordRowChirho[]>();
			for (const wordChirho of wordsChirho) {
				const groupChirho = verseGroupsChirho.get(wordChirho.verseIdChirho) ?? [];
				groupChirho.push(wordChirho);
				verseGroupsChirho.set(wordChirho.verseIdChirho, groupChirho);
			}

			// Render verses
			// For Hebrew (OT books 1-39), use RTL display
			const isHebrewBookChirho = bookChirho.idChirho <= 39;

			for (const [verseIdChirho, verseWordsChirho] of verseGroupsChirho) {
				const verseNumChirho = parseInt(verseIdChirho.slice(-3), 10);
				renderInterlinearVerseChirho(docChirho, verseNumChirho, verseWordsChirho, true, isHebrewBookChirho);

				// Render reference verse text below the interlinear if available
				if (refVersesMapChirho) {
					const refTextChirho = refVersesMapChirho.get(verseIdChirho);
					if (refTextChirho) {
						renderReferenceVerseChirho(docChirho, verseNumChirho, refTextChirho);
					}
				}

				totalVersesChirho++;
				totalWordsChirho += verseWordsChirho.length;
			}

			process.stdout.write(`  ${bookChirho.nameChirho} ${chapterChirho}/${bookChirho.chaptersChirho}\r`);
		}

		if (bookHasContentChirho) {
			console.log(`  ${bookChirho.nameChirho} - complete`);
		}
	}

	// Finalize
	docChirho.end();
	await new Promise<void>((resolveChirho) => docChirho.on('end', resolveChirho));

	// Write file
	const pdfBufferChirho = Buffer.concat(chunksChirho);
	writeFileSyncChirho(outputPathChirho, pdfBufferChirho);

	console.log('');
	console.log('='.repeat(50));
	console.log(`Interlinear Bible PDF generated successfully!`);
	console.log(`  Language: ${languageChirho.nameChirho}`);
	if (refVersionChirho) {
		console.log(`  Reference: ${refVersionChirho.nameChirho}`);
	}
	console.log(`  Verses: ${totalVersesChirho.toLocaleString()}`);
	console.log(`  Words: ${totalWordsChirho.toLocaleString()}`);
	console.log(`  File size: ${(pdfBufferChirho.length / 1024 / 1024).toFixed(2)} MB`);
	console.log(`  Output: ${outputPathChirho}`);
	console.log('='.repeat(50));

	await poolChirho.end();
}

mainChirho().catch((errChirho) => {
	console.error('Error:', errChirho);
	process.exit(1);
});
