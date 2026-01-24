<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import { enhance } from '$app/forms';

	let { data: dataChirho } = $props();

	let filterChirho = $state<'all' | 'new' | 'reviewed' | 'resolved'>('all');
	let categoryFilterChirho = $state<'all' | 'bug' | 'suggestion' | 'praise'>('all');
	let selectedFeedbackChirho = $state<number | null>(null);
	let replyTextChirho = $state('');

	const filteredFeedbackChirho = $derived(
		dataChirho.feedbackChirho.filter((itemChirho) => {
			if (filterChirho !== 'all' && itemChirho.statusChirho !== filterChirho) return false;
			if (categoryFilterChirho !== 'all' && itemChirho.categoryChirho !== categoryFilterChirho)
				return false;
			return true;
		})
	);

	function formatDateChirho(dateStrChirho: string): string {
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getCategoryColorChirho(categoryChirho: string): string {
		switch (categoryChirho) {
			case 'bug':
				return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
			case 'suggestion':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
			case 'praise':
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
		}
	}

	function getStatusColorChirho(statusChirho: string): string {
		switch (statusChirho) {
			case 'new':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
			case 'reviewed':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
			case 'resolved':
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			default:
				return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
		}
	}

	function getSentimentIconChirho(sentimentChirho: string | null): string {
		switch (sentimentChirho) {
			case 'positive':
				return '😊';
			case 'negative':
				return '😟';
			default:
				return '😐';
		}
	}
</script>

<svelte:head>
	<title>Feedback | Admin | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-2xl font-bold text-slate-800 dark:text-white">User Feedback</h1>
				<p class="text-slate-600 dark:text-slate-400">View and respond to user feedback</p>
			</div>
			<a
				href="/admin-chirho"
				class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
			>
				&larr; Back to Admin
			</a>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
				<div class="text-2xl font-bold text-slate-800 dark:text-white">{dataChirho.statsChirho.totalChirho}</div>
				<div class="text-sm text-slate-600 dark:text-slate-400">Total Feedback</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
				<div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{dataChirho.statsChirho.newChirho}</div>
				<div class="text-sm text-slate-600 dark:text-slate-400">New</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
				<div class="text-2xl font-bold text-red-600 dark:text-red-400">{dataChirho.statsChirho.bugsChirho}</div>
				<div class="text-sm text-slate-600 dark:text-slate-400">Bugs</div>
			</div>
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
				<div class="text-2xl font-bold text-green-600 dark:text-green-400">{dataChirho.statsChirho.praiseChirho}</div>
				<div class="text-sm text-slate-600 dark:text-slate-400">Praise</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="flex flex-wrap gap-4 mb-6">
			<div class="flex gap-2">
				<span class="text-sm text-slate-600 dark:text-slate-400 self-center">Status:</span>
				{#each ['all', 'new', 'reviewed', 'resolved'] as statusOptionChirho}
					<button
						class="px-3 py-1 text-sm rounded-full transition-colors {filterChirho === statusOptionChirho
							? 'bg-blue-600 text-white'
							: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}"
						onclick={() => (filterChirho = statusOptionChirho as typeof filterChirho)}
					>
						{statusOptionChirho.charAt(0).toUpperCase() + statusOptionChirho.slice(1)}
					</button>
				{/each}
			</div>
			<div class="flex gap-2">
				<span class="text-sm text-slate-600 dark:text-slate-400 self-center">Category:</span>
				{#each ['all', 'bug', 'suggestion', 'praise'] as catOptionChirho}
					<button
						class="px-3 py-1 text-sm rounded-full transition-colors {categoryFilterChirho === catOptionChirho
							? 'bg-blue-600 text-white'
							: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}"
						onclick={() => (categoryFilterChirho = catOptionChirho as typeof categoryFilterChirho)}
					>
						{catOptionChirho.charAt(0).toUpperCase() + catOptionChirho.slice(1)}
					</button>
				{/each}
			</div>
		</div>

		<!-- Feedback List -->
		{#if filteredFeedbackChirho.length === 0}
			<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
				<p class="text-slate-500 dark:text-slate-400">No feedback found</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredFeedbackChirho as itemChirho (itemChirho.idChirho)}
					<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
						<!-- Feedback Header -->
						<div class="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-3">
							<span class="text-lg">{getSentimentIconChirho(itemChirho.aiSentimentChirho)}</span>
							<span class="px-2 py-0.5 text-xs font-medium rounded-full {getCategoryColorChirho(itemChirho.categoryChirho)}">
								{itemChirho.categoryChirho}
							</span>
							<span class="px-2 py-0.5 text-xs font-medium rounded-full {getStatusColorChirho(itemChirho.statusChirho)}">
								{itemChirho.statusChirho}
							</span>
							<span class="text-sm text-slate-500 dark:text-slate-400">
								{formatDateChirho(itemChirho.createdAtChirho)}
							</span>
							{#if itemChirho.userNameChirho || itemChirho.userEmailChirho || itemChirho.emailChirho}
								<span class="text-sm text-slate-600 dark:text-slate-400">
									from <strong>{itemChirho.userNameChirho || itemChirho.emailChirho || itemChirho.userEmailChirho}</strong>
								</span>
							{/if}
							{#if itemChirho.pageUrlChirho}
								<a
									href={itemChirho.pageUrlChirho}
									class="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-auto"
									target="_blank"
								>
									View Page
								</a>
							{/if}
						</div>

						<!-- Message -->
						<div class="p-4">
							<p class="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{itemChirho.messageChirho}</p>

							{#if itemChirho.adminReplyChirho}
								<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
									<p class="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Admin Reply:</p>
									<p class="text-sm text-blue-700 dark:text-blue-400">{itemChirho.adminReplyChirho}</p>
								</div>
							{/if}
						</div>

						<!-- Actions -->
						<div class="px-4 pb-4 flex flex-wrap gap-2">
							<!-- Status Update -->
							<form method="POST" action="?/updateStatusChirho" use:enhance class="inline">
								<input type="hidden" name="feedbackIdChirho" value={itemChirho.idChirho} />
								{#if itemChirho.statusChirho !== 'reviewed'}
									<button
										type="submit"
										name="statusChirho"
										value="reviewed"
										class="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
									>
										Mark Reviewed
									</button>
								{/if}
								{#if itemChirho.statusChirho !== 'resolved'}
									<button
										type="submit"
										name="statusChirho"
										value="resolved"
										class="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
									>
										Mark Resolved
									</button>
								{/if}
							</form>

							<!-- Reply Toggle -->
							<button
								type="button"
								class="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
								onclick={() => (selectedFeedbackChirho = selectedFeedbackChirho === itemChirho.idChirho ? null : itemChirho.idChirho)}
							>
								{selectedFeedbackChirho === itemChirho.idChirho ? 'Cancel' : 'Reply'}
							</button>

							<!-- Delete -->
							<form method="POST" action="?/deleteChirho" use:enhance class="inline ml-auto">
								<input type="hidden" name="feedbackIdChirho" value={itemChirho.idChirho} />
								<button
									type="submit"
									class="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
									onclick={(e) => {
										if (!confirm('Are you sure you want to delete this feedback?')) {
											e.preventDefault();
										}
									}}
								>
									Delete
								</button>
							</form>
						</div>

						<!-- Reply Form -->
						{#if selectedFeedbackChirho === itemChirho.idChirho}
							<div class="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4">
								<form method="POST" action="?/addReplyChirho" use:enhance>
									<input type="hidden" name="feedbackIdChirho" value={itemChirho.idChirho} />
									<textarea
										name="replyChirho"
										rows="3"
										class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Write your reply..."
										bind:value={replyTextChirho}
									></textarea>
									<div class="mt-2 flex justify-end">
										<button
											type="submit"
											class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
										>
											Send Reply
										</button>
									</div>
								</form>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
