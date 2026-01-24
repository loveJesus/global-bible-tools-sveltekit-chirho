<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } =
		$props();

	let searchQueryChirho = $state('');
	let showAddModalChirho = $state(false);
	let editingLanguageChirho = $state<(typeof dataChirho.languagesChirho)[0] | null>(null);

	// Filter languages by search query
	const filteredLanguagesChirho = $derived(
		dataChirho.languagesChirho.filter(
			(langChirho) =>
				langChirho.nameChirho.toLowerCase().includes(searchQueryChirho.toLowerCase()) ||
				langChirho.codeChirho.toLowerCase().includes(searchQueryChirho.toLowerCase())
		)
	);

	// Calculate total words in Bible (estimate: ~900k for OT+NT)
	const totalWordsChirho = 900000;

	function getProgressClassChirho(percentChirho: number): string {
		if (percentChirho >= 80) return 'bg-emerald-500';
		if (percentChirho >= 50) return 'bg-blue-500';
		if (percentChirho >= 20) return 'bg-amber-500';
		return 'bg-slate-300';
	}
</script>

<svelte:head>
	<title>{$tChirho('admin.languagesChirho.titleChirho')} | {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-800">{$tChirho('admin.languagesChirho.titleChirho')}</h1>
				<p class="mt-2 text-slate-600">
					{$tChirho('admin.languagesChirho.subtitleChirho')} ({dataChirho.languagesChirho.length})
				</p>
			</div>
			<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">{$tChirho('admin.backToAdminChirho')}</a>
		</div>

		<!-- Success/Error Messages -->
		{#if formChirho?.successChirho}
			<div
				class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm"
			>
				{formChirho.messageChirho}
			</div>
		{/if}
		{#if formChirho?.errorChirho}
			<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
				{formChirho.errorChirho}
			</div>
		{/if}

		<!-- Search and Add -->
		<div class="mt-6 flex gap-4 items-center">
			<div class="flex-1 relative">
				<input
					type="text"
					placeholder={$tChirho('admin.languagesChirho.searchPlaceholderChirho')}
					bind:value={searchQueryChirho}
					class="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<svg
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
			<button
				type="button"
				onclick={() => (showAddModalChirho = true)}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				{$tChirho('admin.languagesChirho.addLanguageChirho')}
			</button>
		</div>

		<!-- Languages Table -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-50 border-b border-slate-200">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.languageChirho')}</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.codeChirho')}</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.membersChirho')}</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.progressChirho')}</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.dirChirho')}</th
						>
						<th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
							>{$tChirho('admin.languagesChirho.tableHeadersChirho.actionsChirho')}</th
						>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100">
					{#each filteredLanguagesChirho as langChirho}
						{@const progressPercentChirho = Math.min(
							100,
							Math.round((langChirho.wordCountChirho / totalWordsChirho) * 100)
						)}
						{@const approvedPercentChirho = Math.min(
							100,
							Math.round((langChirho.approvedCountChirho / totalWordsChirho) * 100)
						)}
						<tr class="hover:bg-slate-50">
							<td class="px-6 py-4">
								<div class="flex items-center gap-3">
									<div>
										<div class="font-medium text-slate-900">{langChirho.nameChirho}</div>
										<div class="text-xs text-slate-500">{langChirho.fontChirho}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="font-mono text-sm text-slate-600">{langChirho.codeChirho}</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-slate-600">{langChirho.memberCountChirho}</span>
							</td>
							<td class="px-6 py-4">
								<div class="w-32">
									<div class="flex justify-between text-xs text-slate-500 mb-1">
										<span>{langChirho.wordCountChirho.toLocaleString()} {$tChirho('admin.languagesChirho.wordsChirho')}</span>
										<span>{progressPercentChirho}%</span>
									</div>
									<div class="h-2 bg-slate-200 rounded-full overflow-hidden">
										<div
											class="h-full {getProgressClassChirho(approvedPercentChirho)}"
											style="width: {approvedPercentChirho}%"
										></div>
									</div>
									<div class="text-xs text-slate-400 mt-0.5">
										{langChirho.approvedCountChirho.toLocaleString()} {$tChirho('admin.languagesChirho.approvedChirho')}
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span
									class="px-2 py-0.5 text-xs rounded {langChirho.textDirectionChirho === 'rtl'
										? 'bg-purple-100 text-purple-700'
										: 'bg-slate-100 text-slate-600'}"
								>
									{langChirho.textDirectionChirho.toUpperCase()}
								</span>
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex justify-end gap-2">
									<a
										href="/read-chirho/{langChirho.codeChirho}"
										class="text-blue-600 hover:text-blue-800 text-sm"
									>
										{$tChirho('admin.languagesChirho.viewChirho')}
									</a>
									<a
										href="/admin-chirho/languages-chirho/{langChirho.codeChirho}/settings-chirho"
										class="text-emerald-600 hover:text-emerald-800 text-sm"
									>
										{$tChirho('admin.languagesChirho.settingsChirho')}
									</a>
									<a
										href="/admin-chirho/languages-chirho/{langChirho.codeChirho}/snapshots-chirho"
										class="text-purple-600 hover:text-purple-800 text-sm"
									>
										{$tChirho('admin.languagesChirho.snapshotsChirho')}
									</a>
									<button
										type="button"
										onclick={() => (editingLanguageChirho = langChirho)}
										class="text-slate-600 hover:text-slate-800 text-sm"
									>
										{$tChirho('admin.languagesChirho.editChirho')}
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filteredLanguagesChirho.length === 0}
				<div class="px-6 py-12 text-center text-slate-500">
					{#if searchQueryChirho}
						{$tChirho('admin.languagesChirho.noMatchChirho')} "{searchQueryChirho}"
					{:else}
						{$tChirho('admin.languagesChirho.noLanguagesChirho')}
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Add Language Modal -->
{#if showAddModalChirho}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button
			type="button"
			class="absolute inset-0 bg-black/50"
			onclick={() => (showAddModalChirho = false)}
			aria-label="Close modal"
		></button>
		<div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
			<h2 class="text-xl font-semibold text-slate-800">{$tChirho('admin.languagesChirho.addModalChirho.titleChirho')}</h2>

			<form method="POST" action="?/addLanguageChirho" use:enhanceChirho class="mt-4 space-y-4">
				<div>
					<label for="code" class="block text-sm font-medium text-slate-700">{$tChirho('admin.languagesChirho.addModalChirho.codeChirho')}</label>
					<input
						type="text"
						id="code"
						name="codeChirho"
						required
						maxlength="3"
						pattern="[a-z]{'{'}3{'}'}"
						placeholder={$tChirho('admin.languagesChirho.addModalChirho.codePlaceholderChirho')}
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<p class="mt-1 text-xs text-slate-500">{$tChirho('admin.languagesChirho.addModalChirho.codeHintChirho')}</p>
				</div>

				<div>
					<label for="name" class="block text-sm font-medium text-slate-700">{$tChirho('admin.languagesChirho.addModalChirho.nameChirho')}</label>
					<input
						type="text"
						id="name"
						name="nameChirho"
						required
						placeholder={$tChirho('admin.languagesChirho.addModalChirho.namePlaceholderChirho')}
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="font" class="block text-sm font-medium text-slate-700">{$tChirho('admin.languagesChirho.addModalChirho.fontChirho')}</label>
					<input
						type="text"
						id="font"
						name="fontChirho"
						value="Noto Sans"
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="textDirection" class="block text-sm font-medium text-slate-700"
						>{$tChirho('admin.languagesChirho.addModalChirho.textDirectionChirho')}</label
					>
					<select
						id="textDirection"
						name="textDirectionChirho"
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="ltr">{$tChirho('admin.languagesChirho.addModalChirho.ltrChirho')}</option>
						<option value="rtl">{$tChirho('admin.languagesChirho.addModalChirho.rtlChirho')}</option>
					</select>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => (showAddModalChirho = false)}
						class="px-4 py-2 text-slate-600 hover:text-slate-800"
					>
						{$tChirho('admin.languagesChirho.addModalChirho.cancelChirho')}
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						{$tChirho('admin.languagesChirho.addModalChirho.addChirho')}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Language Modal -->
{#if editingLanguageChirho}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<button
			type="button"
			class="absolute inset-0 bg-black/50"
			onclick={() => (editingLanguageChirho = null)}
			aria-label="Close modal"
		></button>
		<div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
			<h2 class="text-xl font-semibold text-slate-800">{$tChirho('admin.languagesChirho.editModalChirho.titleChirho')}</h2>

			<form method="POST" action="?/updateLanguageChirho" use:enhanceChirho class="mt-4 space-y-4">
				<input type="hidden" name="idChirho" value={editingLanguageChirho.idChirho} />

				<div>
					<label for="edit-code" class="block text-sm font-medium text-slate-700">{$tChirho('admin.languagesChirho.addModalChirho.codeChirho')}</label>
					<input
						type="text"
						id="edit-code"
						disabled
						value={editingLanguageChirho.codeChirho}
						class="mt-1 w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500"
					/>
					<p class="mt-1 text-xs text-slate-500">{$tChirho('admin.languagesChirho.editModalChirho.codeDisabledChirho')}</p>
				</div>

				<div>
					<label for="edit-name" class="block text-sm font-medium text-slate-700"
						>{$tChirho('admin.languagesChirho.addModalChirho.nameChirho')}</label
					>
					<input
						type="text"
						id="edit-name"
						name="nameChirho"
						required
						value={editingLanguageChirho.nameChirho}
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="edit-font" class="block text-sm font-medium text-slate-700">{$tChirho('admin.languagesChirho.addModalChirho.fontChirho')}</label>
					<input
						type="text"
						id="edit-font"
						name="fontChirho"
						value={editingLanguageChirho.fontChirho}
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="edit-textDirection" class="block text-sm font-medium text-slate-700"
						>{$tChirho('admin.languagesChirho.addModalChirho.textDirectionChirho')}</label
					>
					<select
						id="edit-textDirection"
						name="textDirectionChirho"
						class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="ltr" selected={editingLanguageChirho.textDirectionChirho === 'ltr'}
							>{$tChirho('admin.languagesChirho.addModalChirho.ltrChirho')}</option
						>
						<option value="rtl" selected={editingLanguageChirho.textDirectionChirho === 'rtl'}
							>{$tChirho('admin.languagesChirho.addModalChirho.rtlChirho')}</option
						>
					</select>
				</div>

				<div class="flex justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => (editingLanguageChirho = null)}
						class="px-4 py-2 text-slate-600 hover:text-slate-800"
					>
						{$tChirho('admin.languagesChirho.addModalChirho.cancelChirho')}
					</button>
					<button
						type="submit"
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						{$tChirho('admin.languagesChirho.editModalChirho.saveChirho')}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
