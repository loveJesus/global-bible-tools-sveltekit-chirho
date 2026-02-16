// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text } from 'drizzle-orm/pg-core';

// Word IPA table - IPA transliterations for Hebrew and Greek word forms
// Hebrew: Tiberian Masoretic pronunciation
// Greek: Erasmian, Reconstructed Koine, and Modern pronunciations
export const wordIpaTableChirho = pgTable('word_ipa_chirho', {
	wordTextChirho: text('word_text_chirho').primaryKey(),
	hebrewTiberianChirho: text('hebrew_tiberian_chirho'),
	greekErasmianChirho: text('greek_erasmian_chirho'),
	greekKoineChirho: text('greek_koine_chirho'),
	greekModernChirho: text('greek_modern_chirho')
});

// Type exports
export type WordIpaChirho = typeof wordIpaTableChirho.$inferSelect;
export type NewWordIpaChirho = typeof wordIpaTableChirho.$inferInsert;
