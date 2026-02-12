<script lang="ts">
	import { Gem, Wallet, Calendar } from 'lucide-svelte';

	export let loyaltyPoints = 0;
	export let totalSaved = 0;
	export let bookingsCount = 0;
</script>

<div class="stats-grid">
	<div class="stat-card">
		<div class="stat-icon-wrapper">
			<Gem size={20} color="var(--color-accent-gold)" />
		</div>
		<div class="stat-content">
			<span class="stat-label">Loyalty Points</span>
			<span class="stat-value">{loyaltyPoints.toLocaleString()}</span>
		</div>
	</div>

	<div class="stat-card">
		<div class="stat-icon-wrapper">
			<Wallet size={20} color="var(--color-accent-gold)" />
		</div>
		<div class="stat-content">
			<span class="stat-label">Total Saved</span>
			<span class="stat-value">₹{totalSaved.toLocaleString()}</span>
		</div>
	</div>

	<div class="stat-card">
		<div class="stat-icon-wrapper">
			<Calendar size={20} color="#30D158" />
		</div>
		<div class="stat-content">
			<span class="stat-label">Bookings</span>
			<span class="stat-value">{bookingsCount}</span>
		</div>
	</div>
</div>

<style>
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	.stat-card {
		background: var(--color-bg-glass);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-md);
		padding: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.stat-card:active {
		transform: scale(0.98);
	}

	.stat-icon-wrapper {
		background: rgba(255, 255, 255, 0.05);
		padding: 10px;
		border-radius: 50%;
		margin-bottom: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		display: block;
		margin-bottom: 4px;
	}

	.stat-value {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
		font-family: var(--font-heading);
	}
</style>
