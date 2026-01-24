// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { vi, beforeAll, beforeEach, afterAll } from 'vitest';
import pg from 'pg';

const { Client: PgClientChirho } = pg;

// Hoist database config so it's available when db module is imported
const { DATABASE_NAME_CHIRHO, DATABASE_URL_CHIRHO } = vi.hoisted(() => {
	const databaseNameChirho = `test_chirho_${process.env.VITEST_POOL_ID ?? '0'}`;
	const baseUrlChirho = process.env.TEST_DATABASE_URL_CHIRHO ?? 'postgresql://postgres:asdfasdf@localhost:5433/postgres';
	const urlChirho = new URL(baseUrlChirho);
	urlChirho.pathname = `/${databaseNameChirho}`;
	const databaseUrlChirho = urlChirho.toString();

	// Set for the app's db module to use
	process.env.DATABASE_URL_CHIRHO = databaseUrlChirho;

	return {
		DATABASE_NAME_CHIRHO: databaseNameChirho,
		DATABASE_URL_CHIRHO: databaseUrlChirho
	};
});

export { DATABASE_NAME_CHIRHO, DATABASE_URL_CHIRHO };

let dbClientChirho: InstanceType<typeof PgClientChirho> | null = null;
let appDbChirho: typeof import('$lib/server/db-chirho') | null = null;

/**
 * Initialize database isolation for tests.
 * Creates a fresh database from template before each test.
 */
export function initializeDatabaseChirho(destroyAfterChirho = true) {
	beforeAll(async () => {
		// Connect to the base test database (not the per-test one)
		const baseUrlChirho = process.env.TEST_DATABASE_URL_CHIRHO ?? 'postgresql://postgres:asdfasdf@localhost:5433/postgres';
		dbClientChirho = new PgClientChirho(baseUrlChirho);
		await dbClientChirho.connect();

		// Import app db module
		appDbChirho = await import('$lib/server/db-chirho');
	});

	beforeEach(async () => {
		if (!dbClientChirho) return;

		// Close app connection so we can drop/recreate the database
		// Note: The app db module may not have a close function yet
		// await appDbChirho?.closeChirho?.();

		// Drop and recreate database from template
		await dbClientChirho.query(`DROP DATABASE IF EXISTS ${DATABASE_NAME_CHIRHO}`);

		// Check if test_template exists, if not create from current schema
		const templateExistsChirho = await dbClientChirho.query(
			`SELECT 1 FROM pg_database WHERE datname = 'test_template_chirho'`
		);

		if (templateExistsChirho.rows.length > 0) {
			await dbClientChirho.query(
				`CREATE DATABASE ${DATABASE_NAME_CHIRHO} TEMPLATE test_template_chirho`
			);
		} else {
			// Create empty database - tests will need to handle schema
			await dbClientChirho.query(`CREATE DATABASE ${DATABASE_NAME_CHIRHO}`);
		}

		// Reconnect app db
		// await appDbChirho?.reconnectChirho?.();
	});

	afterAll(async () => {
		// Close app connection
		// await appDbChirho?.closeChirho?.();

		if (dbClientChirho) {
			if (destroyAfterChirho) {
				await dbClientChirho.query(`DROP DATABASE IF EXISTS ${DATABASE_NAME_CHIRHO}`);
			}
			await dbClientChirho.end();
			dbClientChirho = null;
		}
	});
}

/**
 * Get a direct database client for test queries
 */
export async function getTestDbClientChirho(): Promise<InstanceType<typeof PgClientChirho>> {
	const clientChirho = new PgClientChirho(DATABASE_URL_CHIRHO);
	await clientChirho.connect();
	return clientChirho;
}

/**
 * Execute a query on the test database
 */
export async function queryTestDbChirho<T = unknown>(
	sqlChirho: string,
	paramsChirho?: unknown[]
): Promise<T[]> {
	const clientChirho = await getTestDbClientChirho();
	try {
		const resultChirho = await clientChirho.query(sqlChirho, paramsChirho);
		return resultChirho.rows as T[];
	} finally {
		await clientChirho.end();
	}
}
