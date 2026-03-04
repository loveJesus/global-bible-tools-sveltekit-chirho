<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import type { PageData as PageDataChirho, ActionData as ActionDataChirho } from './$types';
	import { enhance as enhanceChirho } from '$app/forms';

	let { data: dataChirho, form: formChirho }: { data: PageDataChirho; form: ActionDataChirho } = $props();
	let loadingChirho = $state(false);
</script>

<svelte:head>
	<title>Reset Password | Global Bible Tools</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
	<div class="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-8">
		<h1 class="text-2xl font-bold text-slate-800 text-center">Reset Password</h1>

		{#if !dataChirho.validChirho}
			<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
				{dataChirho.errorChirho}
			</div>
			<div class="mt-4 text-center">
				<a href="/forgot-password-chirho" class="text-blue-600 hover:underline text-sm">Request a new reset link</a>
			</div>
		{:else}
			<p class="mt-2 text-slate-600 text-center">Enter your new password</p>

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
					<label for="password" class="block text-sm font-medium text-slate-700 mb-1">
						New Password
					</label>
					<input
						type="password"
						id="password"
						name="passwordChirho"
						required
						minlength="8"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="At least 8 characters"
					/>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1">
						Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPasswordChirho"
						required
						minlength="8"
						class="w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						placeholder="Re-enter your password"
					/>
				</div>

				<button
					type="submit"
					disabled={loadingChirho}
					class="w-full rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				>
					{loadingChirho ? 'Resetting...' : 'Reset Password'}
				</button>
			</form>
		{/if}

		<div class="mt-6 text-center">
			<a href="/login-chirho" class="text-blue-600 hover:underline text-sm">Back to Login</a>
		</div>
	</div>
</div>
