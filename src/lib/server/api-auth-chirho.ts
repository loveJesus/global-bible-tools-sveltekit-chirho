// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { env as envChirho } from '$env/dynamic/private';
import { error as errorChirho, type RequestEvent as RequestEventChirho } from '@sveltejs/kit';

/**
 * Validate API key from request headers
 * API key should be passed as: Authorization: Bearer <api-key>
 * Or as: X-API-Key: <api-key>
 */
export function validateApiKeyChirho(eventChirho: RequestEventChirho): void {
	const apiKeyChirho = envChirho.API_KEY_CHIRHO;

	if (!apiKeyChirho) {
		console.error('API_KEY_CHIRHO not configured');
		throw errorChirho(500, { message: 'API not configured' });
	}

	const authHeaderChirho = eventChirho.request.headers.get('Authorization');
	const xApiKeyChirho = eventChirho.request.headers.get('X-API-Key');

	let providedKeyChirho: string | null = null;

	if (authHeaderChirho?.startsWith('Bearer ')) {
		providedKeyChirho = authHeaderChirho.slice(7);
	} else if (xApiKeyChirho) {
		providedKeyChirho = xApiKeyChirho;
	}

	if (!providedKeyChirho) {
		throw errorChirho(401, { message: 'API key required. Use Authorization: Bearer <key> or X-API-Key header' });
	}

	if (providedKeyChirho !== apiKeyChirho) {
		throw errorChirho(403, { message: 'Invalid API key' });
	}
}

/**
 * JSON response helper with proper headers
 */
export function jsonResponseChirho<TChirho>(dataChirho: TChirho, statusChirho = 200): Response {
	return new Response(JSON.stringify(dataChirho), {
		status: statusChirho,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=300' // 5 minute cache
		}
	});
}

/**
 * Error response helper
 */
export function errorResponseChirho(messageChirho: string, statusChirho = 400): Response {
	return new Response(JSON.stringify({ error_chirho: messageChirho }), {
		status: statusChirho,
		headers: { 'Content-Type': 'application/json' }
	});
}
