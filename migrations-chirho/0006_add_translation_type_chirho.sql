-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- -- John 3:16

-- Add translation_type_chirho column to phrase table
-- NULL = terse (word-by-word), 'readers' = natural reading
-- No data migration needed: all existing records are terse (NULL)

ALTER TABLE phrase ADD COLUMN IF NOT EXISTS translation_type_chirho TEXT;

-- Partial index for efficient filtering by language + type
CREATE INDEX IF NOT EXISTS idx_phrase_translation_type_chirho
  ON phrase (language_id, translation_type_chirho) WHERE deleted_at IS NULL;
