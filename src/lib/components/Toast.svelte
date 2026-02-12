<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';

	const icons: Record<string, string> = {
		success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
		error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
		logout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
	};
</script>

<div class="toast-container">
	{#each $toasts as toast (toast.id)}
		<div
			class="toast toast-{toast.type}"
			in:fly={{ y: -50, duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div class="toast-content">
				<span class="toast-icon">{@html icons[toast.type] || icons.success}</span>
				<span class="toast-message">{toast.message}</span>
			</div>
			<div class="toast-progress"></div>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 15%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2147483647;
		display: flex;
		flex-direction: column;
		gap: 12px;
		pointer-events: none;
	}

	.toast {
		min-width: 320px;
		max-width: 90vw;
		border-radius: 24px;
		overflow: hidden;
		font-family: 'Outfit', 'Poppins', sans-serif;
		pointer-events: auto;
		border: 2px solid rgba(255, 255, 255, 0.3);
		box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.3);
	}

	.toast-success {
		background: linear-gradient(135deg, #00f260 0%, #0575e6 100%);
		color: white;
		box-shadow: 0 20px 60px -10px rgba(0, 242, 96, 0.4);
	}

	.toast-error {
		background: linear-gradient(135deg, #ff00cc 0%, #333399 100%);
		color: white;
		box-shadow: 0 20px 60px -10px rgba(255, 0, 204, 0.4);
	}

	.toast-logout {
		background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);
		color: white;
		box-shadow: 0 20px 60px -10px rgba(245, 175, 25, 0.4);
	}

	.toast-content {
		display: flex;
		align-items: center;
		padding: 20px 30px;
		gap: 20px;
		justify-content: center;
	}

	.toast-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 50%;
		width: 42px;
		height: 42px;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.toast-icon :global(svg) {
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
	}

	.toast-message {
		font-weight: 700;
		font-size: 17px;
		letter-spacing: 0.3px;
		line-height: 1.4;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		text-align: left;
	}

	.toast-progress {
		height: 5px;
		width: 100%;
		background: rgba(255, 255, 255, 0.5);
		transform-origin: left;
		animation: shrink 3s linear forwards;
		box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);
	}

	@keyframes shrink {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}

	@media (max-width: 480px) {
		.toast {
			width: 92%;
			min-width: auto;
		}
		.toast-message {
			font-size: 15px;
		}
	}
</style>
