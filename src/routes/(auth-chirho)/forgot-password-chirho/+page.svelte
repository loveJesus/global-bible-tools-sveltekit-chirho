<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { form: formChirho }: { form: ActionDataChirho } = $props();
	let loadingChirho = $state(false);
</script>

<svelte:head>
	<title>Forgot Password | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
		<h1 class="text-2xl font-bold text-slate-800 text-center">Forgot Password</h1>
		<p class="mt-2 text-slate-600 text-center">Enter your email to receive a password reset link</p>

		{#if formChirho?.successChirho}
			<div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
				<p class="font-medium">Check your email</p>
				<p class="mt-1">If an account exists for <strong>{formChirho.emailChirho}</strong>, we've sent a password reset link. It will expire in 1 hour.</p>
			</div>
		{:else}
			{#if formChirho?.errorChirho}
				<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
					{formChirho.errorChirho}
				</div>
			{/if}

			<form
				method="POST"
				use:enhanceChirho={() => {
					loadingChirho = true;
					return async ({ update: updateChirho }) => {
						loadingChirho = false;
						await updateChirho();
					};
				}}
				class="mt-6 space-y-4"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-slate-700 mb-1">
						Email address
					</label>
					<input
						type="email"
						id="email"
						name="emailChirho"
						value={formChirho?.emailChirho ?? ''}
						required
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="you@example.com"
					/>
				</div>

				<button
					type="submit"
					disabled={loadingChirho}
					class="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{loadingChirho ? 'Sending...' : 'Send Reset Link'}
				</button>
			</form>
		{/if}

		<div class="mt-6 text-center">
			<a href="/login-chirho" class="text-blue-600 hover:underline text-sm">Back to Login</a>
		</div>
	</div>
</div>
