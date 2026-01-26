// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { pgTable, text, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql as sqlChirho } from 'drizzle-orm';

// Feedback status enum
export const feedbackStatusEnumChirho = pgEnum('feedback_status_chirho', [
	'new',
	'reviewed',
	'resolved',
	'archived'
]);

// Feedback category enum
export const feedbackCategoryEnumChirho = pgEnum('feedback_category_chirho', [
	'translation_error',
	'bug_report',
	'feature_request',
	'general',
	'sword_module'
]);

// Feedback table
export const feedbackTableChirho = pgTable('feedback_chirho', {
	idChirho: uuid('id_chirho')
		.primaryKey()
		.default(sqlChirho`generate_ulid()`),
	emailChirho: text('email_chirho'),
	nameChirho: text('name_chirho'),
	categoryChirho: feedbackCategoryEnumChirho('category_chirho').default('general').notNull(),
	subjectChirho: text('subject_chirho').notNull(),
	messageChirho: text('message_chirho').notNull(),
	referenceChirho: text('reference_chirho'), // e.g., "John 3:16" or "GBTIntSpa"
	statusChirho: feedbackStatusEnumChirho('status_chirho').default('new').notNull(),
	createdAtChirho: timestamp('created_at_chirho', { precision: 3 })
		.default(sqlChirho`now()`)
		.notNull(),
	updatedAtChirho: timestamp('updated_at_chirho', { precision: 3 }).default(sqlChirho`now()`)
});

// Type exports
export type FeedbackChirho = typeof feedbackTableChirho.$inferSelect;
export type NewFeedbackChirho = typeof feedbackTableChirho.$inferInsert;
