// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { describe, it, expect } from 'vitest';
import { ulidChirho, decodeTimeChirho, UlidErrorChirho } from '$lib/shared-chirho/ulid-chirho';

describe('ulidChirho', () => {
	it('generates a valid ULID string', () => {
		const idChirho = ulidChirho();

		// Should be in UUID-like format with dashes
		expect(idChirho).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
	});

	it('generates unique IDs', () => {
		const idsChirho = new Set<string>();
		for (let iChirho = 0; iChirho < 100; iChirho++) {
			idsChirho.add(ulidChirho());
		}
		expect(idsChirho.size).toBe(100);
	});

	it('encodes timestamp at the beginning', () => {
		const nowChirho = Date.now();
		const idChirho = ulidChirho(nowChirho);
		const decodedChirho = decodeTimeChirho(idChirho);

		// Should decode to approximately the same time (within 1 second)
		expect(Math.abs(decodedChirho.getTime() - nowChirho)).toBeLessThan(1000);
	});

	it('generates lexicographically sortable IDs within same millisecond', () => {
		const timestampChirho = Date.now();
		const idsChirho: string[] = [];

		for (let iChirho = 0; iChirho < 10; iChirho++) {
			idsChirho.push(ulidChirho(timestampChirho));
		}

		const sortedChirho = [...idsChirho].sort();
		expect(idsChirho).toEqual(sortedChirho);
	});
});

describe('decodeTimeChirho', () => {
	it('decodes timestamp from ULID', () => {
		const nowChirho = Date.now();
		const idChirho = ulidChirho(nowChirho);
		const decodedChirho = decodeTimeChirho(idChirho);

		expect(decodedChirho).toBeInstanceOf(Date);
		expect(decodedChirho.getTime()).toBe(nowChirho);
	});

	it('throws UlidErrorChirho for malformed ULID', () => {
		expect(() => decodeTimeChirho('invalid')).toThrow(UlidErrorChirho);
		expect(() => decodeTimeChirho('invalid')).toThrow('malformed ulid');
	});

	it('throws for too short string', () => {
		expect(() => decodeTimeChirho('12345678')).toThrow(UlidErrorChirho);
	});
});
