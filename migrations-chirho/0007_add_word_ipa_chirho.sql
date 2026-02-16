-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- IPA (International Phonetic Alphabet) transliterations for Hebrew and Greek word forms.
-- Hebrew: Tiberian Masoretic pronunciation
-- Greek: Erasmian, Reconstructed Koine, and Modern pronunciations

CREATE TABLE IF NOT EXISTS word_ipa_chirho (
    word_text_chirho TEXT PRIMARY KEY,
    hebrew_tiberian_chirho TEXT,
    greek_erasmian_chirho TEXT,
    greek_koine_chirho TEXT,
    greek_modern_chirho TEXT
);

-- Index for fast lookup when joining with word table
CREATE INDEX IF NOT EXISTS idx_word_ipa_text_chirho ON word_ipa_chirho (word_text_chirho);
