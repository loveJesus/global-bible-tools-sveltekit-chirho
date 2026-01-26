-- For God so loved the world, that He gave His only begotten Son,
-- that all who believe in Him should not perish but have everlasting life.
-- — John 3:16

-- Create feedback status enum
DO $$ BEGIN
    CREATE TYPE feedback_status_chirho AS ENUM ('new', 'reviewed', 'resolved', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create feedback category enum
DO $$ BEGIN
    CREATE TYPE feedback_category_chirho AS ENUM ('translation_error', 'bug_report', 'feature_request', 'general', 'sword_module');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback_chirho (
    id_chirho UUID PRIMARY KEY DEFAULT generate_ulid(),
    email_chirho TEXT,
    name_chirho TEXT,
    category_chirho feedback_category_chirho NOT NULL DEFAULT 'general',
    subject_chirho TEXT NOT NULL,
    message_chirho TEXT NOT NULL,
    reference_chirho TEXT,
    status_chirho feedback_status_chirho NOT NULL DEFAULT 'new',
    created_at_chirho TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at_chirho TIMESTAMP(3) DEFAULT NOW()
);

-- Index for status filtering (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_feedback_status_chirho ON feedback_chirho(status_chirho);

-- Index for created_at (sorting)
CREATE INDEX IF NOT EXISTS idx_feedback_created_chirho ON feedback_chirho(created_at_chirho DESC);
