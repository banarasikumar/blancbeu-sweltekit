<script lang="ts">
	import { Menu, Moon, Sun } from 'lucide-svelte';
	import { theme, toggleTheme } from '$lib/stores/theme';

	let { title = 'Dashboard' }: { title?: string } = $props();
</script>

<header class="admin-header">
	<div class="admin-header-title">{title}</div>
	<div style="display: flex; gap: 8px;">
		<button class="admin-header-btn" onclick={toggleTheme} aria-label="Toggle Theme">
			{#if $theme === 'clean'}
				<Moon size={22} />
			{:else}
				<Sun size={22} />
			{/if}
		</button>
		<button class="admin-header-btn" aria-label="Menu">
			<Menu size={22} />
		</button>
	</div>
</header>
