<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life.
     — John 3:16 -->

<script lang="ts">
	import '../../app.css';
	import type { LayoutData as LayoutDataChirho } from './$types';
	import FeedbackBubbleChirho from '$lib/components-chirho/FeedbackBubbleChirho.svelte';
	import { localeChirho, loadingChirho } from '$lib/i18n-chirho';

	let { children, data }: { children: any; data: LayoutDataChirho } = $props();

	// Initialize locale from server data (critical for hydration)
	$effect(() => {
		if (data.localeChirho) {
			localeChirho.set(data.localeChirho);
		}
	});
</script>

<!-- Wait for translations to load to avoid flash of empty text -->
{#if $loadingChirho}
	<div class="min-h-screen bg-amber-50 flex items-center justify-center">
		<div class="animate-pulse text-slate-500">Loading...</div>
	</div>
{:else}
	<!-- Landing pages have their own navigation/footer, no wrapper needed -->
	{@render children()}
{/if}

<!-- Feedback bubble - appears on all pages -->
<FeedbackBubbleChirho />
