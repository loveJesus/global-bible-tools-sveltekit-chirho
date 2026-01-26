<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { form: formChirho }: { form: ActionDataChirho } = $props();
</script>

<svelte:head>
	<title>Feedback - Global Bible Tools</title>
	<meta
		name="description"
		content="Submit feedback, report translation errors, or suggest improvements for Global Bible Tools."
	/>
</svelte:head>

<main class="min-h-screen bg-slate-50 py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<div class="bg-white rounded-xl shadow-md p-8">
			<h1 class="text-3xl font-bold text-slate-900 mb-2">Submit Feedback</h1>
			<p class="text-slate-600 mb-8">
				Help us improve Global Bible Tools. Report translation errors, suggest features, or share
				your thoughts.
			</p>

			{#if formChirho?.successChirho}
				<div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
					<div class="flex items-center gap-2">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						<span class="font-medium">{formChirho.messageChirho}</span>
					</div>
				</div>
			{/if}

			{#if formChirho?.errorChirho}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
					{formChirho.errorChirho}
				</div>
			{/if}

			<form method="POST" use:enhanceChirho class="space-y-6">
				<!-- Category -->
				<div>
					<label for="category" class="block text-sm font-medium text-slate-700 mb-1">
						Category
					</label>
					<select
						id="category"
						name="categoryChirho"
						class="w-full rounded-lg border border-slate-300 px-3 py-2.5 bg-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
					>
						<option value="general">General Feedback</option>
						<option value="translation_error">Translation Error</option>
						<option value="sword_module">SWORD Module Issue</option>
						<option value="bug_report">Bug Report</option>
						<option value="feature_request">Feature Request</option>
					</select>
				</div>

				<!-- Name (optional) -->
				<div>
					<label for="name" class="block text-sm font-medium text-slate-700 mb-1">
						Name <span class="text-slate-400">(optional)</span>
					</label>
					<input
						type="text"
						id="name"
						name="nameChirho"
						value={formChirho?.nameChirho ?? ''}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Your name"
					/>
				</div>

				<!-- Email (optional) -->
				<div>
					<label for="email" class="block text-sm font-medium text-slate-700 mb-1">
						Email <span class="text-slate-400">(optional, for follow-up)</span>
					</label>
					<input
						type="email"
						id="email"
						name="emailChirho"
						value={formChirho?.emailChirho ?? ''}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="your@email.com"
					/>
				</div>

				<!-- Reference (optional) -->
				<div>
					<label for="reference" class="block text-sm font-medium text-slate-700 mb-1">
						Reference <span class="text-slate-400">(optional, e.g., "John 3:16" or "GBTIntSpa")</span
						>
					</label>
					<input
						type="text"
						id="reference"
						name="referenceChirho"
						value={formChirho?.referenceChirho ?? ''}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="e.g., Genesis 1:1, GBTIntHin"
					/>
				</div>

				<!-- Subject -->
				<div>
					<label for="subject" class="block text-sm font-medium text-slate-700 mb-1">
						Subject <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="subject"
						name="subjectChirho"
						value={formChirho?.subjectChirho ?? ''}
						required
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Brief summary of your feedback"
					/>
				</div>

				<!-- Message -->
				<div>
					<label for="message" class="block text-sm font-medium text-slate-700 mb-1">
						Message <span class="text-red-500">*</span>
					</label>
					<textarea
						id="message"
						name="messageChirho"
						required
						rows="6"
						class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Please describe your feedback in detail...">{formChirho?.messageChirho ?? ''}</textarea
					>
				</div>

				<!-- Submit -->
				<button
					type="submit"
					class="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
				>
					Submit Feedback
				</button>
			</form>

			<div class="mt-8 pt-6 border-t border-slate-200">
				<h2 class="text-lg font-semibold text-slate-800 mb-3">About Our Translations</h2>
				<div class="text-sm text-slate-600 space-y-2">
					<p>
						Our translations are <strong>machine-translated, word-for-word glosses</strong> designed
						as study aids. They follow the original Hebrew/Greek word order and are
						<strong>not</strong> authoritative texts.
					</p>
					<p>
						We welcome corrections and suggestions to improve the quality of these provisional
						translations.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-slate-500 hover:text-slate-700"> Back to Home </a>
		</div>
	</div>
</main>
