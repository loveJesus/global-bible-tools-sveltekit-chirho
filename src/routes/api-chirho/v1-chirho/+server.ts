// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { RequestHandler as RequestHandlerChirho } from './$types';
import { jsonResponseChirho } from '$lib/server/api-auth-chirho';

/**
 * GET /api-chirho/v1-chirho
 * Returns API documentation
 */
export const GET: RequestHandlerChirho = async () => {
	return jsonResponseChirho({
		name_chirho: 'Global Bible Tools API',
		version_chirho: 'v1',
		authentication_chirho: {
			method_chirho: 'API Key',
			headers_chirho: ['Authorization: Bearer <api-key>', 'X-API-Key: <api-key>']
		},
		endpoints_chirho: [
			{
				path_chirho: '/api-chirho/v1-chirho/books-chirho',
				method_chirho: 'GET',
				description_chirho: 'List all Bible books with verse counts'
			},
			{
				path_chirho: '/api-chirho/v1-chirho/languages-chirho',
				method_chirho: 'GET',
				description_chirho: 'List available languages with translation coverage'
			},
			{
				path_chirho: '/api-chirho/v1-chirho/verses-chirho/:book/:chapter',
				method_chirho: 'GET',
				description_chirho: 'Get source text words for a chapter',
				params_chirho: {
					book_chirho: 'Book name (e.g., "Genesis", "John") or book ID (1-66)',
					chapter_chirho: 'Chapter number'
				}
			},
			{
				path_chirho: '/api-chirho/v1-chirho/glosses-chirho/:language/:book/:chapter',
				method_chirho: 'GET',
				description_chirho: 'Get word-by-word glosses (translations) for a chapter',
				params_chirho: {
					language_chirho: 'Language code (e.g., "spa", "hin", "ben")',
					book_chirho: 'Book name or book ID',
					chapter_chirho: 'Chapter number'
				},
				query_params_chirho: {
					type_chirho: {
						values_chirho: ['terse', 'readers'],
						default_chirho: 'terse',
						description_chirho: 'Translation style. "terse" = word-by-word interlinear, "readers" = natural reading glosses'
					},
					format_chirho: {
						values_chirho: ['plain'],
						default_chirho: 'none (raw glosses with en-dashes)',
						description_chirho: 'Set to "plain" to strip en-dashes (–) from glosses. Hebrew/Arabic: parts are joined (e.g., "the–heavens" → "theheavens"). Other languages: en-dash replaced with space (e.g., "the–heavens" → "the heavens").'
					}
				}
			}
		],
		example_chirho: {
			terse_request_chirho: 'curl -H "X-API-Key: your-key" https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/spa/john/3',
			readers_request_chirho: 'curl -H "X-API-Key: your-key" "https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/hin/genesis/1?type=readers&format=plain"',
			response_preview_chirho: '{ "language_chirho": "hin", "book_chirho": "genesis", "chapter_chirho": 1, "translation_type_chirho": "terse", ... }'
		}
	});
};
