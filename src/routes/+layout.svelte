<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../app.css';
	import { page as pageChirho } from '$app/state';
	import type { LayoutData as LayoutDataChirho } from './$types';
	import LocaleSwitcherChirho from '$lib/components-chirho/LocaleSwitcherChirho.svelte';
	import ThemeSwitcherChirho from '$lib/components-chirho/ThemeSwitcherChirho.svelte';
	import FeedbackBubbleChirho from '$lib/components-chirho/FeedbackBubbleChirho.svelte';
	import { tChirho, localeChirho } from '$lib/i18n-chirho';
	import { initThemeChirho } from '$lib/stores-chirho/theme-chirho';

	let { children: childrenChirho, data: dataChirho }: { children: any; data: LayoutDataChirho } = $props();

	// Initialize theme on mount
	$effect(() => {
		initThemeChirho();
	});

	// Initialize locale from server data
	$effect(() => {
		if (dataChirho.localeChirho) {
			localeChirho.set(dataChirho.localeChirho);
		}
	});

	let userMenuOpenChirho = $state(false);
	let mobileMenuOpenChirho = $state(false);

	// Hide the default header/footer on landing page (it has its own)
	const isLandingPageChirho = $derived(pageChirho.url.pathname === '/');

	// Close mobile menu on route change
	$effect(() => {
		pageChirho.url.pathname;
		mobileMenuOpenChirho = false;
	});

	function getInitialsChirho(nameChirho: string | null | undefined, emailChirho: string): string {
		if (nameChirho) {
			return nameChirho
				.split(' ')
				.map((partChirho) => partChirho[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return emailChirho[0].toUpperCase();
	}
</script>

<svelte:head>
	<title>Global Bible Tools</title>
	<meta name="description" content="Collaborative Bible translation platform" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-white dark:bg-slate-900">
	{#if !isLandingPageChirho}
	<header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
		<div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
			<div class="flex items-center gap-4 sm:gap-6">
				<!-- Mobile menu button -->
				<button
					type="button"
					onclick={() => (mobileMenuOpenChirho = !mobileMenuOpenChirho)}
					class="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpenChirho}
				>
					{#if mobileMenuOpenChirho}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					{/if}
				</button>

				<a href="/" class="flex items-center gap-2">
					<img
						src="https://assets.globalbibletools.com/landing/logo.png"
						alt="Global Bible Tools"
						class="h-8 w-8"
					/>
					<span class="text-xl font-bold text-slate-900 dark:text-white hidden xs:inline">Global Bible Tools</span>
				</a>
				<nav class="hidden sm:flex gap-4">
					<a href="/read-chirho" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{$tChirho('common.navChirho.readChirho')}</a>
					<a href="/translate-chirho" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{$tChirho('common.navChirho.translateChirho')}</a>
					<a href="/downloads-chirho" class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">{$tChirho('common.navChirho.downloadsChirho')}</a>
				</nav>
			</div>
			<div class="flex items-center gap-3">
				<ThemeSwitcherChirho />
				<LocaleSwitcherChirho />
				{#if dataChirho.userChirho}
					<div class="relative">
						<button
							type="button"
							onclick={() => (userMenuOpenChirho = !userMenuOpenChirho)}
							class="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							aria-haspopup="menu"
							aria-expanded={userMenuOpenChirho}
						>
							<div class="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
								{getInitialsChirho(dataChirho.userChirho.nameChirho, dataChirho.userChirho.emailChirho)}
							</div>
							<span class="hidden sm:block text-sm text-slate-700 dark:text-slate-300">{dataChirho.userChirho.nameChirho ?? dataChirho.userChirho.emailChirho}</span>
							<svg class="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if userMenuOpenChirho}
							<div class="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10" role="menu">
								<div class="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
									<p class="text-sm font-medium text-slate-900 dark:text-white">{dataChirho.userChirho.nameChirho ?? 'User'}</p>
									<p class="text-xs text-slate-500 dark:text-slate-400 truncate">{dataChirho.userChirho.emailChirho}</p>
								</div>

								<a href="/profile-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" role="menuitem">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									{$tChirho('common.navChirho.profileChirho')}
								</a>

								{#if dataChirho.userChirho.isAdminChirho}
									<a href="/admin-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" role="menuitem">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
										{$tChirho('common.navChirho.adminChirho')}
									</a>
								{/if}

								<div class="border-t border-slate-100 dark:border-slate-700 mt-1">
									<a href="/logout-chirho" class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" role="menuitem">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										{$tChirho('common.navChirho.logoutChirho')}
									</a>
								</div>
							</div>

							<button
								type="button"
								class="fixed inset-0 z-40 cursor-default"
								onclick={() => (userMenuOpenChirho = false)}
								onkeydown={(eChirho) => eChirho.key === 'Escape' && (userMenuOpenChirho = false)}
								aria-label="Close menu"
								tabindex="-1"
							></button>
						{/if}
					</div>
				{:else}
					<a href="/login-chirho" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">{$tChirho('common.navChirho.loginChirho')}</a>
				{/if}
			</div>
		</div>
	</header>

	<!-- Mobile navigation menu -->
	{#if mobileMenuOpenChirho}
		<div class="sm:hidden fixed inset-0 z-40">
			<!-- Backdrop -->
			<button
				type="button"
				class="absolute inset-0 bg-black/50"
				onclick={() => (mobileMenuOpenChirho = false)}
				aria-label="Close menu"
			></button>

			<!-- Slide-out menu -->
			<nav class="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl flex flex-col">
				<div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
					<span class="font-semibold text-slate-900 dark:text-white">Menu</span>
					<button
						type="button"
						onclick={() => (mobileMenuOpenChirho = false)}
						class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
						aria-label="Close menu"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="flex-1 overflow-y-auto py-2">
					<a href="/read-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
						{$tChirho('common.navChirho.readChirho')}
					</a>
					<a href="/translate-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
						</svg>
						{$tChirho('common.navChirho.translateChirho')}
					</a>
					<a href="/downloads-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						{$tChirho('common.navChirho.downloadsChirho')}
					</a>

					{#if dataChirho.userChirho}
						<div class="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
							<a href="/profile-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								{$tChirho('common.navChirho.profileChirho')}
							</a>

							{#if dataChirho.userChirho.isAdminChirho}
								<a href="/admin-chirho" class="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
									{$tChirho('common.navChirho.adminChirho')}
								</a>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Mobile menu footer -->
				<div class="border-t border-slate-200 dark:border-slate-700 p-4">
					{#if dataChirho.userChirho}
						<div class="flex items-center gap-3 mb-3">
							<div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
								{getInitialsChirho(dataChirho.userChirho.nameChirho, dataChirho.userChirho.emailChirho)}
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-slate-900 dark:text-white truncate">{dataChirho.userChirho.nameChirho ?? 'User'}</p>
								<p class="text-xs text-slate-500 dark:text-slate-400 truncate">{dataChirho.userChirho.emailChirho}</p>
							</div>
						</div>
						<a href="/logout-chirho" class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							</svg>
							{$tChirho('common.navChirho.logoutChirho')}
						</a>
					{:else}
						<a href="/login-chirho" class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
							{$tChirho('common.navChirho.loginChirho')}
						</a>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
	{/if}

	<main class="flex-1">
		{@render childrenChirho()}
	</main>

	{#if !isLandingPageChirho}
	<footer class="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
		<div class="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500 dark:text-slate-400">
			Global Bible Tools - Collaborative Bible translation platform
		</div>
	</footer>
	{/if}

	<!-- Feedback bubble - appears on all pages -->
	<FeedbackBubbleChirho />
</div>
