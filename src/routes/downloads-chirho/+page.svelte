<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { tChirho } from '$lib/i18n-chirho';

	interface PdfDownloadChirho {
		nameChirho: string;
		descriptionChirho: string;
		pathChirho: string;
		sizeChirho: string;
		versesChirho: string;
		badgeChirho?: string;
	}

	const downloadsChirho: PdfDownloadChirho[] = [
		{
			nameChirho: 'KJV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and King James Version text',
			pathChirho: '/bibles-chirho/interlinear-eng-kjv-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'WEB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with English word-by-word translation and World English Bible text',
			pathChirho: '/bibles-chirho/interlinear-eng-web-chirho.pdf',
			sizeChirho: '137 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Spanish RV1909 Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Spanish word-by-word translation and Reina-Valera 1909 text',
			pathChirho: '/bibles-chirho/interlinear-spa-rv1909-chirho.pdf',
			sizeChirho: '134 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Portuguese Almeida Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Portuguese word-by-word translation and Almeida 1911 text',
			pathChirho: '/bibles-chirho/interlinear-por-almeida1911-chirho.pdf',
			sizeChirho: '136 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Hindi ERV Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Hindi Easy-to-Read Version text',
			pathChirho: '/bibles-chirho/interlinear-hin-hinerv-chirho.pdf',
			sizeChirho: '139 MB',
			versesChirho: '31,102'
		},
		{
			nameChirho: 'Hindi FBI Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Hindi word-by-word translation and Free Bible India text. Larger fonts for easier reading.',
			pathChirho: '/bibles-chirho/interlinear-hin-large-hinfbi-chirho.pdf',
			sizeChirho: '141 MB',
			versesChirho: '31,102',
			badgeChirho: 'Large Font'
		},
		{
			nameChirho: 'Bengali 2006EB Interlinear Bible',
			descriptionChirho: 'Hebrew & Greek text with Bengali word-by-word translation and Bengali 2006 Easy Bible text',
			pathChirho: '/bibles-chirho/interlinear-ben-ben2006eb-chirho.pdf',
			sizeChirho: '140 MB',
			versesChirho: '31,102'
		}
	];
</script>

<svelte:head>
	<title>{$tChirho('common.downloadsChirho.titleChirho')} | {$tChirho('common.appNameChirho')}</title>
	<meta name="description" content={$tChirho('common.downloadsChirho.metaDescriptionChirho')} />
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<header class="text-center mb-12">
			<h1 class="text-3xl font-bold text-slate-800">{$tChirho('common.downloadsChirho.interlinearDownloadsChirho')}</h1>
			<p class="mt-2 text-slate-600">
				{$tChirho('common.downloadsChirho.freePdfDownloadsChirho')}
			</p>
		</header>

		<div class="grid gap-6">
			{#each downloadsChirho as downloadChirho}
				<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h2 class="text-xl font-semibold text-slate-800">{downloadChirho.nameChirho}</h2>
								{#if downloadChirho.badgeChirho}
									<span class="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
										{downloadChirho.badgeChirho}
									</span>
								{/if}
							</div>
							<p class="mt-1 text-slate-600">{downloadChirho.descriptionChirho}</p>
							<div class="mt-3 flex items-center gap-4 text-sm text-slate-500">
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									PDF
								</span>
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
									</svg>
									{downloadChirho.sizeChirho}
								</span>
								<span class="flex items-center gap-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
									{downloadChirho.versesChirho} verses
								</span>
							</div>
						</div>
						<a
							href={downloadChirho.pathChirho}
							download
							class="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							{$tChirho('common.actionsChirho.downloadChirho')}
						</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
			<h3 class="font-semibold text-blue-800">{$tChirho('common.downloadsChirho.aboutDownloadsChirho')}</h3>
			<p class="mt-2 text-blue-700 text-sm">
				{$tChirho('common.downloadsChirho.aboutDescription1Chirho')}
			</p>
			<p class="mt-2 text-blue-700 text-sm">
				{$tChirho('common.downloadsChirho.aboutDescription2Chirho')}
			</p>
		</div>

		<footer class="mt-8 text-center text-sm text-slate-500">
			<a href="/" class="text-blue-600 hover:underline">← {$tChirho('common.navChirho.homeChirho')}</a>
		</footer>
	</div>
</div>
