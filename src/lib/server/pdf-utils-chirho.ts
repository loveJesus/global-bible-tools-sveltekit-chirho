// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

/**
 * Shared PDF font utilities
 *
 * This module is the single source of truth for PDF font handling.
 * Used by both:
 *   - SvelteKit server endpoints (src/lib/server/pdf-generator-chirho.ts)
 *   - CLI tools (tools-chirho/generate-interlinear-bible-pdf-chirho.ts)
 *
 * Supports all international scripts: Bengali, Hindi, Arabic, Urdu, Thai, CJK, etc.
 */

import * as PdfKitModuleChirho from 'pdfkit';
const PdfDocumentChirho = PdfKitModuleChirho.default || PdfKitModuleChirho;
import { readFileSync as readFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';

// Type aliases
type PdfDocumentOptionsChirho = ConstructorParameters<typeof PdfDocumentChirho>[0];
type PdfDocumentInstanceChirho = InstanceType<typeof PdfDocumentChirho>;

// Font paths - all relative to process.cwd() (sveltekit2-platform-chirho/)
const FONT_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSans-Regular.ttf');
const FONT_BOLD_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSans-Bold.ttf');
const FONT_HEBREW_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/EzraSIL-Regular.ttf');
const FONT_HEBREW_ALT_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansHebrew-Regular.ttf');
const FONT_THAI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansThai-Regular.ttf');
const FONT_MYANMAR_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansMyanmar-Regular.ttf');
const FONT_CJK_SC_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKsc-Regular.otf');
const FONT_GUJARATI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGujarati-Regular.ttf');
const FONT_CJK_JP_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKjp-Regular.otf');
const FONT_CJK_KR_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansCJKkr-Regular.otf');
const FONT_TAMIL_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansTamil-Regular.ttf');
const FONT_TELUGU_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansTelugu-Regular.ttf');
const FONT_GURMUKHI_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGurmukhi-Regular.ttf');
const FONT_ETHIOPIC_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansEthiopic-Regular.ttf');
// Merged fonts with Latin glyphs (no tofu for punctuation)
const FONT_NASKH_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoNaskhMergedChirho.ttf');
const FONT_BENGALI_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansBengaliMergedChirho.ttf');
const FONT_DEVANAGARI_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansDevanagariMergedChirho.ttf');
const FONT_THAI_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansThaiMergedChirho.ttf');
const FONT_MYANMAR_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansMyanmarMergedChirho.ttf');
const FONT_GUJARATI_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGujaratiMergedChirho.ttf');
const FONT_TAMIL_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansTamilMergedChirho.ttf');
const FONT_GURMUKHI_MERGED_PATH_CHIRHO = joinChirho(process.cwd(), 'static/fonts-chirho/NotoSansGurmukhiMergedChirho.ttf');

// Font buffers (loaded once at module initialization)
let notoFontChirho: Buffer | null = null;
let notoBoldFontChirho: Buffer | null = null;
let hebrewFontChirho: Buffer | null = null;
let hebrewAltFontChirho: Buffer | null = null;
let thaiFontChirho: Buffer | null = null;
let myanmarFontChirho: Buffer | null = null;
let cjkScFontChirho: Buffer | null = null;
let cjkJpFontChirho: Buffer | null = null;
let cjkKrFontChirho: Buffer | null = null;
let gujaratiFontChirho: Buffer | null = null;
let tamilFontChirho: Buffer | null = null;
let teluguFontChirho: Buffer | null = null;
let gurmukhiFontChirho: Buffer | null = null;
let ethiopicFontChirho: Buffer | null = null;
// Merged fonts with Latin glyphs
let naskhMergedFontChirho: Buffer | null = null;
let bengaliMergedFontChirho: Buffer | null = null;
let devanagariMergedFontChirho: Buffer | null = null;
let thaiMergedFontChirho: Buffer | null = null;
let myanmarMergedFontChirho: Buffer | null = null;
let gujaratiMergedFontChirho: Buffer | null = null;
let tamilMergedFontChirho: Buffer | null = null;
let gurmukhiMergedFontChirho: Buffer | null = null;

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
hebrewAltFontChirho = loadFontSafelyChirho(FONT_HEBREW_ALT_PATH_CHIRHO, 'Noto Sans Hebrew');
thaiFontChirho = loadFontSafelyChirho(FONT_THAI_PATH_CHIRHO, 'Noto Sans Thai');
myanmarFontChirho = loadFontSafelyChirho(FONT_MYANMAR_PATH_CHIRHO, 'Noto Sans Myanmar');
cjkScFontChirho = loadFontSafelyChirho(FONT_CJK_SC_PATH_CHIRHO, 'Noto Sans CJK SC');
cjkJpFontChirho = loadFontSafelyChirho(FONT_CJK_JP_PATH_CHIRHO, 'Noto Sans CJK JP');
cjkKrFontChirho = loadFontSafelyChirho(FONT_CJK_KR_PATH_CHIRHO, 'Noto Sans CJK KR');
gujaratiFontChirho = loadFontSafelyChirho(FONT_GUJARATI_PATH_CHIRHO, 'Noto Sans Gujarati');
tamilFontChirho = loadFontSafelyChirho(FONT_TAMIL_PATH_CHIRHO, 'Noto Sans Tamil');
teluguFontChirho = loadFontSafelyChirho(FONT_TELUGU_PATH_CHIRHO, 'Noto Sans Telugu');
gurmukhiFontChirho = loadFontSafelyChirho(FONT_GURMUKHI_PATH_CHIRHO, 'Noto Sans Gurmukhi');
ethiopicFontChirho = loadFontSafelyChirho(FONT_ETHIOPIC_PATH_CHIRHO, 'Noto Sans Ethiopic');
// Merged fonts with Latin glyphs (no tofu)
naskhMergedFontChirho = loadFontSafelyChirho(FONT_NASKH_MERGED_PATH_CHIRHO, 'Noto Naskh Merged');
bengaliMergedFontChirho = loadFontSafelyChirho(FONT_BENGALI_MERGED_PATH_CHIRHO, 'Noto Sans Bengali Merged');
devanagariMergedFontChirho = loadFontSafelyChirho(FONT_DEVANAGARI_MERGED_PATH_CHIRHO, 'Noto Sans Devanagari Merged');
thaiMergedFontChirho = loadFontSafelyChirho(FONT_THAI_MERGED_PATH_CHIRHO, 'Noto Sans Thai Merged');
myanmarMergedFontChirho = loadFontSafelyChirho(FONT_MYANMAR_MERGED_PATH_CHIRHO, 'Noto Sans Myanmar Merged');
gujaratiMergedFontChirho = loadFontSafelyChirho(FONT_GUJARATI_MERGED_PATH_CHIRHO, 'Noto Sans Gujarati Merged');
tamilMergedFontChirho = loadFontSafelyChirho(FONT_TAMIL_MERGED_PATH_CHIRHO, 'Noto Sans Tamil Merged');
gurmukhiMergedFontChirho = loadFontSafelyChirho(FONT_GURMUKHI_MERGED_PATH_CHIRHO, 'Noto Sans Gurmukhi Merged');

// ============================================================================
// Exported Types
// ============================================================================

export interface WordRowChirho {
	wordIdChirho: string;
	textChirho: string;
	lemmaIdChirho: string | null;
	glossChirho: string | null;
	verseIdChirho: string;
}

// ============================================================================
// Text Sanitization Functions
// ============================================================================

/**
 * Strip Private Use Area (PUA) characters from text
 * These are custom characters that won't render in standard fonts
 */
export function stripPuaChirho(textChirho: string): string {
	return textChirho.replace(/[\uE000-\uF8FF]|[\uDB80-\uDBFF][\uDC00-\uDFFF]/g, '');
}

/**
 * Sanitize text for Arabic/Urdu - converts to native Arabic punctuation and numerals.
 *
 * For Arabic/Urdu: converts punctuation and numerals to native equivalents (،؛؟۔۰-۹).
 * For other scripts: uses merged fonts with Latin glyphs, no sanitization needed.
 *
 * Apply this to glosses and reference text when rendering with Arabic/Urdu fonts.
 */
export function sanitizeForNonLatinFontChirho(textChirho: string): string {
	// Check if this is Arabic/Urdu text - use native replacements
	const isArabicUrduChirho = isArabicTextChirho(textChirho) || isUrduTextChirho(textChirho);

	if (!isArabicUrduChirho) {
		// Bengali, Devanagari, and other scripts now use merged fonts with Latin glyphs
		// Only strip PUA characters
		return stripPuaChirho(textChirho);
	}

	// Convert Latin punctuation to Arabic equivalents for Arabic/Urdu
	return textChirho
		// Comma to Arabic comma ،
		.replace(/,/g, '\u060C')
		// Semicolon to Arabic semicolon ؛
		.replace(/;/g, '\u061B')
		// Question mark to Arabic question mark ؟
		.replace(/\?/g, '\u061F')
		// Period to Arabic full stop ۔
		.replace(/\./g, '\u06D4')
		// Colon to Arabic colon (U+061C is not used, keep as-is since merged font has it)
		// Latin numbers to Extended Arabic-Indic numerals (۰۱۲۳۴۵۶۷۸۹)
		.replace(/0/g, '\u06F0')
		.replace(/1/g, '\u06F1')
		.replace(/2/g, '\u06F2')
		.replace(/3/g, '\u06F3')
		.replace(/4/g, '\u06F4')
		.replace(/5/g, '\u06F5')
		.replace(/6/g, '\u06F6')
		.replace(/7/g, '\u06F7')
		.replace(/8/g, '\u06F8')
		.replace(/9/g, '\u06F9');
}

/**
 * Check if text needs Arabic/Urdu punctuation conversion.
 *
 * Bengali, Devanagari, and other scripts now use merged fonts with Latin glyphs,
 * so only Arabic/Urdu need punctuation conversion to native equivalents.
 */
export function needsNonLatinSanitizationChirho(textChirho: string): boolean {
	return isArabicTextChirho(textChirho) || isUrduTextChirho(textChirho);
}

/**
 * Sanitize gloss text - applies non-Latin sanitization if needed
 */
export function sanitizeGlossChirho(textChirho: string): string {
	const cleanedChirho = stripPuaChirho(textChirho);
	if (needsNonLatinSanitizationChirho(cleanedChirho)) {
		return sanitizeForNonLatinFontChirho(cleanedChirho);
	}
	return cleanedChirho;
}

// ============================================================================
// Script Detection Functions
// ============================================================================

export function isHebrewTextChirho(textChirho: string): boolean {
	return /[\u0590-\u05FF]/.test(textChirho);
}

export function isArabicTextChirho(textChirho: string): boolean {
	return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(textChirho);
}

/**
 * Check if text contains Urdu-specific characters
 * Urdu uses Arabic script but has unique letters: ٹ ڈ ڑ ں ھ ی ے
 */
export function isUrduTextChirho(textChirho: string): boolean {
	return /[\u0679\u0688\u0691\u06BA\u06BE\u06CC\u06D2]/.test(textChirho);
}

export function isThaiTextChirho(textChirho: string): boolean {
	return /[\u0E00-\u0E7F]/.test(textChirho);
}

export function isDevanagariTextChirho(textChirho: string): boolean {
	return /[\u0900-\u097F]/.test(textChirho);
}

export function isBengaliTextChirho(textChirho: string): boolean {
	return /[\u0980-\u09FF]/.test(textChirho);
}

export function isMyanmarTextChirho(textChirho: string): boolean {
	return /[\u1000-\u109F]/.test(textChirho);
}

export function isJapaneseTextChirho(textChirho: string): boolean {
	return /[\u3040-\u309F\u30A0-\u30FF]/.test(textChirho);
}

export function isKoreanTextChirho(textChirho: string): boolean {
	return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(textChirho);
}

export function isCjkTextChirho(textChirho: string): boolean {
	return /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/.test(textChirho);
}

export function isGujaratiTextChirho(textChirho: string): boolean {
	return /[\u0A80-\u0AFF]/.test(textChirho);
}

export function isTamilTextChirho(textChirho: string): boolean {
	return /[\u0B80-\u0BFF]/.test(textChirho);
}

export function isTeluguTextChirho(textChirho: string): boolean {
	return /[\u0C00-\u0C7F]/.test(textChirho);
}

export function isGurmukhiTextChirho(textChirho: string): boolean {
	return /[\u0A00-\u0A7F]/.test(textChirho);
}

export function isEthiopicTextChirho(textChirho: string): boolean {
	return /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]/.test(textChirho);
}

/**
 * Check if text is RTL (Arabic, Urdu, or Hebrew script)
 */
export function isRtlTextChirho(textChirho: string): boolean {
	return isArabicTextChirho(textChirho) || isUrduTextChirho(textChirho) || isHebrewTextChirho(textChirho);
}

// ============================================================================
// Font Selection Functions
// ============================================================================

export function getMainFontChirho(): string {
	return notoFontChirho ? 'NotoSans' : 'Helvetica';
}

export function getBoldFontChirho(): string {
	return notoBoldFontChirho ? 'NotoSansBold' : 'Helvetica-Bold';
}

/**
 * Get appropriate font for text based on script detection
 *
 * Uses merged fonts (with Latin glyphs) for Arabic/Urdu, Bengali, and Devanagari
 * to avoid tofu (square blocks) for punctuation.
 *
 * Note: For Urdu, we use NotoNaskhMerged instead of NotoNastaliqUrdu
 * because Nastaliq causes memory issues in PDFKit.
 */
export function getFontForTextChirho(textChirho: string): string {
	if (isHebrewTextChirho(textChirho)) {
		return hebrewFontChirho ? 'EzraSIL' : (hebrewAltFontChirho ? 'NotoSansHebrew' : getMainFontChirho());
	}
	// Check Urdu before Arabic since Urdu has specific characters within Arabic range
	// Use NotoNaskhMergedChirho for Urdu/Arabic - includes Latin glyphs, Nastaliq causes memory issues
	if (isUrduTextChirho(textChirho)) {
		return naskhMergedFontChirho ? 'NotoNaskhMergedChirho' : getMainFontChirho();
	}
	if (isArabicTextChirho(textChirho)) {
		return naskhMergedFontChirho ? 'NotoNaskhMergedChirho' : getMainFontChirho();
	}
	if (isThaiTextChirho(textChirho)) {
		return thaiMergedFontChirho ? 'NotoSansThaiMergedChirho' : getMainFontChirho();
	}
	if (isDevanagariTextChirho(textChirho)) {
		return devanagariMergedFontChirho ? 'NotoSansDevanagariMergedChirho' : getMainFontChirho();
	}
	if (isBengaliTextChirho(textChirho)) {
		return bengaliMergedFontChirho ? 'NotoSansBengaliMergedChirho' : getMainFontChirho();
	}
	if (isMyanmarTextChirho(textChirho)) {
		return myanmarMergedFontChirho ? 'NotoSansMyanmarMergedChirho' : getMainFontChirho();
	}
	if (isJapaneseTextChirho(textChirho)) {
		// CJK fonts already have Latin glyphs - no merge needed
		return cjkJpFontChirho ? 'NotoSansCJKjp' : (cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho());
	}
	if (isKoreanTextChirho(textChirho)) {
		// CJK fonts already have Latin glyphs - no merge needed
		return cjkKrFontChirho ? 'NotoSansCJKkr' : (cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho());
	}
	if (isCjkTextChirho(textChirho)) {
		// CJK fonts already have Latin glyphs - no merge needed
		return cjkScFontChirho ? 'NotoSansCJKsc' : getMainFontChirho();
	}
	if (isGujaratiTextChirho(textChirho)) {
		return gujaratiMergedFontChirho ? 'NotoSansGujaratiMergedChirho' : getMainFontChirho();
	}
	if (isTamilTextChirho(textChirho)) {
		return tamilMergedFontChirho ? 'NotoSansTamilMergedChirho' : getMainFontChirho();
	}
	if (isTeluguTextChirho(textChirho)) {
		// Telugu merge failed - use original font
		return teluguFontChirho ? 'NotoSansTelugu' : getMainFontChirho();
	}
	if (isGurmukhiTextChirho(textChirho)) {
		return gurmukhiMergedFontChirho ? 'NotoSansGurmukhiMergedChirho' : getMainFontChirho();
	}
	if (isEthiopicTextChirho(textChirho)) {
		// Ethiopic merge failed - use original font
		return ethiopicFontChirho ? 'NotoSansEthiopic' : getMainFontChirho();
	}
	return getMainFontChirho();
}

// ============================================================================
// Strong's Link Helper
// ============================================================================

/**
 * Get BibleHub link for a Strong's number
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

// ============================================================================
// PDF Document Creation
// ============================================================================

/**
 * Create a PDF document with all international fonts registered
 */
export function createPdfDocumentChirho(optionsChirho: PdfDocumentOptionsChirho = {}): PdfDocumentInstanceChirho {
	const docChirho = new PdfDocumentChirho({
		size: 'A4',
		margins: { top: 50, bottom: 50, left: 50, right: 50 },
		bufferPages: true,
		...optionsChirho
	});

	// Register all available fonts
	if (notoFontChirho) docChirho.registerFont('NotoSans', notoFontChirho);
	if (notoBoldFontChirho) docChirho.registerFont('NotoSansBold', notoBoldFontChirho);
	if (hebrewFontChirho) docChirho.registerFont('EzraSIL', hebrewFontChirho);
	if (hebrewAltFontChirho) docChirho.registerFont('NotoSansHebrew', hebrewAltFontChirho);
	if (thaiFontChirho) docChirho.registerFont('NotoSansThai', thaiFontChirho);
	if (myanmarFontChirho) docChirho.registerFont('NotoSansMyanmar', myanmarFontChirho);
	if (cjkScFontChirho) docChirho.registerFont('NotoSansCJKsc', cjkScFontChirho);
	if (cjkJpFontChirho) docChirho.registerFont('NotoSansCJKjp', cjkJpFontChirho);
	if (cjkKrFontChirho) docChirho.registerFont('NotoSansCJKkr', cjkKrFontChirho);
	if (gujaratiFontChirho) docChirho.registerFont('NotoSansGujarati', gujaratiFontChirho);
	if (tamilFontChirho) docChirho.registerFont('NotoSansTamil', tamilFontChirho);
	if (teluguFontChirho) docChirho.registerFont('NotoSansTelugu', teluguFontChirho);
	if (gurmukhiFontChirho) docChirho.registerFont('NotoSansGurmukhi', gurmukhiFontChirho);
	if (ethiopicFontChirho) docChirho.registerFont('NotoSansEthiopic', ethiopicFontChirho);
	// Merged fonts with Latin glyphs (no tofu)
	if (naskhMergedFontChirho) docChirho.registerFont('NotoNaskhMergedChirho', naskhMergedFontChirho);
	if (bengaliMergedFontChirho) docChirho.registerFont('NotoSansBengaliMergedChirho', bengaliMergedFontChirho);
	if (devanagariMergedFontChirho) docChirho.registerFont('NotoSansDevanagariMergedChirho', devanagariMergedFontChirho);
	if (thaiMergedFontChirho) docChirho.registerFont('NotoSansThaiMergedChirho', thaiMergedFontChirho);
	if (myanmarMergedFontChirho) docChirho.registerFont('NotoSansMyanmarMergedChirho', myanmarMergedFontChirho);
	if (gujaratiMergedFontChirho) docChirho.registerFont('NotoSansGujaratiMergedChirho', gujaratiMergedFontChirho);
	if (tamilMergedFontChirho) docChirho.registerFont('NotoSansTamilMergedChirho', tamilMergedFontChirho);
	if (gurmukhiMergedFontChirho) docChirho.registerFont('NotoSansGurmukhiMergedChirho', gurmukhiMergedFontChirho);

	return docChirho;
}
