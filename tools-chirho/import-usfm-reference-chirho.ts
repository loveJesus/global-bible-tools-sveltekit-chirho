#!/usr/bin/env bun
// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Import USFM Bible files as a reference version
 *
 * Parses USFM files from a directory, strips formatting/footnotes,
 * and inserts verse text into the reference_version_chirho / reference_verse_chirho tables.
 *
 * Usage:
 *   bun run tools-chirho/import-usfm-reference-chirho.ts <usfm_dir> <version_code> <version_name> <language_code> [source]
 *
 * Example:
 *   bun run tools-chirho/import-usfm-reference-chirho.ts \
 *     ../freebibles-hindi-chirho/usfm hinfbi "Hindi Free Bible India" hin "FreeBiblesIndia CC BY-SA 4.0"
 */

import { readdirSync as readdirSyncChirho, readFileSync as readFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';
import pg from 'pg';

const { Pool: PoolChirho } = pg;

const poolChirho = new PoolChirho({
	connectionString: process.env.DATABASE_URL_CHIRHO || 'postgresql://postgres:asdfasdf@localhost:5435/postgres'
});

// USFM file number → our book ID mapping
// Detects numbering scheme at runtime based on files present.
// Sequential (01-66): book ID = file number directly
// Standard USFM (01-39, 41-67): OT direct, NT offset by -1
function buildBookIdMapChirho(fileNumsChirho: number[]): Record<number, number> {
	const mapChirho: Record<number, number> = {};
	const hasFile40Chirho = fileNumsChirho.includes(40);
	const hasFile67Chirho = fileNumsChirho.includes(67);

	if (hasFile40Chirho && !hasFile67Chirho) {
		// Sequential scheme: 1-66 → 1-66
		for (let iChirho = 1; iChirho <= 66; iChirho++) {
			mapChirho[iChirho] = iChirho;
		}
	} else {
		// Standard USFM scheme: OT 1-39 direct, NT 41-67 → 40-66
		for (let iChirho = 1; iChirho <= 39; iChirho++) {
			mapChirho[iChirho] = iChirho;
		}
		for (let iChirho = 41; iChirho <= 67; iChirho++) {
			mapChirho[iChirho] = iChirho - 1;
		}
	}
	return mapChirho;
}
// Placeholder — populated in main after reading file list
let USFM_TO_BOOK_ID_CHIRHO: Record<number, number> = {};

/**
 * Strip USFM formatting markers from verse text, keeping only clean text
 */
function stripUsfmChirho(textChirho: string): string {
	let cleanChirho = textChirho;

	// Remove footnotes: \f ... \f*
	cleanChirho = cleanChirho.replace(/\\f\s.*?\\f\*/gs, '');

	// Remove cross-references: \x ... \x*
	cleanChirho = cleanChirho.replace(/\\x\s.*?\\x\*/gs, '');

	// Remove bold italic markers: \bdit ... \bdit*
	cleanChirho = cleanChirho.replace(/\\bdit\*/g, '');
	cleanChirho = cleanChirho.replace(/\\bdit\b/g, '');

	// Remove italic markers: \it ... \it*
	cleanChirho = cleanChirho.replace(/\\it\*/g, '');
	cleanChirho = cleanChirho.replace(/\\it\b/g, '');

	// Remove bold markers: \bd ... \bd*
	cleanChirho = cleanChirho.replace(/\\bd\*/g, '');
	cleanChirho = cleanChirho.replace(/\\bd\b/g, '');

	// Remove add markers: \add ... \add*
	cleanChirho = cleanChirho.replace(/\\add\*/g, '');
	cleanChirho = cleanChirho.replace(/\\add\b/g, '');

	// Remove word-level markers: \w ... \w*
	cleanChirho = cleanChirho.replace(/\\w\*/g, '');
	cleanChirho = cleanChirho.replace(/\\w\b/g, '');

	// Remove other inline markers
	cleanChirho = cleanChirho.replace(/\\nd\*/g, '');
	cleanChirho = cleanChirho.replace(/\\nd\b/g, '');
	cleanChirho = cleanChirho.replace(/\\wj\*/g, '');
	cleanChirho = cleanChirho.replace(/\\wj\b/g, '');
	cleanChirho = cleanChirho.replace(/\\qs\*/g, '');
	cleanChirho = cleanChirho.replace(/\\qs\b/g, '');
	cleanChirho = cleanChirho.replace(/\\qac\*/g, '');
	cleanChirho = cleanChirho.replace(/\\qac\b/g, '');

	// Remove any remaining backslash markers
	cleanChirho = cleanChirho.replace(/\\[a-z]+\d*\s?/gi, '');

	// Clean up whitespace
	cleanChirho = cleanChirho.replace(/\s+/g, ' ').trim();

	return cleanChirho;
}

interface VerseEntryChirho {
	verseIdChirho: string;
	textChirho: string;
}

/**
 * Parse a single USFM file and extract verses
 */
function parseUsfmFileChirho(filePathChirho: string, bookIdChirho: number): VerseEntryChirho[] {
	const contentChirho = readFileSyncChirho(filePathChirho, 'utf-8');
	const linesChirho = contentChirho.split('\n');
	const versesChirho: VerseEntryChirho[] = [];

	let currentChapterChirho = 0;
	let currentVerseNumChirho = 0;
	let currentVerseTextChirho = '';

	const flushVerseChirho = () => {
		if (currentChapterChirho > 0 && currentVerseNumChirho > 0 && currentVerseTextChirho.trim()) {
			const cleanTextChirho = stripUsfmChirho(currentVerseTextChirho);
			if (cleanTextChirho) {
				const verseIdChirho = `${bookIdChirho.toString().padStart(2, '0')}${currentChapterChirho.toString().padStart(3, '0')}${currentVerseNumChirho.toString().padStart(3, '0')}`;
				versesChirho.push({ verseIdChirho, textChirho: cleanTextChirho });
			}
		}
		currentVerseTextChirho = '';
	};

	for (const lineChirho of linesChirho) {
		const trimmedChirho = lineChirho.trim();

		// Chapter marker
		if (trimmedChirho.startsWith('\\c ')) {
			flushVerseChirho();
			currentChapterChirho = parseInt(trimmedChirho.slice(3).trim(), 10);
			currentVerseNumChirho = 0;
			continue;
		}

		// Verse marker
		const verseMatchChirho = trimmedChirho.match(/^\\v\s+(\d+)\s+(.*)/);
		if (verseMatchChirho) {
			flushVerseChirho();
			currentVerseNumChirho = parseInt(verseMatchChirho[1], 10);
			currentVerseTextChirho = verseMatchChirho[2];
			continue;
		}

		// Skip non-text markers
		if (trimmedChirho.startsWith('\\id ') || trimmedChirho.startsWith('\\ide ') ||
			trimmedChirho.startsWith('\\rem ') || trimmedChirho.startsWith('\\h ') ||
			trimmedChirho.startsWith('\\toc') || trimmedChirho.startsWith('\\mt') ||
			trimmedChirho.startsWith('\\is ') || trimmedChirho.startsWith('\\ip ') ||
			trimmedChirho.startsWith('\\iot') || trimmedChirho.startsWith('\\io') ||
			trimmedChirho.startsWith('\\s ') || trimmedChirho.startsWith('\\s1') ||
			trimmedChirho.startsWith('\\s2') || trimmedChirho.startsWith('\\r ') ||
			trimmedChirho.startsWith('\\d ') || trimmedChirho.startsWith('\\ms') ||
			trimmedChirho.startsWith('\\mr ') || trimmedChirho === '\\p' ||
			trimmedChirho === '\\b' || trimmedChirho === '\\nb' ||
			trimmedChirho.startsWith('\\q') || trimmedChirho.startsWith('\\li') ||
			trimmedChirho === '') {
			continue;
		}

		// Continuation of current verse (text without a marker, or paragraph continuation)
		if (currentVerseNumChirho > 0 && !trimmedChirho.startsWith('\\')) {
			currentVerseTextChirho += ' ' + trimmedChirho;
		}
	}

	// Flush last verse
	flushVerseChirho();

	return versesChirho;
}

/**
 * Main import function
 */
async function mainChirho(): Promise<void> {
	const argsChirho = process.argv.slice(2);

	if (argsChirho.length < 4) {
		console.log('Usage: bun run tools-chirho/import-usfm-reference-chirho.ts <usfm_dir> <version_code> <version_name> <language_code> [source]');
		console.log('');
		console.log('Example:');
		console.log('  bun run tools-chirho/import-usfm-reference-chirho.ts \\');
		console.log('    ../freebibles-hindi-chirho/usfm hinfbi "Hindi Free Bible India" hin "FreeBiblesIndia CC BY-SA 4.0"');
		process.exit(1);
	}

	const usfmDirChirho = argsChirho[0];
	const versionCodeChirho = argsChirho[1];
	const versionNameChirho = argsChirho[2];
	const languageCodeChirho = argsChirho[3];
	const sourceChirho = argsChirho[4] ?? null;

	console.log(`Importing USFM reference version:`);
	console.log(`  Directory: ${usfmDirChirho}`);
	console.log(`  Code: ${versionCodeChirho}`);
	console.log(`  Name: ${versionNameChirho}`);
	console.log(`  Language: ${languageCodeChirho}`);
	console.log(`  Source: ${sourceChirho ?? '(none)'}`);
	console.log('');

	// Create or get the reference version
	const existingChirho = await poolChirho.query(
		`SELECT id_chirho FROM reference_version_chirho WHERE code_chirho = $1`,
		[versionCodeChirho]
	);

	let versionIdChirho: number;
	if (existingChirho.rows.length > 0) {
		versionIdChirho = existingChirho.rows[0].id_chirho;
		console.log(`Using existing reference version ID: ${versionIdChirho}`);
	} else {
		const insertResultChirho = await poolChirho.query(
			`INSERT INTO reference_version_chirho (code_chirho, name_chirho, language_code_chirho, source_chirho)
			 VALUES ($1, $2, $3, $4) RETURNING id_chirho`,
			[versionCodeChirho, versionNameChirho, languageCodeChirho, sourceChirho]
		);
		versionIdChirho = insertResultChirho.rows[0].id_chirho;
		console.log(`Created reference version ID: ${versionIdChirho}`);
	}

	// Read USFM files
	const filesChirho = readdirSyncChirho(usfmDirChirho)
		.filter((fChirho: string) => fChirho.endsWith('.usfm'))
		.sort();

	// Detect numbering scheme from file numbers present
	const fileNumsChirho = filesChirho
		.map((fChirho: string) => {
			const mChirho = fChirho.match(/^(\d+)[_-]/);
			return mChirho ? parseInt(mChirho[1], 10) : 0;
		})
		.filter((nChirho: number) => nChirho > 0);
	USFM_TO_BOOK_ID_CHIRHO = buildBookIdMapChirho(fileNumsChirho);

	console.log(`Found ${filesChirho.length} USFM files`);
	console.log('');

	let totalVersesChirho = 0;
	let totalBooksChirho = 0;

	for (const fileNameChirho of filesChirho) {
		// Extract USFM book number from filename (e.g., "01_GENHIN.usfm" or "01-GENamh.usfm" → 1)
		const numMatchChirho = fileNameChirho.match(/^(\d+)[_-]/);
		if (!numMatchChirho) {
			console.warn(`Skipping unrecognized file: ${fileNameChirho}`);
			continue;
		}

		const usfmNumChirho = parseInt(numMatchChirho[1], 10);
		const bookIdChirho = USFM_TO_BOOK_ID_CHIRHO[usfmNumChirho];
		if (bookIdChirho === undefined) {
			console.warn(`Skipping unknown USFM book number ${usfmNumChirho}: ${fileNameChirho}`);
			continue;
		}

		const filePathChirho = joinChirho(usfmDirChirho, fileNameChirho);
		const rawVersesChirho = parseUsfmFileChirho(filePathChirho, bookIdChirho);

		// Deduplicate verses by verse_id (keep last occurrence)
		const verseMapChirho = new Map<string, VerseEntryChirho>();
		for (const vChirho of rawVersesChirho) {
			verseMapChirho.set(vChirho.verseIdChirho, vChirho);
		}
		const versesChirho = [...verseMapChirho.values()];

		if (versesChirho.length === 0) {
			console.warn(`No verses found in: ${fileNameChirho}`);
			continue;
		}

		// Batch insert verses using ON CONFLICT to handle re-imports
		const batchSizeChirho = 100;
		for (let iChirho = 0; iChirho < versesChirho.length; iChirho += batchSizeChirho) {
			const batchChirho = versesChirho.slice(iChirho, iChirho + batchSizeChirho);

			const valuesChirho: string[] = [];
			const paramsChirho: (string | number)[] = [];
			let paramIdxChirho = 1;

			for (const verseChirho of batchChirho) {
				valuesChirho.push(`($${paramIdxChirho}, $${paramIdxChirho + 1}, $${paramIdxChirho + 2})`);
				paramsChirho.push(versionIdChirho, verseChirho.verseIdChirho, verseChirho.textChirho);
				paramIdxChirho += 3;
			}

			await poolChirho.query(
				`INSERT INTO reference_verse_chirho (version_id_chirho, verse_id_chirho, text_chirho)
				 VALUES ${valuesChirho.join(', ')}
				 ON CONFLICT (version_id_chirho, verse_id_chirho)
				 DO UPDATE SET text_chirho = EXCLUDED.text_chirho`,
				paramsChirho
			);
		}

		totalVersesChirho += versesChirho.length;
		totalBooksChirho++;
		console.log(`  ${fileNameChirho}: ${versesChirho.length} verses (book ID ${bookIdChirho})`);
	}

	console.log('');
	console.log('='.repeat(50));
	console.log(`Import complete!`);
	console.log(`  Version: ${versionNameChirho} (${versionCodeChirho})`);
	console.log(`  Books: ${totalBooksChirho}`);
	console.log(`  Verses: ${totalVersesChirho.toLocaleString()}`);
	console.log(`  Version ID: ${versionIdChirho}`);
	console.log('='.repeat(50));

	await poolChirho.end();
}

mainChirho().catch((errChirho) => {
	console.error('Error:', errChirho);
	process.exit(1);
});
