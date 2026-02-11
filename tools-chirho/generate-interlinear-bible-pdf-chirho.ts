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
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts ben ./Bengali.pdf ben2006eb
 *   bun run tools-chirho/generate-interlinear-bible-pdf-chirho.ts urd ./Urdu.pdf urdugeo --large-font
 *
 * Note: Non-Latin scripts (Bengali, Urdu, Arabic, Hindi, etc.) automatically have
 * punctuation sanitized since their fonts lack Latin glyphs for commas, dashes, etc.
 */

import { writeFileSync as writeFileSyncChirho } from 'fs';
import { join as joinChirho } from 'path';
import pg from 'pg';

// Import shared PDF utilities from $lib/server (single source of truth)
// Supports Bengali, Hindi, Arabic, Urdu, Thai, CJK, etc.
import {
	createPdfDocumentChirho,
	getMainFontChirho,
	getBoldFontChirho,
	getFontForTextChirho,
	stripPuaChirho,
	sanitizeGlossChirho,
	getStrongLinkChirho,
	isRtlTextChirho,
	simplifyArabicForPdfChirho
} from '../src/lib/server/pdf-utils-chirho';

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

// Localized book names by language code
const BOOK_NAMES_BY_LANGUAGE_CHIRHO: Record<string, Record<number, string>> = {
	rus: {
		1: 'Бытие', 2: 'Исход', 3: 'Левит', 4: 'Числа', 5: 'Второзаконие',
		6: 'Иисус Навин', 7: 'Судей', 8: 'Руфь', 9: '1 Царств', 10: '2 Царств',
		11: '3 Царств', 12: '4 Царств', 13: '1 Паралипоменон', 14: '2 Паралипоменон',
		15: 'Ездра', 16: 'Неемия', 17: 'Есфирь', 18: 'Иов', 19: 'Псалтирь',
		20: 'Притчи', 21: 'Екклесиаст', 22: 'Песнь Песней', 23: 'Исаия', 24: 'Иеремия',
		25: 'Плач Иеремии', 26: 'Иезекииль', 27: 'Даниил', 28: 'Осия', 29: 'Иоиль',
		30: 'Амос', 31: 'Авдий', 32: 'Иона', 33: 'Михей', 34: 'Наум',
		35: 'Аввакум', 36: 'Софония', 37: 'Аггей', 38: 'Захария', 39: 'Малахия',
		40: 'От Матфея', 41: 'От Марка', 42: 'От Луки', 43: 'От Иоанна', 44: 'Деяния',
		45: 'Римлянам', 46: '1 Коринфянам', 47: '2 Коринфянам', 48: 'Галатам', 49: 'Ефесянам',
		50: 'Филиппийцам', 51: 'Колоссянам', 52: '1 Фессалоникийцам', 53: '2 Фессалоникийцам',
		54: '1 Тимофею', 55: '2 Тимофею', 56: 'Титу', 57: 'Филимону', 58: 'Евреям',
		59: 'Иакова', 60: '1 Петра', 61: '2 Петра', 62: '1 Иоанна', 63: '2 Иоанна',
		64: '3 Иоанна', 65: 'Иуды', 66: 'Откровение'
	},
	tur: {
		1: 'Yaratılış', 2: 'Mısır\'dan Çıkış', 3: 'Levililer', 4: 'Çölde Sayım', 5: 'Yasa\'nın Tekrarı',
		6: 'Yeşu', 7: 'Hâkimler', 8: 'Rut', 9: '1. Samuel', 10: '2. Samuel',
		11: '1. Krallar', 12: '2. Krallar', 13: '1. Tarihler', 14: '2. Tarihler',
		15: 'Ezra', 16: 'Nehemya', 17: 'Ester', 18: 'Eyüp', 19: 'Mezmurlar',
		20: 'Süleyman\'ın Özdeyişleri', 21: 'Vaiz', 22: 'Ezgiler Ezgisi', 23: 'Yeşaya', 24: 'Yeremya',
		25: 'Ağıtlar', 26: 'Hezekiel', 27: 'Daniel', 28: 'Hoşea', 29: 'Yoel',
		30: 'Amos', 31: 'Ovadya', 32: 'Yunus', 33: 'Mika', 34: 'Nahum',
		35: 'Habakkuk', 36: 'Sefanya', 37: 'Hagay', 38: 'Zekeriya', 39: 'Malaki',
		40: 'Matta', 41: 'Markos', 42: 'Luka', 43: 'Yuhanna', 44: 'Elçilerin İşleri',
		45: 'Romalılar', 46: '1. Korintliler', 47: '2. Korintliler', 48: 'Galatyalılar', 49: 'Efesliler',
		50: 'Filipililer', 51: 'Koloseliler', 52: '1. Selanikliler', 53: '2. Selanikliler',
		54: '1. Timoteos', 55: '2. Timoteos', 56: 'Titus', 57: 'Filimon', 58: 'İbraniler',
		59: 'Yakup', 60: '1. Petrus', 61: '2. Petrus', 62: '1. Yuhanna', 63: '2. Yuhanna',
		64: '3. Yuhanna', 65: 'Yahuda', 66: 'Vahiy'
	},
	spa: {
		1: 'Génesis', 2: 'Éxodo', 3: 'Levítico', 4: 'Números', 5: 'Deuteronomio',
		6: 'Josué', 7: 'Jueces', 8: 'Rut', 9: '1 Samuel', 10: '2 Samuel',
		11: '1 Reyes', 12: '2 Reyes', 13: '1 Crónicas', 14: '2 Crónicas',
		15: 'Esdras', 16: 'Nehemías', 17: 'Ester', 18: 'Job', 19: 'Salmos',
		20: 'Proverbios', 21: 'Eclesiastés', 22: 'Cantares', 23: 'Isaías', 24: 'Jeremías',
		25: 'Lamentaciones', 26: 'Ezequiel', 27: 'Daniel', 28: 'Oseas', 29: 'Joel',
		30: 'Amós', 31: 'Abdías', 32: 'Jonás', 33: 'Miqueas', 34: 'Nahúm',
		35: 'Habacuc', 36: 'Sofonías', 37: 'Hageo', 38: 'Zacarías', 39: 'Malaquías',
		40: 'Mateo', 41: 'Marcos', 42: 'Lucas', 43: 'Juan', 44: 'Hechos',
		45: 'Romanos', 46: '1 Corintios', 47: '2 Corintios', 48: 'Gálatas', 49: 'Efesios',
		50: 'Filipenses', 51: 'Colosenses', 52: '1 Tesalonicenses', 53: '2 Tesalonicenses',
		54: '1 Timoteo', 55: '2 Timoteo', 56: 'Tito', 57: 'Filemón', 58: 'Hebreos',
		59: 'Santiago', 60: '1 Pedro', 61: '2 Pedro', 62: '1 Juan', 63: '2 Juan',
		64: '3 Juan', 65: 'Judas', 66: 'Apocalipsis'
	},
	por: {
		1: 'Gênesis', 2: 'Êxodo', 3: 'Levítico', 4: 'Números', 5: 'Deuteronômio',
		6: 'Josué', 7: 'Juízes', 8: 'Rute', 9: '1 Samuel', 10: '2 Samuel',
		11: '1 Reis', 12: '2 Reis', 13: '1 Crônicas', 14: '2 Crônicas',
		15: 'Esdras', 16: 'Neemias', 17: 'Ester', 18: 'Jó', 19: 'Salmos',
		20: 'Provérbios', 21: 'Eclesiastes', 22: 'Cânticos', 23: 'Isaías', 24: 'Jeremias',
		25: 'Lamentações', 26: 'Ezequiel', 27: 'Daniel', 28: 'Oséias', 29: 'Joel',
		30: 'Amós', 31: 'Obadias', 32: 'Jonas', 33: 'Miquéias', 34: 'Naum',
		35: 'Habacuque', 36: 'Sofonias', 37: 'Ageu', 38: 'Zacarias', 39: 'Malaquias',
		40: 'Mateus', 41: 'Marcos', 42: 'Lucas', 43: 'João', 44: 'Atos',
		45: 'Romanos', 46: '1 Coríntios', 47: '2 Coríntios', 48: 'Gálatas', 49: 'Efésios',
		50: 'Filipenses', 51: 'Colossenses', 52: '1 Tessalonicenses', 53: '2 Tessalonicenses',
		54: '1 Timóteo', 55: '2 Timóteo', 56: 'Tito', 57: 'Filemom', 58: 'Hebreus',
		59: 'Tiago', 60: '1 Pedro', 61: '2 Pedro', 62: '1 João', 63: '2 João',
		64: '3 João', 65: 'Judas', 66: 'Apocalipse'
	},
	hin: {
		1: 'उत्पत्ति', 2: 'निर्गमन', 3: 'लैव्यव्यवस्था', 4: 'गिनती', 5: 'व्यवस्थाविवरण',
		6: 'यहोशू', 7: 'न्यायियों', 8: 'रूत', 9: '1 शमूएल', 10: '2 शमूएल',
		11: '1 राजा', 12: '2 राजा', 13: '1 इतिहास', 14: '2 इतिहास',
		15: 'एज्रा', 16: 'नहेम्याह', 17: 'एस्तेर', 18: 'अय्यूब', 19: 'भजन संहिता',
		20: 'नीतिवचन', 21: 'सभोपदेशक', 22: 'श्रेष्ठगीत', 23: 'यशायाह', 24: 'यिर्मयाह',
		25: 'विलापगीत', 26: 'यहेजकेल', 27: 'दानिय्येल', 28: 'होशे', 29: 'योएल',
		30: 'आमोस', 31: 'ओबद्याह', 32: 'योना', 33: 'मीका', 34: 'नहूम',
		35: 'हबक्कूक', 36: 'सपन्याह', 37: 'हाग्गै', 38: 'जकर्याह', 39: 'मलाकी',
		40: 'मत्ती', 41: 'मरकुस', 42: 'लूका', 43: 'यूहन्ना', 44: 'प्रेरितों',
		45: 'रोमियों', 46: '1 कुरिन्थियों', 47: '2 कुरिन्थियों', 48: 'गलातियों', 49: 'इफिसियों',
		50: 'फिलिप्पियों', 51: 'कुलुस्सियों', 52: '1 थिस्सलुनीकियों', 53: '2 थिस्सलुनीकियों',
		54: '1 तीमुथियुस', 55: '2 तीमुथियुस', 56: 'तीतुस', 57: 'फिलेमोन', 58: 'इब्रानियों',
		59: 'याकूब', 60: '1 पतरस', 61: '2 पतरस', 62: '1 यूहन्ना', 63: '2 यूहन्ना',
		64: '3 यूहन्ना', 65: 'यहूदा', 66: 'प्रकाशितवाक्य'
	},
	ben: {
		1: 'আদিপুস্তক', 2: 'যাত্রাপুস্তক', 3: 'লেবীয় পুস্তক', 4: 'গণনাপুস্তক', 5: 'দ্বিতীয় বিবরণ',
		6: 'যিহোশূয়', 7: 'বিচারকর্তৃগণ', 8: 'রূত', 9: '১ শমূয়েল', 10: '২ শমূয়েল',
		11: '১ রাজাবলি', 12: '২ রাজাবলি', 13: '১ বংশাবলি', 14: '২ বংশাবলি',
		15: 'ইষ্রা', 16: 'নহিমিয়', 17: 'ইষ্টের', 18: 'ইয়োব', 19: 'গীতসংহিতা',
		20: 'হিতোপদেশ', 21: 'উপদেশক', 22: 'পরমগীত', 23: 'যিশাইয়', 24: 'যিরমিয়',
		25: 'বিলাপ', 26: 'যিহিষ্কেল', 27: 'দানিয়েল', 28: 'হোশেয়', 29: 'যোয়েল',
		30: 'আমোস', 31: 'ওবদিয়', 32: 'যোনা', 33: 'মীখা', 34: 'নহূম',
		35: 'হবক্কূক', 36: 'সফনিয়', 37: 'হগয়', 38: 'সখরিয়', 39: 'মালাখি',
		40: 'মথি', 41: 'মার্ক', 42: 'লূক', 43: 'যোহন', 44: 'প্রেরিত',
		45: 'রোমীয়', 46: '১ করিন্থীয়', 47: '২ করিন্থীয়', 48: 'গালাতীয়', 49: 'ইফিষীয়',
		50: 'ফিলিপীয়', 51: 'কলসীয়', 52: '১ থিষলনীকীয়', 53: '২ থিষলনীকীয়',
		54: '১ তীমথিয়', 55: '২ তীমথিয়', 56: 'তীত', 57: 'ফিলীমোন', 58: 'ইব্রীয়',
		59: 'যাকোব', 60: '১ পিতর', 61: '২ পিতর', 62: '১ যোহন', 63: '২ যোহন',
		64: '৩ যোহন', 65: 'যিহূদা', 66: 'প্রকাশিত বাক্য'
	},
	ind: {
		1: 'Kejadian', 2: 'Keluaran', 3: 'Imamat', 4: 'Bilangan', 5: 'Ulangan',
		6: 'Yosua', 7: 'Hakim-hakim', 8: 'Rut', 9: '1 Samuel', 10: '2 Samuel',
		11: '1 Raja-raja', 12: '2 Raja-raja', 13: '1 Tawarikh', 14: '2 Tawarikh',
		15: 'Ezra', 16: 'Nehemia', 17: 'Ester', 18: 'Ayub', 19: 'Mazmur',
		20: 'Amsal', 21: 'Pengkhotbah', 22: 'Kidung Agung', 23: 'Yesaya', 24: 'Yeremia',
		25: 'Ratapan', 26: 'Yehezkiel', 27: 'Daniel', 28: 'Hosea', 29: 'Yoel',
		30: 'Amos', 31: 'Obaja', 32: 'Yunus', 33: 'Mikha', 34: 'Nahum',
		35: 'Habakuk', 36: 'Zefanya', 37: 'Hagai', 38: 'Zakharia', 39: 'Maleakhi',
		40: 'Matius', 41: 'Markus', 42: 'Lukas', 43: 'Yohanes', 44: 'Kisah Para Rasul',
		45: 'Roma', 46: '1 Korintus', 47: '2 Korintus', 48: 'Galatia', 49: 'Efesus',
		50: 'Filipi', 51: 'Kolose', 52: '1 Tesalonika', 53: '2 Tesalonika',
		54: '1 Timotius', 55: '2 Timotius', 56: 'Titus', 57: 'Filemon', 58: 'Ibrani',
		59: 'Yakobus', 60: '1 Petrus', 61: '2 Petrus', 62: '1 Yohanes', 63: '2 Yohanes',
		64: '3 Yohanes', 65: 'Yudas', 66: 'Wahyu'
	},
	jav: {
		1: 'Purwaning Dumadi', 2: 'Pangentasan', 3: 'Kaimaman', 4: 'Wilangan', 5: 'Pangandharing Toret',
		6: 'Yusak', 7: 'Hakim-hakim', 8: 'Rut', 9: '1 Samuel', 10: '2 Samuel',
		11: '1 Raja-raja', 12: '2 Raja-raja', 13: '1 Babad', 14: '2 Babad',
		15: 'Ezra', 16: 'Nehemya', 17: 'Ester', 18: 'Ayub', 19: 'Mazmur',
		20: 'Wulang Bebasan', 21: 'Kohelet', 22: 'Kidung Agung', 23: 'Yesaya', 24: 'Yeremia',
		25: 'Kidung Pasambat', 26: 'Yeheskiel', 27: 'Daniel', 28: 'Hosea', 29: 'Yoel',
		30: 'Amos', 31: 'Obaja', 32: 'Yunus', 33: 'Mikha', 34: 'Nahum',
		35: 'Habakuk', 36: 'Zefanya', 37: 'Hagai', 38: 'Zakharia', 39: 'Maleakhi',
		40: 'Mateus', 41: 'Markus', 42: 'Lukas', 43: 'Yokanan', 44: 'Lelakone Para Rasul',
		45: 'Rum', 46: '1 Korinta', 47: '2 Korinta', 48: 'Galati', 49: 'Efesus',
		50: 'Filipi', 51: 'Kolose', 52: '1 Tesalonika', 53: '2 Tesalonika',
		54: '1 Timoteus', 55: '2 Timoteus', 56: 'Titus', 57: 'Filemon', 58: 'Ibrani',
		59: 'Yakobus', 60: '1 Petrus', 61: '2 Petrus', 62: '1 Yokanan', 63: '2 Yokanan',
		64: '3 Yokanan', 65: 'Yudas', 66: 'Wahyu'
	},
	urd: {
		1: 'پیدائش', 2: 'خروج', 3: 'احبار', 4: 'گنتی', 5: 'استثنا',
		6: 'یشوع', 7: 'قاضیوں', 8: 'روت', 9: '۱ سموئیل', 10: '۲ سموئیل',
		11: '۱ سلاطین', 12: '۲ سلاطین', 13: '۱ تواریخ', 14: '۲ تواریخ',
		15: 'عزرا', 16: 'نحمیاہ', 17: 'آستر', 18: 'ایوب', 19: 'زبور',
		20: 'امثال', 21: 'واعظ', 22: 'غزل الغزلات', 23: 'یسعیاہ', 24: 'یرمیاہ',
		25: 'نوحہ', 26: 'حزقی ایل', 27: 'دانی ایل', 28: 'ہوسیع', 29: 'یوایل',
		30: 'عاموس', 31: 'عبدیاہ', 32: 'یوناہ', 33: 'میکاہ', 34: 'ناحوم',
		35: 'حبقوق', 36: 'صفنیاہ', 37: 'حجی', 38: 'زکریا', 39: 'ملاکی',
		40: 'متی', 41: 'مرقس', 42: 'لوقا', 43: 'یوحنا', 44: 'اعمال',
		45: 'رومیوں', 46: '۱ کرنتھیوں', 47: '۲ کرنتھیوں', 48: 'گلتیوں', 49: 'افسیوں',
		50: 'فلپیوں', 51: 'کلسیوں', 52: '۱ تھسلنیکیوں', 53: '۲ تھسلنیکیوں',
		54: '۱ تیمتھیس', 55: '۲ تیمتھیس', 56: 'طِطُس', 57: 'فلیمون', 58: 'عبرانیوں',
		59: 'یعقوب', 60: '۱ پطرس', 61: '۲ پطرس', 62: '۱ یوحنا', 63: '۲ یوحنا',
		64: '۳ یوحنا', 65: 'یہوداہ', 66: 'مکاشفہ'
	},
	arb: {
		1: 'التَّكْوِينُ', 2: 'الخُرُوجُ', 3: 'اللَّاوِيِّينَ', 4: 'العَدَدُ', 5: 'التَّثْنِيَةُ',
		6: 'يَشُوعُ', 7: 'القُضَاةُ', 8: 'رَاعُوثُ', 9: 'صَمُوئِيلُ الأَوَّلُ', 10: 'صَمُوئِيلُ الثَّانِي',
		11: 'المُلُوكُ الأَوَّلُ', 12: 'المُلُوكُ الثَّانِي', 13: 'أَخْبَارُ الأَيَّامِ الأَوَّلُ', 14: 'أَخْبَارُ الأَيَّامِ الثَّانِي',
		15: 'عِزْرَا', 16: 'نَحَمْيَا', 17: 'أَسْتِيرُ', 18: 'أَيُّوبُ', 19: 'المَزَامِيرُ',
		20: 'الأَمْثَالُ', 21: 'الجَامِعَةُ', 22: 'نَشِيدُ الأَنْشَادِ', 23: 'إِشَعْيَاءُ', 24: 'إِرْمِيَاءُ',
		25: 'مَرَاثِي إِرْمِيَا', 26: 'حِزْقِيَالُ', 27: 'دَانِيَالُ', 28: 'هُوشَعُ', 29: 'يُوئِيلُ',
		30: 'عَامُوسُ', 31: 'عُوبَدْيَا', 32: 'يُونَانُ', 33: 'مِيخَا', 34: 'نَاحُومُ',
		35: 'حَبَقُّوقُ', 36: 'صَفَنْيَا', 37: 'حَجَّي', 38: 'زَكَرِيَّا', 39: 'مَلَاخِي',
		40: 'مَتَّى', 41: 'مَرْقُسُ', 42: 'لُوقَا', 43: 'يُوحَنَّا', 44: 'أَعْمَالُ الرُّسُلِ',
		45: 'رُومِيَةُ', 46: 'كُورِنْثُوسَ الأُولَى', 47: 'كُورِنْثُوسَ الثَّانِيَةُ', 48: 'غَلَاطِيَّةُ', 49: 'أَفَسُسُ',
		50: 'فِيلِبِّي', 51: 'كُولُوسِّي', 52: 'تَسَالُونِيكِي الأُولَى', 53: 'تَسَالُونِيكِي الثَّانِيَةُ',
		54: 'تِيمُوثَاوُسَ الأُولَى', 55: 'تِيمُوثَاوُسَ الثَّانِيَةُ', 56: 'تِيطُسُ', 57: 'فِلِيمُونَ', 58: 'العِبْرَانِيِّينَ',
		59: 'يَعْقُوبُ', 60: 'بُطْرُسَ الأُولَى', 61: 'بُطْرُسَ الثَّانِيَةُ', 62: 'يُوحَنَّا الأُولَى', 63: 'يُوحَنَّا الثَّانِيَةُ',
		64: 'يُوحَنَّا الثَّالِثَةُ', 65: 'يَهُوذَا', 66: 'الرُّؤْيَا'
	},
	kor: {
		1: '창세기', 2: '출애굽기', 3: '레위기', 4: '민수기', 5: '신명기',
		6: '여호수아', 7: '사사기', 8: '룻기', 9: '사무엘상', 10: '사무엘하',
		11: '열왕기상', 12: '열왕기하', 13: '역대상', 14: '역대하',
		15: '에스라', 16: '느헤미야', 17: '에스더', 18: '욥기', 19: '시편',
		20: '잠언', 21: '전도서', 22: '아가', 23: '이사야', 24: '예레미야',
		25: '예레미야애가', 26: '에스겔', 27: '다니엘', 28: '호세아', 29: '요엘',
		30: '아모스', 31: '오바댜', 32: '요나', 33: '미가', 34: '나훔',
		35: '하박국', 36: '스바냐', 37: '학개', 38: '스가랴', 39: '말라기',
		40: '마태복음', 41: '마가복음', 42: '누가복음', 43: '요한복음', 44: '사도행전',
		45: '로마서', 46: '고린도전서', 47: '고린도후서', 48: '갈라디아서', 49: '에베소서',
		50: '빌립보서', 51: '골로새서', 52: '데살로니가전서', 53: '데살로니가후서',
		54: '디모데전서', 55: '디모데후서', 56: '디도서', 57: '빌레몬서', 58: '히브리서',
		59: '야고보서', 60: '베드로전서', 61: '베드로후서', 62: '요한일서', 63: '요한이서',
		64: '요한삼서', 65: '유다서', 66: '요한계시록'
	},
	mya: {
		1: 'ကမ္ဘာဦးကျမ်း', 2: 'ထွက်မြောက်ရာကျမ်း', 3: 'ဝတ်ပြုရာကျမ်း', 4: 'တောလည်ရာကျမ်း', 5: 'တရားဟောရာကျမ်း',
		6: 'ယောရှုမှတ်စာ', 7: 'တရားသူကြီးမှတ်စာ', 8: 'ရုသဝတ္ထု', 9: 'ဓမ္မရာဇဝင်ပထမစောင်', 10: 'ဓမ္မရာဇဝင်ဒုတိယစောင်',
		11: 'ရာဇဝင်ချုပ်ပထမစောင်', 12: 'ရာဇဝင်ချုပ်ဒုတိယစောင်', 13: 'ရာဇဝင်ချုပ်တတိယစောင်', 14: 'ရာဇဝင်ချုပ်စတုတ္ထစောင်',
		15: 'ဧဇရမှတ်စာ', 16: 'နေဟမိမှတ်စာ', 17: 'ဧသတာဝတ္ထု', 18: 'ယောဘဝတ္ထု', 19: 'ဆာလံကျမ်း',
		20: 'သုတ္တံကျမ်း', 21: 'ဒေသနာကျမ်း', 22: 'ရှောလမုန်သီချင်း', 23: 'ဟေရှာယအနာဂတ္တိကျမ်း', 24: 'ယေရမိအနာဂတ္တိကျမ်း',
		25: 'မြည်တမ်းစကား', 26: 'ယေဇကျေလအနာဂတ္တိကျမ်း', 27: 'ဒံယေလအနာဂတ္တိကျမ်း', 28: 'ဟောရှေအနာဂတ္တိကျမ်း', 29: 'ယောလအနာဂတ္တိကျမ်း',
		30: 'အာမုတ်အနာဂတ္တိကျမ်း', 31: 'ဩဗဒိအနာဂတ္တိကျမ်း', 32: 'ယောနဝတ္ထု', 33: 'မိက္ခာအနာဂတ္တိကျမ်း', 34: 'နာဟုံအနာဂတ္တိကျမ်း',
		35: 'ဟဗက္ကုတ်အနာဂတ္တိကျမ်း', 36: 'ဇေဖနိအနာဂတ္တိကျမ်း', 37: 'ဟဂ္ဂဲအနာဂတ္တိကျမ်း', 38: 'ဇာခရိအနာဂတ္တိကျမ်း', 39: 'မာလခိအနာဂတ္တိကျမ်း',
		40: 'ရှင်မဿဲခရစ်ဝင်', 41: 'ရှင်မာကုခရစ်ဝင်', 42: 'ရှင်လုကာခရစ်ဝင်', 43: 'ရှင်ယောဟန်ခရစ်ဝင်', 44: 'တမန်တော်ဝတ္ထု',
		45: 'ရောမဩဝါဒစာ', 46: 'ကောရိန္သုဩဝါဒစာပထမစောင်', 47: 'ကောရိန္သုဩဝါဒစာဒုတိယစောင်', 48: 'ဂလာတိဩဝါဒစာ', 49: 'ဧဖက်ဩဝါဒစာ',
		50: 'ဖိလိပ္ပိဩဝါဒစာ', 51: 'ကောလောသဲဩဝါဒစာ', 52: 'သက်သာလောနိတ်ဩဝါဒစာပထမစောင်', 53: 'သက်သာလောနိတ်ဩဝါဒစာဒုတိယစောင်',
		54: 'တိမောသေဩဝါဒစာပထမစောင်', 55: 'တိမောသေဩဝါဒစာဒုတိယစောင်', 56: 'တိတုဩဝါဒစာ', 57: 'ဖိလေမုန်ဩဝါဒစာ', 58: 'ဟေဗြဲဩဝါဒစာ',
		59: 'ယာကုပ်ဩဝါဒစာ', 60: 'ရှင်ပေတရုဩဝါဒစာပထမစောင်', 61: 'ရှင်ပေတရုဩဝါဒစာဒုတိယစောင်', 62: 'ရှင်ယောဟန်ဩဝါဒစာပထမစောင်', 63: 'ရှင်ယောဟန်ဩဝါဒစာဒုတိယစောင်',
		64: 'ရှင်ယောဟန်ဩဝါဒစာတတိယစောင်', 65: 'ယုဒဩဝါဒစာ', 66: 'ဗျာဒိတ်ကျမ်း'
	},
	tam: {
		1: 'ஆதியாகமம்', 2: 'யாத்திராகமம்', 3: 'லேவியராகமம்', 4: 'எண்ணாகமம்', 5: 'உபாகமம்',
		6: 'யோசுவா', 7: 'நியாயாதிபதிகள்', 8: 'ரூத்', 9: '1 சாமுவேல்', 10: '2 சாமுவேல்',
		11: '1 இராஜாக்கள்', 12: '2 இராஜாக்கள்', 13: '1 நாளாகமம்', 14: '2 நாளாகமம்',
		15: 'எஸ்றா', 16: 'நெகேமியா', 17: 'எஸ்தர்', 18: 'யோபு', 19: 'சங்கீதம்',
		20: 'நீதிமொழிகள்', 21: 'பிரசங்கி', 22: 'உன்னதப்பாட்டு', 23: 'ஏசாயா', 24: 'எரேமியா',
		25: 'புலம்பல்', 26: 'எசேக்கியேல்', 27: 'தானியேல்', 28: 'ஓசியா', 29: 'யோவேல்',
		30: 'ஆமோஸ்', 31: 'ஒபதியா', 32: 'யோனா', 33: 'மீகா', 34: 'நாகூம்',
		35: 'ஆபகூக்', 36: 'செப்பனியா', 37: 'ஆகாய்', 38: 'சகரியா', 39: 'மல்கியா',
		40: 'மத்தேயு', 41: 'மாற்கு', 42: 'லூக்கா', 43: 'யோவான்', 44: 'அப்போஸ்தலர்',
		45: 'ரோமர்', 46: '1 கொரிந்தியர்', 47: '2 கொரிந்தியர்', 48: 'கலாத்தியர்', 49: 'எபேசியர்',
		50: 'பிலிப்பியர்', 51: 'கொலோசெயர்', 52: '1 தெசலோனிக்கேயர்', 53: '2 தெசலோனிக்கேயர்',
		54: '1 தீமோத்தேயு', 55: '2 தீமோத்தேயு', 56: 'தீத்து', 57: 'பிலேமோன்', 58: 'எபிரெயர்',
		59: 'யாக்கோபு', 60: '1 பேதுரு', 61: '2 பேதுரு', 62: '1 யோவான்', 63: '2 யோவான்',
		64: '3 யோவான்', 65: 'யூதா', 66: 'வெளிப்படுத்தல்'
	},
	zho: {
		1: '创世记', 2: '出埃及记', 3: '利未记', 4: '民数记', 5: '申命记',
		6: '约书亚记', 7: '士师记', 8: '路得记', 9: '撒母耳记上', 10: '撒母耳记下',
		11: '列王纪上', 12: '列王纪下', 13: '历代志上', 14: '历代志下',
		15: '以斯拉记', 16: '尼希米记', 17: '以斯帖记', 18: '约伯记', 19: '诗篇',
		20: '箴言', 21: '传道书', 22: '雅歌', 23: '以赛亚书', 24: '耶利米书',
		25: '耶利米哀歌', 26: '以西结书', 27: '但以理书', 28: '何西阿书', 29: '约珥书',
		30: '阿摩司书', 31: '俄巴底亚书', 32: '约拿书', 33: '弥迦书', 34: '那鸿书',
		35: '哈巴谷书', 36: '西番雅书', 37: '哈该书', 38: '撒迦利亚书', 39: '玛拉基书',
		40: '马太福音', 41: '马可福音', 42: '路加福音', 43: '约翰福音', 44: '使徒行传',
		45: '罗马书', 46: '哥林多前书', 47: '哥林多后书', 48: '加拉太书', 49: '以弗所书',
		50: '腓立比书', 51: '歌罗西书', 52: '帖撒罗尼迦前书', 53: '帖撒罗尼迦后书',
		54: '提摩太前书', 55: '提摩太后书', 56: '提多书', 57: '腓利门书', 58: '希伯来书',
		59: '雅各书', 60: '彼得前书', 61: '彼得后书', 62: '约翰一书', 63: '约翰二书',
		64: '约翰三书', 65: '犹大书', 66: '启示录'
	},
	amh: {
		1: 'ዘፍጥረት', 2: 'ዘጸአት', 3: 'ዘሌዋውያን', 4: 'ዘኍልቍ', 5: 'ዘዳግም',
		6: 'ኢያሱ', 7: 'መሳፍንት', 8: 'ሩት', 9: '1ኛ ሳሙኤል', 10: '2ኛ ሳሙኤል',
		11: '1ኛ ነገሥት', 12: '2ኛ ነገሥት', 13: '1ኛ ዜና መዋዕል', 14: '2ኛ ዜና መዋዕል',
		15: 'ዕዝራ', 16: 'ነህምያ', 17: 'አስቴር', 18: 'ኢዮብ', 19: 'መዝሙረ ዳዊት',
		20: 'ምሳሌ', 21: 'መክብብ', 22: 'መኃልየ መኃልይ', 23: 'ኢሳይያስ', 24: 'ኤርምያስ',
		25: 'ሰቆቃወ ኤርምያስ', 26: 'ሕዝቅኤል', 27: 'ዳንኤል', 28: 'ሆሴዕ', 29: 'ኢዩኤል',
		30: 'አሞጽ', 31: 'ዖብድያስ', 32: 'ዮናስ', 33: 'ሚክያስ', 34: 'ናሆም',
		35: 'ዕንባቆም', 36: 'ሶፎንያስ', 37: 'ሐጌ', 38: 'ዘካርያስ', 39: 'ሚልክያስ',
		40: 'የማቴዎስ ወንጌል', 41: 'የማርቆስ ወንጌል', 42: 'የሉቃስ ወንጌል', 43: 'የዮሐንስ ወንጌል', 44: 'የሐዋርያት ሥራ',
		45: 'ወደ ሮሜ ሰዎች', 46: '1ኛ ቆሮንቶስ', 47: '2ኛ ቆሮንቶስ', 48: 'ገላትያ', 49: 'ኤፌሶን',
		50: 'ፊልጵስዩስ', 51: 'ቆላስይስ', 52: '1ኛ ተሰሎንቄ', 53: '2ኛ ተሰሎንቄ',
		54: '1ኛ ጢሞቴዎስ', 55: '2ኛ ጢሞቴዎስ', 56: 'ቲቶ', 57: 'ፊልሞና', 58: 'ዕብራውያን',
		59: 'ያዕቆብ', 60: '1ኛ ጴጥሮስ', 61: '2ኛ ጴጥሮስ', 62: '1ኛ ዮሐንስ', 63: '2ኛ ዮሐንስ',
		64: '3ኛ ዮሐንስ', 65: 'ይሁዳ', 66: 'የዮሐንስ ራእይ'
	}
};

// Localized UI labels
const UI_LABELS_BY_LANGUAGE_CHIRHO: Record<string, { tocChirho: string; otChirho: string; ntChirho: string }> = {
	rus: { tocChirho: 'Содержание', otChirho: 'Ветхий Завет', ntChirho: 'Новый Завет' },
	tur: { tocChirho: 'İçindekiler', otChirho: 'Eski Antlaşma', ntChirho: 'Yeni Antlaşma' },
	spa: { tocChirho: 'Índice', otChirho: 'Antiguo Testamento', ntChirho: 'Nuevo Testamento' },
	por: { tocChirho: 'Índice', otChirho: 'Antigo Testamento', ntChirho: 'Novo Testamento' },
	hin: { tocChirho: 'विषय सूची', otChirho: 'पुराना नियम', ntChirho: 'नया नियम' },
	ben: { tocChirho: 'সূচিপত্র', otChirho: 'পুরাতন নিয়ম', ntChirho: 'নতুন নিয়ম' },
	ind: { tocChirho: 'Daftar Isi', otChirho: 'Perjanjian Lama', ntChirho: 'Perjanjian Baru' },
	jav: { tocChirho: 'Daftar Isi', otChirho: 'Prajanjian Lawas', ntChirho: 'Prajanjian Anyar' },
	urd: { tocChirho: 'فہرست', otChirho: 'پرانا عہد نامہ', ntChirho: 'نیا عہد نامہ' },
	arb: { tocChirho: 'الفِهْرِسُ', otChirho: 'العَهْدُ القَدِيمُ', ntChirho: 'العَهْدُ الجَدِيدُ' },
	kor: { tocChirho: '목차', otChirho: '구약성경', ntChirho: '신약성경' },
	mya: { tocChirho: 'မာတိကာ', otChirho: 'ဓမ္မဟောင်းကျမ်း', ntChirho: 'ဓမ္မသစ်ကျမ်း' },
	tam: { tocChirho: 'பொருளடக்கம்', otChirho: 'பழைய ஏற்பாடு', ntChirho: 'புதிய ஏற்பாடு' },
	zho: { tocChirho: '目录', otChirho: '旧约', ntChirho: '新约' },
	amh: { tocChirho: 'ማውጫ', otChirho: 'ብሉይ ኪዳን', ntChirho: 'አዲስ ኪዳን' }
};

// Helper function to get localized UI label
function getLocalizedLabelChirho(keyChirho: 'tocChirho' | 'otChirho' | 'ntChirho', languageCodeChirho: string): string {
	const labelsChirho = UI_LABELS_BY_LANGUAGE_CHIRHO[languageCodeChirho];
	if (labelsChirho && labelsChirho[keyChirho]) {
		return labelsChirho[keyChirho];
	}
	// Fall back to English
	const defaultsChirho = { tocChirho: 'Table of Contents', otChirho: 'Old Testament', ntChirho: 'New Testament' };
	return defaultsChirho[keyChirho];
}

// Helper function to get localized book name
function getLocalizedBookNameChirho(bookIdChirho: number, languageCodeChirho: string): string {
	const localizedNamesChirho = BOOK_NAMES_BY_LANGUAGE_CHIRHO[languageCodeChirho];
	if (localizedNamesChirho && localizedNamesChirho[bookIdChirho]) {
		return localizedNamesChirho[bookIdChirho];
	}
	// Fall back to English name
	const bookChirho = BOOKS_CHIRHO.find(b => b.idChirho === bookIdChirho);
	return bookChirho?.nameChirho || `Book ${bookIdChirho}`;
}

// Global language code for localized names
let currentLanguageCodeChirho: string = 'eng';

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

// Global current book name for page headers
let currentBookNameChirho: string = '';

// Disclaimer text for PDFs using reference Bibles that require it
const NON_COMMERCIAL_DISCLAIMER_CHIRHO =
	'This interlinear Bible is provided for personal, non-commercial use only. ' +
	'The reference Bible text may be subject to copyright restrictions. ' +
	'Please do not redistribute or use commercially without proper authorization.';

// Copyright notices for specific reference versions
const REFERENCE_COPYRIGHT_CHIRHO: Record<string, string> = {
	swhulb:
		'Swahili reference text: Biblia Takatifu (Swahili Unlocked Literal Bible)\n' +
		'© 2019 Door43 World Missions Community\n' +
		'Licensed under Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)\n' +
		'https://ebible.org/swhulb',
	// Add more reference copyrights as needed
};

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
function addCoverPageChirho(
	docChirho: PdfDocumentInstanceChirho,
	languageNameChirho: string,
	includeDisclaimerChirho: boolean = false,
	refVersionCodeChirho?: string
): void {
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
	const langNameFontChirho = getFontForTextChirho(languageNameChirho);
	docChirho.font(langNameFontChirho).fontSize(fontSizesChirho.languageChirho).fillColor('#64748b');
	docChirho.text(languageNameChirho, { align: 'center' });

	// Decorative line
	docChirho.moveDown(2);
	const lineYChirho = docChirho.y;
	docChirho.moveTo(150, lineYChirho).lineTo(445, lineYChirho).stroke('#cbd5e1');

	// Reference Bible copyright (if available)
	if (refVersionCodeChirho && REFERENCE_COPYRIGHT_CHIRHO[refVersionCodeChirho]) {
		docChirho.font(mainFontChirho).fontSize(8).fillColor('#64748b');
		docChirho.text(REFERENCE_COPYRIGHT_CHIRHO[refVersionCodeChirho], 70, 520, {
			align: 'center',
			width: 455
		});
	}

	// Non-commercial disclaimer (if reference Bible requires it)
	if (includeDisclaimerChirho) {
		docChirho.font(mainFontChirho).fontSize(8).fillColor('#94a3b8');
		docChirho.text(NON_COMMERCIAL_DISCLAIMER_CHIRHO, 70, 620, {
			align: 'center',
			width: 455
		});
	}

	// Attribution - position at bottom of page (fixed Y position instead of moveDown)
	docChirho.font(mainFontChirho).fontSize(fontSizesChirho.footerChirho).fillColor('#94a3b8');
	docChirho.text('Global Bible Tools', 50, 700, { align: 'center', width: 495 });
	docChirho.text('global-tools.bible.systems', 50, 715, { align: 'center', width: 495 });
	docChirho.text(new Date().getFullYear().toString(), 50, 735, { align: 'center', width: 495 });

	docChirho.addPage();
}

/**
 * Add table of contents
 * Uses script-aware font selection for localized text (Arabic, Hebrew, etc.)
 */
function addTableOfContentsChirho(docChirho: PdfDocumentInstanceChirho): void {
	const mainFontChirho = getMainFontChirho();
	const boldFontChirho = getBoldFontChirho();

	// Get localized labels and determine appropriate font
	// Apply simplifyArabicForPdfChirho to avoid fontkit ligature errors with Arabic diacritics
	const tocLabelRawChirho = getLocalizedLabelChirho('tocChirho', currentLanguageCodeChirho);
	const otLabelRawChirho = getLocalizedLabelChirho('otChirho', currentLanguageCodeChirho);
	const tocLabelChirho = simplifyArabicForPdfChirho(tocLabelRawChirho);
	const otLabelChirho = simplifyArabicForPdfChirho(otLabelRawChirho);
	const tocFontChirho = getFontForTextChirho(tocLabelChirho);
	const otFontChirho = getFontForTextChirho(otLabelChirho);

	docChirho.font(tocFontChirho).fontSize(fontSizesChirho.tocHeaderChirho).fillColor('#1e293b');
	docChirho.text(tocLabelChirho, { align: 'center' });
	docChirho.moveDown(1);

	// Old Testament
	docChirho.font(otFontChirho).fontSize(fontSizesChirho.chapterHeaderChirho).fillColor('#475569');
	docChirho.text(otLabelChirho, { align: 'left' });
	docChirho.moveDown(0.5);

	const otBooksChirho = BOOKS_CHIRHO.filter(bChirho => bChirho.idChirho <= 39);
	const ntBooksChirho = BOOKS_CHIRHO.filter(bChirho => bChirho.idChirho > 39);

	const colWidthChirho = 160;
	let colChirho = 0;
	let startYChirho = docChirho.y;

	for (const bookChirho of otBooksChirho) {
		const xChirho = 50 + (colChirho * colWidthChirho);
		const localizedNameRawChirho = getLocalizedBookNameChirho(bookChirho.idChirho, currentLanguageCodeChirho);
		const localizedNameChirho = simplifyArabicForPdfChirho(localizedNameRawChirho);
		const bookFontChirho = getFontForTextChirho(localizedNameChirho);
		docChirho.font(bookFontChirho).fontSize(fontSizesChirho.tocItemChirho).fillColor('#334155');
		docChirho.text(localizedNameChirho, xChirho, docChirho.y, { width: colWidthChirho - 10 });
		colChirho++;
		if (colChirho >= 3) {
			colChirho = 0;
			startYChirho = docChirho.y;
		} else {
			docChirho.y = startYChirho;
		}
	}

	if (colChirho !== 0) docChirho.moveDown(1);
	docChirho.moveDown(0.5);

	// Check if we need a new page for NT section (at least 200pt needed)
	if (docChirho.y > 550) {
		docChirho.addPage();
	}

	// New Testament
	const ntLabelRawChirho = getLocalizedLabelChirho('ntChirho', currentLanguageCodeChirho);
	const ntLabelChirho = simplifyArabicForPdfChirho(ntLabelRawChirho);
	const ntFontChirho = getFontForTextChirho(ntLabelChirho);
	docChirho.font(ntFontChirho).fontSize(fontSizesChirho.chapterHeaderChirho).fillColor('#475569');
	docChirho.text(ntLabelChirho, { align: 'left' });
	docChirho.moveDown(0.5);

	colChirho = 0;
	startYChirho = docChirho.y;

	for (const bookChirho of ntBooksChirho) {
		const xChirho = 50 + (colChirho * colWidthChirho);
		const ntLocalizedNameRawChirho = getLocalizedBookNameChirho(bookChirho.idChirho, currentLanguageCodeChirho);
		const ntLocalizedNameChirho = simplifyArabicForPdfChirho(ntLocalizedNameRawChirho);
		const ntBookFontChirho = getFontForTextChirho(ntLocalizedNameChirho);
		docChirho.font(ntBookFontChirho).fontSize(fontSizesChirho.tocItemChirho).fillColor('#334155');
		docChirho.text(ntLocalizedNameChirho, xChirho, docChirho.y, { width: colWidthChirho - 10 });
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
 * Add book header - also sets global book name for page headers
 * Uses script-aware font selection for Arabic, Bengali, Hindi, etc.
 * Applies simplifyArabicForPdfChirho to avoid fontkit ligature errors
 */
function addBookHeaderChirho(docChirho: PdfDocumentInstanceChirho, bookNameChirho: string): void {
	// Sanitize Arabic text to avoid fontkit ligature errors with diacritics
	const sanitizedBookNameChirho = simplifyArabicForPdfChirho(bookNameChirho);

	// Update global current book name for page headers (sanitized)
	currentBookNameChirho = sanitizedBookNameChirho;

	docChirho.addPage();
	const bookFontChirho = getFontForTextChirho(sanitizedBookNameChirho);
	docChirho.font(bookFontChirho).fontSize(fontSizesChirho.bookHeaderChirho).fillColor('#1e293b');
	docChirho.text(sanitizedBookNameChirho, { align: 'center' });
	docChirho.moveDown(2);
}

/**
 * Add page header with book name (called after page breaks)
 * Uses script-aware font selection for Arabic, Bengali, Hindi, etc.
 */
function addPageHeaderChirho(docChirho: PdfDocumentInstanceChirho): void {
	if (!currentBookNameChirho) return;

	// Use script-aware font selection for Arabic, Bengali, Hindi, etc.
	const headerFontChirho = getFontForTextChirho(currentBookNameChirho);

	// Header at top of page
	docChirho.font(headerFontChirho).fontSize(9).fillColor('#94a3b8');
	docChirho.text(currentBookNameChirho, 50, 25, { align: 'center', width: 495 });

	// Draw subtle line below header
	docChirho.moveTo(50, 38).lineTo(545, 38).stroke('#e2e8f0');

	// Reset Y position to leave room for content
	docChirho.y = 50;
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
		const cleanGlossChirho = sanitizeGlossChirho(wChirho.glossChirho ?? '');
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
				const cleanGlossChirho = sanitizeGlossChirho(currentWordChirho.glossChirho ?? '');
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
				const cleanGlossChirho = sanitizeGlossChirho(currentWordChirho.glossChirho ?? '');
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
	// Use sanitizeGlossChirho to handle non-Latin punctuation (Bengali, Urdu, etc.)
	const cleanTextChirho = sanitizeGlossChirho(textChirho);
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

	// Set global language code for localized book names
	currentLanguageCodeChirho = langCodeChirho;

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

	// Register page event handler for book headers on new pages
	// Skip first 3 pages (cover, TOC, first book page)
	let pageCountChirho = 0;
	docChirho.on('pageAdded', () => {
		pageCountChirho++;
		// Only add page headers after TOC (page 3+) and when there's a current book
		if (pageCountChirho > 2 && currentBookNameChirho) {
			addPageHeaderChirho(docChirho);
		}
	});

	// Add cover page and TOC
	// Include disclaimer when using a reference version
	const titleChirho = refVersionChirho
		? `${refVersionChirho.nameChirho} - Interlinear`
		: languageChirho.nameChirho;
	const includeDisclaimerChirho = refVersionChirho !== null;
	addCoverPageChirho(docChirho, titleChirho, includeDisclaimerChirho, refVersionCodeChirho);
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
				const localizedBookNameChirho = getLocalizedBookNameChirho(bookChirho.idChirho, currentLanguageCodeChirho);
				addBookHeaderChirho(docChirho, localizedBookNameChirho);
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
