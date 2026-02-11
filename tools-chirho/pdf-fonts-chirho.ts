// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Shared PDF font utilities for CLI tools
 * Supports all international scripts: Bengali, Hindi, Arabic, Thai, CJK, etc.
 *
 * This is a standalone version that doesn't depend on SvelteKit.
 */

import PdfDocumentChirho from 'pdfkit';
import { readFileSync as readFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';

// Type aliases
type PdfDocumentOptionsChirho = ConstructorParameters<typeof PdfDocumentChirho>[0];
type PdfDocumentInstanceChirho = InstanceType<typeof PdfDocumentChirho>;

// Load fonts for Greek/Hebrew/Arabic/international support
const FONT_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSans-Regular.ttf');
const FONT_BOLD_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSans-Bold.ttf');
const FONT_HEBREW_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/EzraSIL-Regular.ttf');
const FONT_ARABIC_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoNaskhArabic-Regular.ttf');
const FONT_HEBREW_ALT_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansHebrew-Regular.ttf');
const FONT_THAI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansThai-Regular.ttf');
const FONT_DEVANAGARI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansDevanagari-Regular.ttf');
const FONT_BENGALI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansBengali-Regular.ttf');
const FONT_MYANMAR_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansMyanmar-Regular.ttf');
const FONT_CJK_SC_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKsc-Regular.otf');
const FONT_GUJARATI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGujarati-Regular.ttf');
const FONT_CJK_JP_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKjp-Regular.otf');
const FONT_CJK_KR_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKkr-Regular.otf');
const FONT_TAMIL_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansTamil-Regular.ttf');
const FONT_URDU_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoNastaliqUrdu-Regular.ttf');
const FONT_GURMUKHI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGurmukhi-Regular.ttf');
const FONT_ETHIOPIC_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansEthiopic-Regular.ttf');
const FONT_ETHIOPIC_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansEthiopicMergedChirho.ttf');

let notoFontChirho: Buffer | null = null;
let notoBoldFontChirho: Buffer | null = null;
let hebrewFontChirho: Buffer | null = null;
let arabicFontChirho: Buffer | null = null;
let hebrewAltFontChirho: Buffer | null = null;
let thaiFontChirho: Buffer | null = null;
let devanagariFontChirho: Buffer | null = null;
let bengaliFontChirho: Buffer | null = null;
let myanmarFontChirho: Buffer | null = null;
let cjkScFontChirho: Buffer | null = null;
let cjkJpFontChirho: Buffer | null = null;
let cjkKrFontChirho: Buffer | null = null;
let gujaratiFontChirho: Buffer | null = null;
let tamilFontChirho: Buffer | null = null;
let urduFontChirho: Buffer | null = null;
let gurmukhiFontChirho: Buffer | null = null;
let ethiopicFontChirho: Buffer | null = null;
let ethiopicMergedFontChirho: Buffer | null = null;

function loadFontSafelyChirho(pathChirho: string, nameChirho: string): Buffer | null {
	try {
		return readFileSyncChirho(pathChirho);
	} catch {
		console.warn(`${nameChirho} font not found at ${pathChirho}`);
		return null;
	}
}

// Load all fonts at module initialization
notoFontChirho = loadFontSafelyChirho(FONT_PATH_CHIRHO, 'Noto Sans');
notoBoldFontChirho = loadFontSafelyChirho(FONT_BOLD_PATH_CHIRHO, 'Noto Sans Bold');
hebrewFontChirho = loadFontSafelyChirho(FONT_HEBREW_PATH_CHIRHO, 'Ezra SIL Hebrew');
arabicFontChirho = loadFontSafelyChirho(FONT_ARABIC_PATH_CHIRHO, 'Noto Naskh Arabic');
hebrewAltFontChirho = loadFontSafelyChirho(FONT_HEBREW_ALT_PATH_CHIRHO, 'Noto Sans Hebrew');
thaiFontChirho = loadFontSafelyChirho(FONT_THAI_PATH_CHIRHO, 'Noto Sans Thai');
devanagariFontChirho = loadFontSafelyChirho(FONT_DEVANAGARI_PATH_CHIRHO, 'Noto Sans Devanagari');
bengaliFontChirho = loadFontSafelyChirho(FONT_BENGALI_PATH_CHIRHO, 'Noto Sans Bengali');
myanmarFontChirho = loadFontSafelyChirho(FONT_MYANMAR_PATH_CHIRHO, 'Noto Sans Myanmar');
cjkScFontChirho = loadFontSafelyChirho(FONT_CJK_SC_PATH_CHIRHO, 'Noto Sans CJK SC');
cjkJpFontChirho = loadFontSafelyChirho(FONT_CJK_JP_PATH_CHIRHO, 'Noto Sans CJK JP');
cjkKrFontChirho = loadFontSafelyChirho(FONT_CJK_KR_PATH_CHIRHO, 'Noto Sans CJK KR');
gujaratiFontChirho = loadFontSafelyChirho(FONT_GUJARATI_PATH_CHIRHO, 'Noto Sans Gujarati');
tamilFontChirho = loadFontSafelyChirho(FONT_TAMIL_PATH_CHIRHO, 'Noto Sans Tamil');
urduFontChirho = loadFontSafelyChirho(FONT_URDU_PATH_CHIRHO, 'Noto Nastaliq Urdu');
gurmukhiFontChirho = loadFontSafelyChirho(FONT_GURMUKHI_PATH_CHIRHO, 'Noto Sans Gurmukhi');
ethiopicFontChirho = loadFontSafelyChirho(FONT_ETHIOPIC_PATH_CHIRHO, 'Noto Sans Ethiopic');
ethiopicMergedFontChirho = loadFontSafelyChirho(FONT_ETHIOPIC_MERGED_PATH_CHIRHO, 'Noto Sans Ethiopic Merged');

// Export types
export interface WordRowChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
	verseIdChirho: string;
}

/**
 * Strip Private Use Area (PUA) characters from text
 */
export function stripPuaChirho(textChirho: string): string {
	return textChirho.replace(/[\uE000-\uF8FF]|[\uDB80-\uDBFF][\uDC00-\uDFFF]/g, '');
}

/**
 * Check if text contains Hebrew characters
 */
export function isHebrewTextChirho(textChirho: string): boolean {
	return /[\u0590-\u05FF]/.test(textChirho);
}

/**
 * Check if text contains Arabic characters
 */
export function isArabicTextChirho(textChirho: string): boolean {
	return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(textChirho);
}

/**
 * Check if text contains Thai characters
 */
export function isThaiTextChirho(textChirho: string): boolean {
	return /[\u0E00-\u0E7F]/.test(textChirho);
}

/**
 * Check if text contains Devanagari characters (Hindi)
 */
export function isDevanagariTextChirho(textChirho: string): boolean {
	return /[\u0900-\u097F]/.test(textChirho);
}

/**
 * Check if text contains Bengali characters
 */
export function isBengaliTextChirho(textChirho: string): boolean {
	return /[\u0980-\u09FF]/.test(textChirho);
}

/**
 * Check if text contains Myanmar characters
 */
export function isMyanmarTextChirho(textChirho: string): boolean {
	return /[\u1000-\u109F]/.test(textChirho);
}

/**
 * Check if text contains Japanese characters
 */
export function isJapaneseTextChirho(textChirho: string): boolean {
	return /[\u3040-\u309F\u30A0-\u30FF]/.test(textChirho);
}

/**
 * Check if text contains Korean characters
 */
export function isKoreanTextChirho(textChirho: string): boolean {
	return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(textChirho);
}

/**
 * Check if text contains CJK characters
 */
export function isCjkTextChirho(textChirho: string): boolean {
	return /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/.test(textChirho);
}

/**
 * Check if text contains Gujarati characters
 */
export function isGujaratiTextChirho(textChirho: string): boolean {
	return /[\u0A80-\u0AFF]/.test(textChirho);
}

/**
 * Check if text contains Tamil characters
 */
export function isTamilTextChirho(textChirho: string): boolean {
	return /[\u0B80-\u0BFF]/.test(textChirho);
}

/**
 * Check if text contains Urdu-specific characters
 */
export function isUrduTextChirho(textChirho: string): boolean {
	return /[\u0679\u0688\u0691\u06BA\u06BE\u06CC\u06D2]/.test(textChirho);
}

/**
 * Check if text contains Gurmukhi characters
 */
export function isGurmukhiTextChirho(textChirho: string): boolean {
	return /[\u0A00-\u0A7F]/.test(textChirho);
}

/**
 * Check if text contains Ethiopic characters
 */
export function isEthiopicTextChirho(textChirho: string): boolean {
	return /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]/.test(textChirho);
}

/**
 * Get the main font name
 */
export function getMainFontChirho(): string {
	return notoFontChirho ? 'NotoSans' : 'Helvetica';
}

/**
 * Get the bold font name
 */
export function getBoldFontChirho(): string {
	return notoBoldFontChirho ? 'NotoSansBold' : 'Helvetica-Bold';
}

/**
 * Get appropriate font for text based on script detection
 */
export function getFontForTextChirho(textChirho: string): string {
	if (isHebrewTextChirho(textChirho)) {
		return hebrewFontChirho ? 'EzraSIL' : (hebrewAltFontChirho ? 'NotoSansHebrew' : getMainFontChirho());
	}
	if (isUrduTextChirho(textChirho)) {
		// Use Naskh Arabic font for Urdu (Nastaliq causes memory issues in pdfkit)
		return arabicFontChirho ? 'NotoNaskhArabic' : getMainFontChirho();
	}
	if (isArabicTextChirho(textChirho)) {
		return arabicFontChirho ? 'NotoNaskhArabic' : getMainFontChirho();
	}
	if (isThaiTextChirho(textChirho)) {
		return thaiFontChirho ? 'NotoSansThai' : getMainFontChirho();
	}
	if (isDevanagariTextChirho(textChirho)) {
		return devanagariFontChirho ? 'NotoSansDevanagari' : getMainFontChirho();
	}
	if (isBengaliTextChirho(textChirho)) {
		return bengaliFontChirho ? 'NotoSansBengali' : getMainFontChirho();
	}
	if (isMyanmarTextChirho(textChirho)) {
		return myanmarFontChirho ? 'NotoSansMyanmar' : getMainFontChirho();
	}
	if (isJapaneseTextChirho(textChirho)) {
		return cjkJpFontChirho ? 'NotoSansCJKjp' : (cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho());
	}
	if (isKoreanTextChirho(textChirho)) {
		return cjkKrFontChirho ? 'NotoSansCJKkr' : (cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho());
	}
	if (isCjkTextChirho(textChirho)) {
		return cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho();
	}
	if (isGujaratiTextChirho(textChirho)) {
		return gujaratiFontChirho ? 'NotoSansGujarati' : getMainFontChirho();
	}
	if (isTamilTextChirho(textChirho)) {
		return tamilFontChirho ? 'NotoSansTamil' : getMainFontChirho();
	}
	if (isGurmukhiTextChirho(textChirho)) {
		return gurmukhiFontChirho ? 'NotoSansGurmukhi' : getMainFontChirho();
	}
	if (isEthiopicTextChirho(textChirho)) {
		return ethiopicMergedFontChirho ? 'NotoSansEthiopicMergedChirho' : (ethiopicFontChirho ? 'NotoSansEthiopic' : getMainFontChirho());
	}
	return getMainFontChirho();
}

/**
 * Sanitize text for non-Latin fonts (Bengali, Urdu, Arabic, etc.)
 * These fonts often lack Latin punctuation glyphs, causing blocks to render.
 * Replace Latin punctuation with spaces or script-appropriate alternatives.
 */
export function sanitizeForNonLatinFontChirho(textChirho: string): string {
	return textChirho
		// Dashes to space
		.replace(/[\u2013\u2014\u2012\u2015]/g, ' ')  // en-dash, em-dash, figure dash, horizontal bar
		.replace(/-/g, ' ')  // ASCII hyphen-minus
		// Commas to space (Latin comma not in many non-Latin fonts)
		.replace(/,/g, ' ')
		// Semicolons and colons to space
		.replace(/[;:]/g, ' ')
		// Parentheses to space
		.replace(/[()[\]{}]/g, ' ')
		// Quotation marks to space
		.replace(/["'""''«»]/g, ' ')
		// Ellipsis to space
		.replace(/…/g, ' ')
		// Collapse multiple spaces
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Legacy alias for backwards compatibility
 */
export function sanitizeForArabicFontChirho(textChirho: string): string {
	return sanitizeForNonLatinFontChirho(textChirho);
}

/**
 * Check if text is RTL (Arabic, Urdu, or Hebrew script)
 */
export function isRtlTextChirho(textChirho: string): boolean {
	return isArabicTextChirho(textChirho) || isUrduTextChirho(textChirho) || isHebrewTextChirho(textChirho);
}

/**
 * Get Strong's link for BibleHub
 */
export function getStrongLinkChirho(lemmaIdChirho: string | null): string | null {
	if (!lemmaIdChirho) return null;
	const matchChirho = lemmaIdChirho.match(/^([HG])(\d+)$/);
	if (!matchChirho) return null;
	const [, prefixChirho, numberStrChirho] = matchChirho;
	const langChirho = prefixChirho === 'H' ? 'hebrew' : 'greek';
	const numberChirho = parseInt(numberStrChirho, 10);
	return `https://biblehub.com/${langChirho}/${numberChirho}.htm`;
}

/**
 * Create a PDF document with all fonts registered
 */
export function createPdfDocumentChirho(optionsChirho: PdfDocumentOptionsChirho = {}): PdfDocumentInstanceChirho {
	const docChirho = new PdfDocumentChirho({
		size: 'A4',
		margins: { top: 50, bottom: 50, left: 50, right: 50 },
		bufferPages: true,
		...optionsChirho
	});

	// Register all fonts
	if (notoFontChirho) docChirho.registerFont('NotoSans', notoFontChirho);
	if (notoBoldFontChirho) docChirho.registerFont('NotoSansBold', notoBoldFontChirho);
	if (hebrewFontChirho) docChirho.registerFont('EzraSIL', hebrewFontChirho);
	if (arabicFontChirho) docChirho.registerFont('NotoNaskhArabic', arabicFontChirho);
	if (hebrewAltFontChirho) docChirho.registerFont('NotoSansHebrew', hebrewAltFontChirho);
	if (thaiFontChirho) docChirho.registerFont('NotoSansThai', thaiFontChirho);
	if (devanagariFontChirho) docChirho.registerFont('NotoSansDevanagari', devanagariFontChirho);
	if (bengaliFontChirho) docChirho.registerFont('NotoSansBengali', bengaliFontChirho);
	if (myanmarFontChirho) docChirho.registerFont('NotoSansMyanmar', myanmarFontChirho);
	if (cjkScFontChirho) docChirho.registerFont('NotoSansCJKsc', cjkScFontChirho);
	if (cjkJpFontChirho) docChirho.registerFont('NotoSansCJKjp', cjkJpFontChirho);
	if (cjkKrFontChirho) docChirho.registerFont('NotoSansCJKkr', cjkKrFontChirho);
	if (gujaratiFontChirho) docChirho.registerFont('NotoSansGujarati', gujaratiFontChirho);
	if (tamilFontChirho) docChirho.registerFont('NotoSansTamil', tamilFontChirho);
	if (urduFontChirho) docChirho.registerFont('NotoNastaliqUrdu', urduFontChirho);
	if (gurmukhiFontChirho) docChirho.registerFont('NotoSansGurmukhi', gurmukhiFontChirho);
	if (ethiopicFontChirho) docChirho.registerFont('NotoSansEthiopic', ethiopicFontChirho);
	if (ethiopicMergedFontChirho) docChirho.registerFont('NotoSansEthiopicMergedChirho', ethiopicMergedFontChirho);

	return docChirho;
}
