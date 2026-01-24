<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho } from './$types';
	import { tChirho } from '$lib/i18n-chirho';

	let { data: dataChirho }: { data: PageDataChirho } = $props();

	let filterStatusChirho = $state<'all' | 'success' | 'failed' | 'pending'>('all');

	// Filter jobs by status
	const filteredJobsChirho = $derived(
		dataChirho.jobsChirho.filter((jobChirho) => {
			if (filterStatusChirho === 'all') return true;
			if (filterStatusChirho === 'success') return jobChirho.succeededChirho === true;
			if (filterStatusChirho === 'failed') return jobChirho.succeededChirho === false;
			if (filterStatusChirho === 'pending')
				return jobChirho.succeededChirho === null && jobChirho.endDateChirho === null;
			return true;
		})
	);

	function formatDateChirho(dateStringChirho: string): string {
		const dateChirho = new Date(dateStringChirho);
		return dateChirho.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDurationChirho(secondsChirho: number | null): string {
		if (secondsChirho === null) return '—';
		if (secondsChirho < 60) return `${secondsChirho}s`;
		const minutesChirho = Math.floor(secondsChirho / 60);
		const remainingSecondsChirho = secondsChirho % 60;
		if (minutesChirho < 60) return `${minutesChirho}m ${remainingSecondsChirho}s`;
		const hoursChirho = Math.floor(minutesChirho / 60);
		const remainingMinutesChirho = minutesChirho % 60;
		return `${hoursChirho}h ${remainingMinutesChirho}m`;
	}

	function getStatusBadgeChirho(
		succeededChirho: boolean | null,
		endDateChirho: string | null
	): { classChirho: string; keyChirho: string } {
		if (succeededChirho === true) {
			return { classChirho: 'bg-emerald-100 text-emerald-700', keyChirho: 'successChirho' };
		}
		if (succeededChirho === false) {
			return { classChirho: 'bg-red-100 text-red-700', keyChirho: 'failedChirho' };
		}
		if (endDateChirho === null) {
			return { classChirho: 'bg-blue-100 text-blue-700', keyChirho: 'runningChirho' };
		}
		return { classChirho: 'bg-slate-100 text-slate-700', keyChirho: 'unknownChirho' };
	}
</script>

<svelte:head>
	<title>{$tChirho('admin.jobsChirho.titleChirho')} | {$tChirho('common.appNameChirho')}</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold text-slate-800">{$tChirho('admin.jobsChirho.titleChirho')}</h1>
				<p class="mt-2 text-slate-600">{$tChirho('admin.jobsChirho.subtitleChirho')}</p>
			</div>
			<a href="/admin-chirho" class="text-blue-600 hover:underline text-sm">{$tChirho('admin.backToAdminChirho')}</a>
		</div>

		<!-- Stats Cards -->
		<div class="mt-8 grid gap-4 md:grid-cols-4">
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
				<div class="text-2xl font-bold text-slate-900">
					{dataChirho.statsChirho.totalJobsChirho}
				</div>
				<div class="text-sm text-slate-500">{$tChirho('admin.jobsChirho.statsChirho.totalChirho')}</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-emerald-200 p-4">
				<div class="text-2xl font-bold text-emerald-600">
					{dataChirho.statsChirho.successfulJobsChirho}
				</div>
				<div class="text-sm text-slate-500">{$tChirho('admin.jobsChirho.statsChirho.successfulChirho')}</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-red-200 p-4">
				<div class="text-2xl font-bold text-red-600">
					{dataChirho.statsChirho.failedJobsChirho}
				</div>
				<div class="text-sm text-slate-500">{$tChirho('admin.jobsChirho.statsChirho.failedChirho')}</div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-blue-200 p-4">
				<div class="text-2xl font-bold text-blue-600">
					{dataChirho.statsChirho.pendingJobsChirho}
				</div>
				<div class="text-sm text-slate-500">{$tChirho('admin.jobsChirho.statsChirho.runningChirho')}</div>
			</div>
		</div>

		<!-- Filter -->
		<div class="mt-6 flex gap-2">
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'all'
					? 'bg-slate-800 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'all')}
			>
				{$tChirho('admin.jobsChirho.filterChirho.allChirho')}
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'success'
					? 'bg-emerald-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'success')}
			>
				{$tChirho('admin.jobsChirho.filterChirho.successChirho')}
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'failed'
					? 'bg-red-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'failed')}
			>
				{$tChirho('admin.jobsChirho.filterChirho.failedChirho')}
			</button>
			<button
				type="button"
				class="px-3 py-1.5 rounded text-sm {filterStatusChirho === 'pending'
					? 'bg-blue-600 text-white'
					: 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-300'}"
				onclick={() => (filterStatusChirho = 'pending')}
			>
				{$tChirho('admin.jobsChirho.filterChirho.runningChirho')}
			</button>
		</div>

		<!-- Jobs Table -->
		<div class="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
			{#if filteredJobsChirho.length > 0}
				<table class="w-full">
					<thead class="bg-slate-50 border-b border-slate-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>{$tChirho('admin.jobsChirho.tableHeadersChirho.languageChirho')}</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>{$tChirho('admin.jobsChirho.tableHeadersChirho.startedChirho')}</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>{$tChirho('admin.jobsChirho.tableHeadersChirho.durationChirho')}</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>{$tChirho('admin.jobsChirho.tableHeadersChirho.userChirho')}</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
								>{$tChirho('admin.jobsChirho.tableHeadersChirho.statusChirho')}</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each filteredJobsChirho as jobChirho}
							{@const statusChirho = getStatusBadgeChirho(
								jobChirho.succeededChirho,
								jobChirho.endDateChirho
							)}
							<tr class="hover:bg-slate-50">
								<td class="px-6 py-4">
									<div>
										<div class="font-medium text-slate-900">{jobChirho.languageNameChirho}</div>
										<div class="text-xs text-slate-500 font-mono">
											{jobChirho.languageCodeChirho}
										</div>
									</div>
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{formatDateChirho(jobChirho.startDateChirho)}
								</td>
								<td class="px-6 py-4 text-sm text-slate-600">
									{formatDurationChirho(jobChirho.durationSecondsChirho)}
								</td>
								<td class="px-6 py-4">
									{#if jobChirho.userNameChirho || jobChirho.userEmailChirho}
										<div class="text-sm text-slate-600">
											{jobChirho.userNameChirho ?? jobChirho.userEmailChirho}
										</div>
									{:else}
										<span class="text-sm text-slate-400">{$tChirho('admin.jobsChirho.systemUserChirho')}</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<span class="px-2 py-0.5 text-xs rounded {statusChirho.classChirho}">
										{$tChirho(`admin.jobsChirho.statusChirho.${statusChirho.keyChirho}`)}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<div class="px-6 py-12 text-center text-slate-500">
					{#if filterStatusChirho !== 'all'}
						{$tChirho('admin.jobsChirho.noJobsFilteredChirho')} ({filterStatusChirho})
					{:else}
						{$tChirho('admin.jobsChirho.noJobsChirho')}
					{/if}
				</div>
			{/if}
		</div>

		<!-- Help Text -->
		<div class="mt-4 text-sm text-slate-500">
			<p>
				{$tChirho('admin.jobsChirho.helpTextChirho')}
			</p>
		</div>
	</div>
</div>
