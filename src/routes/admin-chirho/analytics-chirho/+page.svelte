<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	// Calculate percentages
	const approvalRateChirho = $derived(
		dataChirho.overviewStatsChirho.totalGlossesChirho > 0
			? Math.round(
					(dataChirho.overviewStatsChirho.approvedGlossesChirho /
						dataChirho.overviewStatsChirho.totalGlossesChirho) *
						100
				)
			: 0
	);

	// Group activity by date
	const activityByDateChirho = $derived(() => {
		const groupedChirho = new Map<string, typeof dataChirho.recentActivityChirho>();
		for (const activityChirho of dataChirho.recentActivityChirho) {
			const existingChirho = groupedChirho.get(activityChirho.dateChirho) || [];
			existingChirho.push(activityChirho);
			groupedChirho.set(activityChirho.dateChirho, existingChirho);
		}
		return Array.from(groupedChirho.entries()).slice(0, 7);
	});

	function formatNumberChirho(numChirho: number): string {
		if (numChirho >= 1000000) {
			return (numChirho / 1000000).toFixed(1) + 'M';
		}
		if (numChirho >= 1000) {
			return (numChirho / 1000).toFixed(1) + 'K';
		}
		return numChirho.toString();
	}

	function getProgressColorChirho(percentChirho: number): string {
		if (percentChirho >= 80) return 'bg-emerald-500 dark:bg-emerald-400';
		if (percentChirho >= 50) return 'bg-blue-500 dark:bg-blue-400';
		if (percentChirho >= 20) return 'bg-amber-500 dark:bg-amber-400';
		return 'bg-slate-300 dark:bg-slate-600';
	}
</script>

<svelte:head>
	<title>{$tChirho('admin.analyticsChirho.titleChirho')} | {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-bold text-slate-800 dark:text-white">{$tChirho('admin.analyticsChirho.titleChirho')}</h1>
				<p class="text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.subtitleChirho')}</p>
			</div>
			<a
				href="/admin-chirho"
				class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
			>
				{$tChirho('admin.backToAdminChirho')}
			</a>
		</div>

		<!-- Overview Stats -->
		<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<div class="text-3xl font-bold text-slate-900 dark:text-white">
					{formatNumberChirho(dataChirho.overviewStatsChirho.totalLanguagesChirho)}
				</div>
				<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.overviewChirho.languagesChirho')}</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<div class="text-3xl font-bold text-slate-900 dark:text-white">
					{formatNumberChirho(dataChirho.overviewStatsChirho.totalUsersChirho)}
				</div>
				<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.overviewChirho.activeUsersChirho')}</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<div class="text-3xl font-bold text-slate-900 dark:text-white">
					{formatNumberChirho(dataChirho.overviewStatsChirho.totalGlossesChirho)}
				</div>
				<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.overviewChirho.totalGlossesChirho')}</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
					{formatNumberChirho(dataChirho.overviewStatsChirho.approvedGlossesChirho)}
				</div>
				<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.overviewChirho.approvedChirho')} ({approvalRateChirho}%)</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
					{formatNumberChirho(dataChirho.overviewStatsChirho.machineGlossesChirho)}
				</div>
				<div class="text-sm text-slate-600 dark:text-slate-400 mt-1">{$tChirho('admin.analyticsChirho.overviewChirho.machineGlossesChirho')}</div>
			</div>
		</div>

		<div class="grid md:grid-cols-2 gap-6">
			<!-- Language Progress -->
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">{$tChirho('admin.analyticsChirho.languageProgressChirho.titleChirho')}</h2>
				<div class="space-y-4 max-h-96 overflow-y-auto">
					{#each dataChirho.languageProgressChirho as langChirho}
						{@const progressChirho =
							langChirho.wordCountChirho > 0
								? Math.round((langChirho.approvedCountChirho / langChirho.wordCountChirho) * 100)
								: 0}
						<div class="border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0">
							<div class="flex justify-between items-center mb-1">
								<a
									href="/admin-chirho/languages-chirho/{langChirho.codeChirho}/settings-chirho"
									class="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
								>
									{langChirho.nameChirho}
									<span class="text-slate-400 dark:text-slate-500 font-normal">({langChirho.codeChirho})</span>
								</a>
								<span class="text-sm text-slate-500 dark:text-slate-400">
									{langChirho.memberCountChirho} {$tChirho('admin.analyticsChirho.languageProgressChirho.membersChirho')}
								</span>
							</div>
							<div class="flex items-center gap-3">
								<div class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
									<div
										class="h-full {getProgressColorChirho(progressChirho)}"
										style="width: {progressChirho}%"
									></div>
								</div>
								<span class="text-sm text-slate-600 dark:text-slate-400 min-w-[4rem] text-right">
									{formatNumberChirho(langChirho.approvedCountChirho)} / {formatNumberChirho(
										langChirho.wordCountChirho
									)}
								</span>
							</div>
						</div>
					{/each}

					{#if dataChirho.languageProgressChirho.length === 0}
						<p class="text-slate-500 dark:text-slate-400 text-center py-8">{$tChirho('admin.analyticsChirho.languageProgressChirho.noLanguagesChirho')}</p>
					{/if}
				</div>
			</div>

			<!-- Recent Activity -->
			<div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">{$tChirho('admin.analyticsChirho.recentActivityChirho.titleChirho')}</h2>
				<div class="space-y-4 max-h-96 overflow-y-auto">
					{#each activityByDateChirho() as [dateChirho, activitiesChirho]}
						<div class="border-b border-slate-100 dark:border-slate-700 pb-3 last:border-0">
							<div class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
								{new Date(dateChirho).toLocaleDateString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric'
								})}
							</div>
							{#each activitiesChirho as activityChirho}
								<div class="flex justify-between items-center py-1">
									<span class="text-slate-700 dark:text-slate-300">{activityChirho.languageNameChirho}</span>
									<div class="text-sm">
										<span class="text-slate-600 dark:text-slate-400">{activityChirho.glossCountChirho} {$tChirho('admin.analyticsChirho.recentActivityChirho.glossesChirho')}</span>
										{#if activityChirho.approvedCountChirho > 0}
											<span class="text-emerald-600 dark:text-emerald-400 ml-2">
												({activityChirho.approvedCountChirho} {$tChirho('admin.analyticsChirho.recentActivityChirho.approvedChirho')})
											</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{/each}

					{#if dataChirho.recentActivityChirho.length === 0}
						<p class="text-slate-500 dark:text-slate-400 text-center py-8">{$tChirho('admin.analyticsChirho.recentActivityChirho.noActivityChirho')}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Book Progress Grid (for top languages) -->
		{#if dataChirho.bookProgressChirho.length > 0}
			<div class="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
				<h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">
					{$tChirho('admin.analyticsChirho.bookProgressChirho.titleChirho')}
				</h2>

				<div class="overflow-x-auto">
					<div class="flex gap-4 mb-4">
						{#each dataChirho.topLanguagesChirho as codeChirho}
							<div
								class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
							>
								{codeChirho}
							</div>
						{/each}
					</div>

					<!-- Old Testament -->
					<div class="mb-4">
						<h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{$tChirho('admin.analyticsChirho.bookProgressChirho.oldTestamentChirho')}</h3>
						<div class="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1">
							{#each Array.from(new Set(dataChirho.bookProgressChirho.filter((bChirho) => bChirho.bookIdChirho <= 39).map((bChirho) => bChirho.bookIdChirho))) as bookIdChirho}
								{@const bookChirho = dataChirho.bookProgressChirho.find(
									(bChirho) => bChirho.bookIdChirho === bookIdChirho
								)}
								{@const avgProgressChirho =
									bookChirho && bookChirho.totalWordsChirho > 0
										? Math.round(
												(dataChirho.bookProgressChirho
													.filter((bChirho) => bChirho.bookIdChirho === bookIdChirho)
													.reduce((sumChirho, bChirho) => sumChirho + bChirho.approvedCountChirho, 0) /
													dataChirho.topLanguagesChirho.length /
													bookChirho.totalWordsChirho) *
													100
											)
										: 0}
								<div
									class="aspect-square rounded flex items-center justify-center text-xs font-medium {avgProgressChirho >=
									80
										? 'bg-emerald-500 text-white'
										: avgProgressChirho >= 50
											? 'bg-blue-500 text-white'
											: avgProgressChirho >= 20
												? 'bg-amber-500 text-white'
												: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}"
									title="{bookChirho?.bookNameChirho}: {avgProgressChirho}% avg"
								>
									{bookChirho?.bookNameChirho.slice(0, 3)}
								</div>
							{/each}
						</div>
					</div>

					<!-- New Testament -->
					<div>
						<h3 class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{$tChirho('admin.analyticsChirho.bookProgressChirho.newTestamentChirho')}</h3>
						<div class="grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1">
							{#each Array.from(new Set(dataChirho.bookProgressChirho.filter((bChirho) => bChirho.bookIdChirho > 39).map((bChirho) => bChirho.bookIdChirho))) as bookIdChirho}
								{@const bookChirho = dataChirho.bookProgressChirho.find(
									(bChirho) => bChirho.bookIdChirho === bookIdChirho
								)}
								{@const avgProgressChirho =
									bookChirho && bookChirho.totalWordsChirho > 0
										? Math.round(
												(dataChirho.bookProgressChirho
													.filter((bChirho) => bChirho.bookIdChirho === bookIdChirho)
													.reduce((sumChirho, bChirho) => sumChirho + bChirho.approvedCountChirho, 0) /
													dataChirho.topLanguagesChirho.length /
													bookChirho.totalWordsChirho) *
													100
											)
										: 0}
								<div
									class="aspect-square rounded flex items-center justify-center text-xs font-medium {avgProgressChirho >=
									80
										? 'bg-emerald-500 text-white'
										: avgProgressChirho >= 50
											? 'bg-blue-500 text-white'
											: avgProgressChirho >= 20
												? 'bg-amber-500 text-white'
												: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}"
									title="{bookChirho?.bookNameChirho}: {avgProgressChirho}% avg"
								>
									{bookChirho?.bookNameChirho.slice(0, 3)}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
