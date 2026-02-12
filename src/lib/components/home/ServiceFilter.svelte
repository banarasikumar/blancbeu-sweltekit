<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Sparkles, Scissors, UserCheck, Palette, Droplet } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	let activeCategory = 'All';

	const categories = [
		{ id: 'All', label: 'All', icon: Sparkles },
		{ id: 'Hair', label: 'Hair', icon: Scissors },
		{ id: 'Skin', label: 'Skin', icon: UserCheck },
		{ id: 'Makeup', label: 'Makeup', icon: Palette },
		{ id: 'Spa', label: 'Spa', icon: Droplet }
		// Add more as needed
	];

	function selectCategory(category: string) {
		activeCategory = category;
		dispatch('filter', category);
	}
</script>

<div class="service-filter-bar">
	<div class="filter-container">
		{#each categories as cat}
			<button
				class="filter-btn"
				class:active={activeCategory === cat.id}
				on:click={() => selectCategory(cat.id)}
			>
				<div class="icon-wrapper">
					<svelte:component this={cat.icon} size={16} />
				</div>
				<span>{cat.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.service-filter-bar {
		/* Removed sticky positioning and glass background per user request */
		/* position: sticky; */
		/* top: 60px; */
		z-index: 10; /* Lower z-index */
		background: transparent;
		padding: 10px 0;
		margin-bottom: 20px;
		/* border-bottom: 1px solid rgba(255, 215, 0, 0.1); */
	}

	.filter-container {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		padding: 0 20px;
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE 10+ */
	}

	.filter-container::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}

	.filter-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
		color: var(--color-text-secondary);
		white-space: nowrap;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.filter-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(212, 175, 55, 0.3);
		transform: translateY(-1px);
	}

	.filter-btn.active {
		background: var(--gradient-gold);
		color: #000;
		border-color: transparent;
		box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
		font-weight: 600;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
	}
</style>
