<script lang="ts">
	import { fly } from 'svelte/transition';

	// Mock store for now - in real app would use a Svelte store
	let cartCount = 0;
	let visible = false;

	// Simulate adding items (for demo visibility)
	// visible = true; // Uncomment to force show for testing
</script>

{#if visible || cartCount > 0}
	<div class="service-cart-bar" transition:fly={{ y: 50, duration: 300 }}>
		<div class="cart-content">
			<div class="cart-info">
				<span class="cart-icon">🛍️</span>
				<span class="cart-text">
					<span class="count">{cartCount}</span> services added
				</span>
			</div>
			<button class="view-list-btn">
				View List <span class="btn-arrow">›</span>
			</button>
		</div>
	</div>
{/if}

<style>
	.service-cart-bar {
		position: fixed;
		bottom: 90px; /* Above bottom nav */
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		max-width: 400px;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(10px);
		border-radius: var(--radius-full);
		padding: 12px 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		border: 1px solid var(--color-accent-gold);
		z-index: 100;
	}

	.cart-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cart-info {
		display: flex;
		align-items: center;
		gap: 10px;
		color: white;
		font-weight: 500;
	}

	.cart-icon {
		font-size: 1.2rem;
	}

	.count {
		color: var(--color-accent-gold);
		font-weight: 700;
	}

	.view-list-btn {
		background: var(--color-accent-gold);
		color: black;
		border: none;
		border-radius: var(--radius-full);
		padding: 8px 16px;
		font-size: 0.9rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 4px;
		transition: transform 0.2s;
	}

	.view-list-btn:hover {
		transform: scale(1.05);
	}

	.btn-arrow {
		font-size: 1.2rem;
		line-height: 1;
	}
</style>
