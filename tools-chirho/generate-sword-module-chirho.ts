// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Generate SWORD module from interlinear glosses in the database
 *
 * Usage: bun run tools-chirho/generate-sword-module-chirho.ts <language_code>
 *
 * Example:
 *   bun run tools-chirho/generate-sword-module-chirho.ts rus
 *   bun run tools-chirho/generate-sword-module-chirho.ts tur
 */

import { Client } from 'pg';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import { join } from 'path';

// Database connection
const pgClientChirho = new Client({
	host: 'localhost',
	port: 5435,
	user: 'postgres',
	password: 'asdfasdf',
	database: 'postgres'
});

// OSIS book IDs mapping
const OSIS_BOOK_IDS_CHIRHO: Record<number, string> = {
	1: 'Gen', 2: 'Exod', 3: 'Lev', 4: 'Num', 5: 'Deut',
	6: 'Josh', 7: 'Judg', 8: 'Ruth', 9: '1Sam', 10: '2Sam',
	11: '1Kgs', 12: '2Kgs', 13: '1Chr', 14: '2Chr',
	15: 'Ezra', 16: 'Neh', 17: 'Esth', 18: 'Job', 19: 'Ps',
	20: 'Prov', 21: 'Eccl', 22: 'Song', 23: 'Isa', 24: 'Jer',
	25: 'Lam', 26: 'Ezek', 27: 'Dan', 28: 'Hos', 29: 'Joel',
	30: 'Amos', 31: 'Obad', 32: 'Jonah', 33: 'Mic', 34: 'Nah',
	35: 'Hab', 36: 'Zeph', 37: 'Hag', 38: 'Zech', 39: 'Mal',
	40: 'Matt', 41: 'Mark', 42: 'Luke', 43: 'John', 44: 'Acts',
	45: 'Rom', 46: '1Cor', 47: '2Cor', 48: 'Gal', 49: 'Eph',
	50: 'Phil', 51: 'Col', 52: '1Thess', 53: '2Thess',
	54: '1Tim', 55: '2Tim', 56: 'Titus', 57: 'Phlm', 58: 'Heb',
	59: 'Jas', 60: '1Pet', 61: '2Pet', 62: '1John', 63: '2John',
	64: '3John', 65: 'Jude', 66: 'Rev'
};

// Language names
const LANGUAGE_NAMES_CHIRHO: Record<string, string> = {
	rus: 'Russian',
	tur: 'Turkish',
	spa: 'Spanish',
	por: 'Portuguese',
	hin: 'Hindi',
	ben: 'Bengali',
	ind: 'Indonesian',
	jav: 'Javanese',
	urd: 'Urdu',
	heb: 'Hebrew',
	eng: 'English'
};

interface WordRowChirho {
	word_id_chirho: string;
	text_chirho: string;
	lemma_id_chirho: string | null;
	gloss_chirho: string | null;
	verse_id_chirho: string;
}

function escapeXmlChirho(textChirho: string): string {
	return textChirho
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function parseVerseIdChirho(verseIdChirho: string): { bookChirho: number; chapterChirho: number; verseChirho: number } {
	// Format: BBCCCVVV (e.g., 01001001 = Gen 1:1)
	const bookChirho = parseInt(verseIdChirho.substring(0, 2), 10);
	const chapterChirho = parseInt(verseIdChirho.substring(2, 5), 10);
	const verseChirho = parseInt(verseIdChirho.substring(5, 8), 10);
	return { bookChirho, chapterChirho, verseChirho };
}

async function generateOsisXmlChirho(langCodeChirho: string): Promise<string> {
	console.log(`Generating OSIS XML for language: ${langCodeChirho}`);

	// Get language info
	const langResultChirho = await pgClientChirho.query(
		`SELECT id, name FROM language WHERE code = $1`,
		[langCodeChirho]
	);

	if (langResultChirho.rows.length === 0) {
		throw new Error(`Language '${langCodeChirho}' not found`);
	}

	const languageChirho = langResultChirho.rows[0];
	console.log(`Found language: ${languageChirho.name} (ID: ${languageChirho.id})`);

	// Get all words with glosses for this language
	// word -> lemma_form -> lemma (for Strong's numbers)
	const wordsResultChirho = await pgClientChirho.query<WordRowChirho>(`
		SELECT
			w.id AS word_id_chirho,
			w.text AS text_chirho,
			lf.lemma_id AS lemma_id_chirho,
			g.gloss AS gloss_chirho,
			w.verse_id AS verse_id_chirho
		FROM word w
		LEFT JOIN lemma_form lf ON lf.id = w.form_id
		LEFT JOIN phrase_word pw ON pw.word_id = w.id
		LEFT JOIN phrase p ON p.id = pw.phrase_id AND p.language_id = $1 AND p.deleted_at IS NULL
		LEFT JOIN gloss g ON g.phrase_id = p.id
		ORDER BY w.id
	`, [languageChirho.id]);

	console.log(`Found ${wordsResultChirho.rows.length} words`);

	// Group words by verse
	const verseMapChirho = new Map<string, WordRowChirho[]>();
	for (const wordChirho of wordsResultChirho.rows) {
		const verseIdChirho = wordChirho.verse_id_chirho;
		if (!verseMapChirho.has(verseIdChirho)) {
			verseMapChirho.set(verseIdChirho, []);
		}
		verseMapChirho.get(verseIdChirho)!.push(wordChirho);
	}

	console.log(`Processing ${verseMapChirho.size} verses`);

	// Generate OSIS XML
	const moduleNameChirho = `LJMTInt${langCodeChirho.charAt(0).toUpperCase()}${langCodeChirho.slice(1)}Chirho`;
	const langNameChirho = LANGUAGE_NAMES_CHIRHO[langCodeChirho] || langCodeChirho;

	let osisChirho = `<?xml version="1.0" encoding="UTF-8"?>
<osis xmlns="http://www.bibletechnologies.net/2003/OSIS/namespace"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.bibletechnologies.net/2003/OSIS/namespace http://www.bibletechnologies.net/osisCore.2.1.1.xsd">
<osisText osisIDWork="${moduleNameChirho}" osisRefWork="bible" xml:lang="${langCodeChirho}">
<header>
  <work osisWork="${moduleNameChirho}">
    <title>Love Jesus Machine Translation Interlinear - ${langNameChirho}</title>
    <identifier type="OSIS">${moduleNameChirho}</identifier>
    <refSystem>Bible.KJV</refSystem>
  </work>
</header>
`;

	// Process by book
	let currentBookChirho = 0;
	let currentChapterChirho = 0;

	// Sort verse IDs
	const sortedVerseIdsChirho = Array.from(verseMapChirho.keys()).sort();

	for (const verseIdChirho of sortedVerseIdsChirho) {
		const { bookChirho, chapterChirho, verseChirho } = parseVerseIdChirho(verseIdChirho);
		const osisBookChirho = OSIS_BOOK_IDS_CHIRHO[bookChirho];

		if (!osisBookChirho) continue;

		// New book
		if (bookChirho !== currentBookChirho) {
			if (currentChapterChirho > 0) {
				osisChirho += `</chapter>\n`;
			}
			if (currentBookChirho > 0) {
				osisChirho += `</div>\n`;
			}
			osisChirho += `<div type="book" osisID="${osisBookChirho}">\n`;
			currentBookChirho = bookChirho;
			currentChapterChirho = 0;
		}

		// New chapter
		if (chapterChirho !== currentChapterChirho) {
			if (currentChapterChirho > 0) {
				osisChirho += `</chapter>\n`;
			}
			osisChirho += `<chapter osisID="${osisBookChirho}.${chapterChirho}">\n`;
			currentChapterChirho = chapterChirho;
		}

		// Generate verse content with interlinear markup
		const wordsChirho = verseMapChirho.get(verseIdChirho)!;
		let verseContentChirho = '';

		for (const wordChirho of wordsChirho) {
			const originalTextChirho = escapeXmlChirho(wordChirho.text_chirho || '');
			const glossChirho = wordChirho.gloss_chirho ? escapeXmlChirho(wordChirho.gloss_chirho) : originalTextChirho;
			const lemmaChirho = wordChirho.lemma_id_chirho || '';

			// Build word element with Strong's and gloss
			if (lemmaChirho) {
				const strongsPrefixChirho = lemmaChirho.startsWith('H') ? 'strong:H' : 'strong:G';
				const strongsNumChirho = lemmaChirho.substring(1);
				verseContentChirho += `<w lemma="${strongsPrefixChirho}${strongsNumChirho}" gloss="${glossChirho}">${originalTextChirho}</w> `;
			} else {
				verseContentChirho += `<w gloss="${glossChirho}">${originalTextChirho}</w> `;
			}
		}

		osisChirho += `<verse osisID="${osisBookChirho}.${chapterChirho}.${verseChirho}">${verseContentChirho.trim()}</verse>\n`;
	}

	// Close remaining tags
	if (currentChapterChirho > 0) {
		osisChirho += `</chapter>\n`;
	}
	if (currentBookChirho > 0) {
		osisChirho += `</div>\n`;
	}

	osisChirho += `</osisText>
</osis>`;

	return osisChirho;
}

function generateConfFileChirho(langCodeChirho: string): string {
	const moduleNameChirho = `LJMTInt${langCodeChirho.charAt(0).toUpperCase()}${langCodeChirho.slice(1)}Chirho`;
	const langNameChirho = LANGUAGE_NAMES_CHIRHO[langCodeChirho] || langCodeChirho;
	const dateChirho = new Date().toISOString().split('T')[0];

	return `[${moduleNameChirho}]
DataPath=./modules/texts/ztext/${moduleNameChirho}/
ModDrv=zText
SourceType=OSIS
Encoding=UTF-8
CompressType=ZIP
BlockType=BOOK
Versification=KJV

# Module Information
Description=Love Jesus Machine Translation Interlinear - ${langNameChirho}
About=Word-by-word interlinear Bible translation from Greek/Hebrew.\\par\\par\\
Includes Strong's numbers, morphology codes, and ${langNameChirho} glosses for each word.\\par\\par\\
Generated by Love Jesus (https://sword-modules-chirho.bible.systems)\\par\\
66 books, 31102 verses translated.\\par\\par\\
Creative Commons Attribution 4.0 International License

# Language
Lang=${langCodeChirho}
LangSortOrder=${langCodeChirho}

# Version and Updates
Version=1.0
SwordVersionDate=${dateChirho}
MinimumVersion=1.7.0

# Features - Enable Strong's and morphology display
Feature=StrongsNumbers
GlobalOptionFilter=OSISStrongs
GlobalOptionFilter=OSISMorph
GlobalOptionFilter=OSISLemma
GlobalOptionFilter=OSISGlosses

# Distribution
DistributionLicense=Creative Commons: by 4.0
DistributionSource=https://sword-modules-chirho.bible.systems
TextSource=Love Jesus Project

# Category
Category=Biblical Texts
`;
}

async function mainChirho() {
	const langCodeChirho = process.argv[2];

	if (!langCodeChirho) {
		console.log('Usage: bun run tools-chirho/generate-sword-module-chirho.ts <language_code>');
		console.log('Example: bun run tools-chirho/generate-sword-module-chirho.ts rus');
		process.exit(1);
	}

	const swordRepoPathChirho = '/Volumes/ENC_4TB_WDB_CHIRHO/dev-aleluya/friends-aleluya/andrewbeth-chirho/platform-chirho/sword-repo-chirho';
	const moduleNameChirho = `LJMTInt${langCodeChirho.charAt(0).toUpperCase()}${langCodeChirho.slice(1)}Chirho`;

	try {
		await pgClientChirho.connect();
		console.log('Connected to database');

		// Generate OSIS XML
		const osisXmlChirho = await generateOsisXmlChirho(langCodeChirho);

		// Write OSIS XML to temp file
		const osisPathChirho = `/tmp/${moduleNameChirho}.xml`;
		writeFileSync(osisPathChirho, osisXmlChirho);
		console.log(`Wrote OSIS XML to ${osisPathChirho}`);

		// Create module directory
		const modulePathChirho = join(swordRepoPathChirho, 'modules', 'texts', 'ztext', moduleNameChirho);
		if (!existsSync(modulePathChirho)) {
			mkdirSync(modulePathChirho, { recursive: true });
		}

		// Run osis2mod using execFileSync (safe - no shell injection)
		// -z z = ZIP compression, -b 4 = book-level blocks
		console.log('Running osis2mod...');
		execFileSync('/opt/homebrew/bin/osis2mod', [modulePathChirho, osisPathChirho, '-z', 'z', '-b', '4'], { stdio: 'inherit' });
		console.log('osis2mod completed');

		// Generate and write conf file
		const confContentChirho = generateConfFileChirho(langCodeChirho);
		const confPathChirho = join(swordRepoPathChirho, 'mods.d', `${moduleNameChirho.toLowerCase()}.conf`);
		writeFileSync(confPathChirho, confContentChirho);
		console.log(`Wrote conf file to ${confPathChirho}`);

		// Create zip file for raw downloads using execFileSync
		const rawPathChirho = join(swordRepoPathChirho, 'raw');
		if (!existsSync(rawPathChirho)) {
			mkdirSync(rawPathChirho, { recursive: true });
		}
		const zipPathChirho = join(rawPathChirho, `${moduleNameChirho}.zip`);
		execFileSync('/usr/bin/zip', ['-r', zipPathChirho, `mods.d/${moduleNameChirho.toLowerCase()}.conf`, `modules/texts/ztext/${moduleNameChirho}/`], { cwd: swordRepoPathChirho, stdio: 'inherit' });
		console.log(`Created zip file: ${zipPathChirho}`);

		// Update mods.d.tar.gz using execFileSync
		console.log('Updating mods.d.tar.gz...');
		execFileSync('/usr/bin/tar', ['-czf', 'mods.d.tar.gz', 'mods.d/'], { cwd: swordRepoPathChirho, stdio: 'inherit' });
		console.log('Updated mods.d.tar.gz');

		console.log(`\n✓ SWORD module ${moduleNameChirho} generated successfully!`);
		console.log(`  Module path: ${modulePathChirho}`);
		console.log(`  Conf file: ${confPathChirho}`);
		console.log(`  Zip file: ${zipPathChirho}`);

	} catch (errorChirho) {
		console.error('Error:', errorChirho);
		process.exit(1);
	} finally {
		await pgClientChirho.end();
	}
}

mainChirho();
