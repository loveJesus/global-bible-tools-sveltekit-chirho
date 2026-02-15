<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	const curlTerseChirho = `curl -H "X-API-Key: your-key" \\
  "https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/spa/john/3"`;

	const curlReadersChirho = `curl -H "X-API-Key: your-key" \\
  "https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/hin/genesis/1?type=readers"`;

	const curlPlainChirho = `curl -H "X-API-Key: your-key" \\
  "https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-chirho/hin/genesis/1?type=readers&format=plain"`;

	const curlUpstreamChirho = `curl -H "X-API-Key: your-key" \\
  "https://global-tools.bible.systems/api-chirho/v1-chirho/glosses-upstream-chirho/spa/2samuel/2"`;

	let copiedIdChirho = $state<string | null>(null);

	async function copyToClipboardChirho(textChirho: string, idChirho: string) {
		await navigator.clipboard.writeText(textChirho);
		copiedIdChirho = idChirho;
		setTimeout(() => { if (copiedIdChirho === idChirho) copiedIdChirho = null; }, 2000);
	}

	const jsonExampleChirho = `{
  "language_chirho": "hin",
  "book_chirho": "genesis",
  "chapter_chirho": 1,
  "translation_type_chirho": "terse",
  "coverage_chirho": {
    "total_words_chirho": 544,
    "glossed_words_chirho": 544,
    "percentage_chirho": 100
  },
  "verses_chirho": [
    {
      "verse_chirho": 1,
      "words_chirho": [
        {
          "id_chirho": "0100100101",
          "source_chirho": "\u05D1\u05B0\u05BC\u05E8\u05B5\u05D0\u05E9\u05C1\u05B4\u05BC\u0596\u05D9\u05EA",
          "lemma_id_chirho": "H7225",
          "gloss_chirho": "\u092E\u0947\u0902\u2013\u0906\u0926\u093F",
          "state_chirho": "UNAPPROVED"
        }
      ]
    }
  ]
}`;
</script>

<svelte:head>
	<title>API Documentation - Global Bible Tools</title>
	<meta name="description" content="REST API documentation for the Global Bible Tools interlinear Bible translation platform" />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 sm:py-12">
	<h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">API Documentation</h1>
	<p class="text-slate-600 dark:text-slate-400 mb-8">REST API for accessing interlinear Bible translations in 21+ languages.</p>

	<!-- Base URL -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Base URL</h2>
		<code class="block bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-lg text-sm font-mono">https://global-tools.bible.systems/api-chirho/v1-chirho</code>
	</section>

	<!-- Authentication -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Authentication</h2>
		<p class="text-slate-600 dark:text-slate-400 mb-3">All requests require an API key sent via one of these headers:</p>
		<div class="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 space-y-2 font-mono text-sm">
			<div class="text-slate-700 dark:text-slate-300">Authorization: Bearer <span class="text-blue-600 dark:text-blue-400">&lt;api-key&gt;</span></div>
			<div class="text-slate-700 dark:text-slate-300">X-API-Key: <span class="text-blue-600 dark:text-blue-400">&lt;api-key&gt;</span></div>
		</div>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-2">Contact us to request an API key.</p>
	</section>

	<!-- Endpoints -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Endpoints</h2>

		<!-- Books -->
		<div class="border border-slate-200 dark:border-slate-700 rounded-lg mb-6 overflow-hidden">
			<div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/books-chirho</code>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-600 dark:text-slate-400">List all 66 Bible books with verse counts.</p>
			</div>
		</div>

		<!-- Languages -->
		<div class="border border-slate-200 dark:border-slate-700 rounded-lg mb-6 overflow-hidden">
			<div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/languages-chirho</code>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-600 dark:text-slate-400">List available languages with translation coverage percentages.</p>
			</div>
		</div>

		<!-- Verses -->
		<div class="border border-slate-200 dark:border-slate-700 rounded-lg mb-6 overflow-hidden">
			<div class="bg-slate-50 dark:bg-slate-800 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/verses-chirho/<span class="text-blue-600 dark:text-blue-400">:book</span>/<span class="text-blue-600 dark:text-blue-400">:chapter</span></code>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-600 dark:text-slate-400 mb-3">Get source text (Hebrew/Greek) words for a chapter.</p>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Path Parameters</h4>
				<table class="w-full text-sm">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">book</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Book name (e.g., "Genesis", "John", "Jhn") or book ID (1-66)</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">chapter</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Chapter number</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Verses Upstream -->
		<div class="border border-amber-200 dark:border-amber-800 rounded-lg mb-6 overflow-hidden">
			<div class="bg-amber-50 dark:bg-amber-900/30 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/verses-upstream-chirho/<span class="text-blue-600 dark:text-blue-400">:book</span>/<span class="text-blue-600 dark:text-blue-400">:chapter</span></code>
				<span class="ml-auto text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">Upstream Compat</span>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-600 dark:text-slate-400 mb-3">Source text words with upstream-compatible word IDs. Remaps 86 OT verses where multi-word proper names (e.g., Ish-Bosheth, Nergal-sharezer, Pahath-moab) were combined into single entries in the upstream platform.</p>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Path Parameters</h4>
				<table class="w-full text-sm mb-3">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">book</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Book name (e.g., "2Samuel", "Jeremiah") or book ID (1-66)</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">chapter</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Chapter number</td>
						</tr>
					</tbody>
				</table>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Response Notes</h4>
				<ul class="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
					<li>Includes <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">upstream_remap_chirho: true/false</code> indicating if any verse in the chapter was remapped</li>
					<li>Affected books: 1Sa, 2Sa, 1Ki, 2Ki, 1Ch, 2Ch, Ezr, Neh, Job, SoS, Isa, Jer, Ezk, Dan, Zec</li>
					<li>When words are merged, IDs are renumbered sequentially to match upstream</li>
				</ul>
			</div>
		</div>

		<!-- Glosses Upstream -->
		<div class="border border-amber-200 dark:border-amber-800 rounded-lg mb-6 overflow-hidden">
			<div class="bg-amber-50 dark:bg-amber-900/30 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/glosses-upstream-chirho/<span class="text-blue-600 dark:text-blue-400">:language</span>/<span class="text-blue-600 dark:text-blue-400">:book</span>/<span class="text-blue-600 dark:text-blue-400">:chapter</span></code>
				<span class="ml-auto text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">Upstream Compat</span>
			</div>
			<div class="px-4 py-3">
				<p class="text-slate-600 dark:text-slate-400 mb-3">Glosses with upstream-compatible word IDs. Same remapping as verses-upstream, with glosses from merged words concatenated with a space.</p>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Path Parameters</h4>
				<table class="w-full text-sm mb-3">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">language</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">ISO 639-3 language code (e.g., "spa", "hin")</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">book</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Book name or ID</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">chapter</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Chapter number</td>
						</tr>
					</tbody>
				</table>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Query Parameters</h4>
				<table class="w-full text-sm mb-3">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">type</td>
							<td class="py-2 text-slate-600 dark:text-slate-400"><code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">terse</code> (default) or <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">readers</code></td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">format</td>
							<td class="py-2 text-slate-600 dark:text-slate-400"><code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">plain</code> to strip en-dashes</td>
						</tr>
					</tbody>
				</table>
				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Response Notes</h4>
				<ul class="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
					<li>Includes <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">upstream_remap_chirho: true/false</code></li>
					<li>Merged words have their glosses concatenated (e.g., "Ish" + "Boshet" &rarr; "Ish Boshet")</li>
					<li>Supports both <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">?type=terse</code> and <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">?type=readers</code></li>
				</ul>
			</div>
		</div>

		<!-- Glosses (main endpoint) -->
		<div class="border-2 border-blue-200 dark:border-blue-800 rounded-lg mb-6 overflow-hidden">
			<div class="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 flex items-center gap-3">
				<span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">GET</span>
				<code class="text-sm font-mono text-slate-800 dark:text-slate-200">/glosses-chirho/<span class="text-blue-600 dark:text-blue-400">:language</span>/<span class="text-blue-600 dark:text-blue-400">:book</span>/<span class="text-blue-600 dark:text-blue-400">:chapter</span></code>
			</div>
			<div class="px-4 py-4">
				<p class="text-slate-600 dark:text-slate-400 mb-4">Get word-by-word glosses (translations) for a chapter. This is the primary endpoint for accessing interlinear translations.</p>

				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Path Parameters</h4>
				<table class="w-full text-sm mb-4">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">language</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">ISO 639-3 language code (e.g., "spa", "hin", "ben", "heb", "arb")</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">book</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Book name or ID</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">chapter</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Chapter number</td>
						</tr>
					</tbody>
				</table>

				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Query Parameters</h4>
				<table class="w-full text-sm mb-4">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap align-top">type</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">
								<p class="mb-1">Translation style. Default: <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">terse</code></p>
								<ul class="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-1">
									<li><code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">terse</code> &mdash; Word-by-word interlinear (strict 1:1 mapping, source word order preserved)</li>
									<li><code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">readers</code> &mdash; Natural reading glosses (contextually natural phrasing, smoother to read)</li>
								</ul>
							</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap align-top">format</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">
								<p class="mb-1">Gloss formatting. Default: raw (en-dashes preserved)</p>
								<ul class="list-disc list-inside text-slate-500 dark:text-slate-400 space-y-1">
									<li><code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">plain</code> &mdash; Strip en-dashes from glosses. Language-aware behavior:
										<ul class="list-disc list-inside ml-5 mt-1 space-y-1">
											<li><strong>Hebrew, Arabic:</strong> parts are joined (e.g., <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">the&ndash;heavens</code> &rarr; <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">theheavens</code>)</li>
											<li><strong>All other languages:</strong> en-dash replaced with space (e.g., <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">the&ndash;heavens</code> &rarr; <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">the heavens</code>)</li>
										</ul>
									</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>

				<h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Response Fields</h4>
				<table class="w-full text-sm">
					<tbody>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">language_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Language code</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">book_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Book identifier as provided</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">chapter_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Chapter number</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">translation_type_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">"terse" or "readers"</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">coverage_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Object with total_words_chirho, glossed_words_chirho, percentage_chirho</td>
						</tr>
						<tr class="border-t border-slate-100 dark:border-slate-700">
							<td class="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">verses_chirho</td>
							<td class="py-2 text-slate-600 dark:text-slate-400">Array of verse objects, each with words_chirho array</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- Examples -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Examples</h2>

		<!-- Example 1: Basic terse -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Word-by-word (terse) glosses</h3>
			<div class="relative group">
				<button
					type="button"
					onclick={() => copyToClipboardChirho(curlTerseChirho, 'terse')}
					class="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
					aria-label="Copy to clipboard"
				>
					{#if copiedIdChirho === 'terse'}
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
					{/if}
				</button>
				<pre class="bg-slate-950 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-emerald-300 rounded-lg p-4 pr-12 text-sm overflow-x-auto"><code>{curlTerseChirho}</code></pre>
			</div>
		</div>

		<!-- Example 2: Readers -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Natural reading (readers) glosses</h3>
			<div class="relative group">
				<button
					type="button"
					onclick={() => copyToClipboardChirho(curlReadersChirho, 'readers')}
					class="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
					aria-label="Copy to clipboard"
				>
					{#if copiedIdChirho === 'readers'}
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
					{/if}
				</button>
				<pre class="bg-slate-950 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-emerald-300 rounded-lg p-4 pr-12 text-sm overflow-x-auto"><code>{curlReadersChirho}</code></pre>
			</div>
		</div>

		<!-- Example 3: Plain format -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Plain format (en-dashes stripped)</h3>
			<div class="relative group">
				<button
					type="button"
					onclick={() => copyToClipboardChirho(curlPlainChirho, 'plain')}
					class="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
					aria-label="Copy to clipboard"
				>
					{#if copiedIdChirho === 'plain'}
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
					{/if}
				</button>
				<pre class="bg-slate-950 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-emerald-300 rounded-lg p-4 pr-12 text-sm overflow-x-auto"><code>{curlPlainChirho}</code></pre>
			</div>
		</div>

		<!-- Example 4: Upstream -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Upstream-compatible glosses (remapped word IDs)</h3>
			<div class="relative group">
				<button
					type="button"
					onclick={() => copyToClipboardChirho(curlUpstreamChirho, 'upstream')}
					class="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
					aria-label="Copy to clipboard"
				>
					{#if copiedIdChirho === 'upstream'}
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
					{/if}
				</button>
				<pre class="bg-slate-950 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-emerald-300 rounded-lg p-4 pr-12 text-sm overflow-x-auto"><code>{curlUpstreamChirho}</code></pre>
			</div>
		</div>

		<!-- Example response -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Example Response</h3>
			<div class="relative group">
				<button
					type="button"
					onclick={() => copyToClipboardChirho(jsonExampleChirho, 'json')}
					class="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
					aria-label="Copy to clipboard"
				>
					{#if copiedIdChirho === 'json'}
						<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
					{/if}
				</button>
				<pre class="bg-slate-950 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-amber-300 rounded-lg p-4 pr-12 text-sm overflow-x-auto"><code>{jsonExampleChirho}</code></pre>
			</div>
		</div>
	</section>

	<!-- Available Languages -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Available Languages</h2>
		<p class="text-slate-600 dark:text-slate-400 mb-3">Complete Bible translations (100% coverage) are available in:</p>
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
			{#each [
				{ codeChirho: 'eng', nameChirho: 'English' },
				{ codeChirho: 'spa', nameChirho: 'Spanish' },
				{ codeChirho: 'por', nameChirho: 'Portuguese' },
				{ codeChirho: 'fra', nameChirho: 'French' },
				{ codeChirho: 'deu', nameChirho: 'German' },
				{ codeChirho: 'ita', nameChirho: 'Italian' },
				{ codeChirho: 'rus', nameChirho: 'Russian' },
				{ codeChirho: 'tur', nameChirho: 'Turkish' },
				{ codeChirho: 'arb', nameChirho: 'Arabic' },
				{ codeChirho: 'hin', nameChirho: 'Hindi' },
				{ codeChirho: 'ben', nameChirho: 'Bengali' },
				{ codeChirho: 'urd', nameChirho: 'Urdu' },
				{ codeChirho: 'tam', nameChirho: 'Tamil' },
				{ codeChirho: 'ind', nameChirho: 'Indonesian' },
				{ codeChirho: 'jav', nameChirho: 'Javanese' },
				{ codeChirho: 'kor', nameChirho: 'Korean' },
				{ codeChirho: 'zho', nameChirho: 'Chinese (Simplified)' },
				{ codeChirho: 'heb', nameChirho: 'Modern Hebrew' },
				{ codeChirho: 'mya', nameChirho: 'Burmese' },
				{ codeChirho: 'swa', nameChirho: 'Swahili' },
				{ codeChirho: 'amh', nameChirho: 'Amharic' }
			] as langChirho}
				<div class="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded">
					<code class="text-blue-600 dark:text-blue-400 font-mono text-xs">{langChirho.codeChirho}</code>
					<span class="text-slate-700 dark:text-slate-300">{langChirho.nameChirho}</span>
				</div>
			{/each}
		</div>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-3">Use the <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">/languages-chirho</code> endpoint for the full list with live coverage data.</p>
	</section>

	<!-- En-dash explanation -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">About En-Dashes in Glosses</h2>
		<p class="text-slate-600 dark:text-slate-400 mb-3">
			Interlinear translations map each source word to a target-language gloss. When a single source word maps to multiple target-language words (e.g., a preposition fused with an article), they are joined with an en-dash (<code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">&ndash;</code>, U+2013).
		</p>
		<div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-3">
			<p class="text-sm text-slate-700 dark:text-slate-300 mb-2"><strong>Example:</strong> Hebrew <span dir="rtl" class="font-serif">&#x05D1;&#x05B0;&#x05BC;&#x05E8;&#x05B5;&#x05D0;&#x05E9;&#x05C1;&#x05B4;&#x05BC;&#x0596;&#x05D9;&#x05EA;</span> (b'reshit) = one word meaning "in the beginning"</p>
			<ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
				<li>Raw gloss: <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">in&ndash;beginning</code></li>
				<li>With <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">?format=plain</code>: <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">in beginning</code></li>
			</ul>
		</div>
		<p class="text-slate-600 dark:text-slate-400">
			Use <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">?format=plain</code> if you want clean text without en-dashes. For Hebrew and Arabic, parts are concatenated (no separator) since these scripts naturally join. For all other languages, en-dashes are replaced with a space.
		</p>
	</section>

	<!-- Translation Types -->
	<section class="mb-10">
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Translation Types</h2>
		<div class="grid sm:grid-cols-2 gap-4">
			<div class="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
				<h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Terse (Word-by-Word)</h3>
				<p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Strict 1:1 mapping preserving source word order. Each Hebrew/Greek word gets one literal gloss.</p>
				<div class="bg-slate-50 dark:bg-slate-800 rounded p-3 text-sm">
					<p class="text-slate-500 dark:text-slate-400 mb-1">Genesis 1:1 (Hindi terse):</p>
					<p class="text-slate-800 dark:text-slate-200" dir="ltr">&#x092E;&#x0947;&#x0902;&ndash;&#x0906;&#x0926;&#x093F; &#x0938;&#x0943;&#x091C;&#x093E; &#x092A;&#x0930;&#x092E;&#x0947;&#x0936;&#x094D;&#x0935;&#x0930; &#x0915;&#x094B; &#x0906;&#x0915;&#x093E;&#x0936; &#x0914;&#x0930;&ndash;&#x0915;&#x094B; &#x092A;&#x0943;&#x0925;&#x094D;&#x0935;&#x0940;</p>
				</div>
			</div>
			<div class="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/10">
				<h3 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Readers (Natural Reading)</h3>
				<p class="text-sm text-slate-600 dark:text-slate-400 mb-3">Contextually natural phrasing. Still one gloss per source word, but expressed more naturally.</p>
				<div class="bg-white dark:bg-slate-800 rounded p-3 text-sm">
					<p class="text-slate-500 dark:text-slate-400 mb-1">Genesis 1:1 (Hindi readers):</p>
					<p class="text-slate-800 dark:text-slate-200" dir="ltr">&#x0906;&#x0926;&#x093F;&ndash;&#x092E;&#x0947;&#x0902; &#x0938;&#x0943;&#x091C;&#x093E; &#x090F;&#x0932;&#x094B;&#x0939;&#x0940;&#x092E; &#x0915;&#x094B; &#x0909;&#x0938;&ndash;&#x0906;&#x0915;&#x093E;&#x0936; &#x0914;&#x0930;&ndash;&#x0915;&#x094B; &#x0909;&#x0938;&ndash;&#x092A;&#x0943;&#x0925;&#x094D;&#x0935;&#x0940;</p>
				</div>
			</div>
		</div>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-3">Readers translations are currently available for Hindi. More languages coming soon.</p>
	</section>

	<!-- Rate limits / notes -->
	<section>
		<h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Notes</h2>
		<ul class="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
			<li>The API returns JSON with <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">_chirho</code> suffixed field names (our naming convention).</li>
			<li>Book names are case-insensitive and accept many abbreviations (e.g., "Gen", "Gn", "genesis", or "1").</li>
			<li>The JSON documentation is also available at <a href="/api-chirho/v1-chirho" class="text-blue-600 dark:text-blue-400 hover:underline">/api-chirho/v1-chirho</a> (requires API key).</li>
			<li>All data is freely available for non-commercial use. Please attribute "Global Bible Tools" in your application.</li>
		</ul>
	</section>
</div>
