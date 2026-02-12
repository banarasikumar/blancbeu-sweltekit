<script lang="ts">
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { Sun, Moon, Sparkles, Leaf } from 'lucide-svelte'; // Assuming lucide-svelte is installed, if not will need to install

	// Fallback icons if lucide-svelte is not installed yet (I'll install it next)

	import { onMount } from 'svelte';

	let currentTheme = $theme;

	// Subscribe to store updates
	$: currentTheme = $theme;

	const handleToggle = async () => {
		if (!document.startViewTransition) {
			toggleTheme();
			return;
		}

		await document.startViewTransition(() => {
			toggleTheme();
		}).ready;
	};
</script>

<button class="theme-toggle" on:click={handleToggle} aria-label="Toggle Theme">
	<div class="icon-wrapper" class:active={currentTheme === 'gold'}>
		<!-- Moon/Gold Icon (Dark Mode) -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg
		>
	</div>

	<div class="icon-wrapper" class:active={currentTheme === 'glitch'}>
		<!-- Sparkles/Glitch Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path
				d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
			/><path d="M5 3v4" /><path d="M9 3v4" /><path d="M5 7h4" /><path d="M9 7h4" /></svg
		>
	</div>

	<div class="icon-wrapper" class:active={currentTheme === 'clean'}>
		<!-- Leaf/Clean Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 13-11 18z" /><path
				d="M12 9v11"
			/></svg
		>
	</div>
</button>

<style>
	.theme-toggle {
		position: relative;
		width: 40px;
		height: 40px;
		background: transparent; /* Cleaner default */
		border-radius: 50%; /* Ensure perfect circle */
		border: 1px solid transparent; /* No visible border by default */
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother premium easing */
		cursor: pointer;
	}

	/* Hover effects removed for mobile-first/touch-only experience per user request */

	/* Remove default focus ring and use custom one */
	.theme-toggle:focus {
		outline: none;
	}

	.theme-toggle:focus-visible {
		outline: none;
		border-color: rgba(var(--color-accent-gold-rgb, 212, 175, 55), 0.5);
		box-shadow: 0 0 15px rgba(var(--color-accent-gold-rgb, 212, 175, 55), 0.2);
	}

	/* Ensure active state (while pressed) gives feedback but doesn't stick */
	.theme-toggle:active {
		transform: scale(0.95);
	}

	.icon-wrapper {
		position: absolute;
		opacity: 0;
		transform: rotate(90deg) scale(0);
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		color: var(--color-text-primary);
	}

	.icon-wrapper.active {
		opacity: 1;
		transform: rotate(0deg) scale(1);
		color: var(--color-accent-gold);
		filter: drop-shadow(0 0 5px var(--color-accent-gold));
	}
</style>
