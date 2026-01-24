// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { describe, it, expect } from 'vitest';
import { PasswordChirho } from '$lib/modules-chirho/users-chirho/model-chirho/password-chirho';

describe('PasswordChirho', () => {
	describe('createChirho', () => {
		it('creates a hashed password', async () => {
			const passwordChirho = await PasswordChirho.createChirho('TestPassword123!');

			expect(passwordChirho).toBeInstanceOf(PasswordChirho);
			expect(passwordChirho.hashChirho).toBeDefined();
			expect(passwordChirho.hashChirho).not.toBe('TestPassword123!');
		});

		it('generates different hashes for same password', async () => {
			const passwordChirho1 = await PasswordChirho.createChirho('SamePassword');
			const passwordChirho2 = await PasswordChirho.createChirho('SamePassword');

			// Scrypt should use different salts, resulting in different hashes
			expect(passwordChirho1.hashChirho).not.toBe(passwordChirho2.hashChirho);
		});
	});

	describe('verifyChirho', () => {
		it('verifies correct password', async () => {
			const originalChirho = 'CorrectPassword123!';
			const passwordChirho = await PasswordChirho.createChirho(originalChirho);

			const isValidChirho = await passwordChirho.verifyChirho(originalChirho);
			expect(isValidChirho).toBe(true);
		});

		it('rejects incorrect password', async () => {
			const passwordChirho = await PasswordChirho.createChirho('CorrectPassword');

			const isValidChirho = await passwordChirho.verifyChirho('WrongPassword');
			expect(isValidChirho).toBe(false);
		});

		it('rejects similar but different password', async () => {
			const passwordChirho = await PasswordChirho.createChirho('Password123');

			const isValidChirho = await passwordChirho.verifyChirho('Password124');
			expect(isValidChirho).toBe(false);
		});
	});

	describe('hashChirho getter', () => {
		it('returns the stored hash', async () => {
			const passwordChirho = await PasswordChirho.createChirho('TestPassword');

			expect(passwordChirho.hashChirho).toBeDefined();
			expect(typeof passwordChirho.hashChirho).toBe('string');
			expect(passwordChirho.hashChirho.length).toBeGreaterThan(0);
		});
	});

	describe('constructor', () => {
		it('accepts a pre-existing hash', async () => {
			const originalChirho = await PasswordChirho.createChirho('MyPassword');
			const hashChirho = originalChirho.hashChirho;

			// Create new instance with existing hash
			const restoredChirho = new PasswordChirho({ hashChirho });

			// Should still verify the original password
			const isValidChirho = await restoredChirho.verifyChirho('MyPassword');
			expect(isValidChirho).toBe(true);
		});
	});
});
