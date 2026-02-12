<script lang="ts">
	export let currentPoints = 0;
	export let nextTierThreshold = 5000;
	export let currentTierName = 'Gold';
	export let nextTierName = 'Platinum';

	$: progressPercent = Math.min(100, Math.max(0, (currentPoints / nextTierThreshold) * 100));
</script>

<div class="tier-card glass-panel">
	<div class="tier-header">
		<span class="tier-label">{currentTierName} Tier</span>
		<span class="tier-next"
			>{currentPoints.toLocaleString()} / {nextTierThreshold.toLocaleString()} to {nextTierName}</span
		>
	</div>

	<div class="progress-track">
		<div class="progress-fill" style="width: {progressPercent}%"></div>
	</div>

	<div class="tier-benefits">
		<div class="benefit-tag">
			<span>✓ 15% Discount</span>
		</div>
		<div class="benefit-tag">
			<span>✓ Free Shipping</span>
		</div>
	</div>
</div>

<style>
	.tier-card {
		background: var(--color-bg-glass);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-lg);
		padding: 20px;
		margin-bottom: 24px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	.tier-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.tier-label {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		background: var(--gradient-gold);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.tier-next {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.progress-track {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: var(--radius-full);
		margin-bottom: 16px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--gradient-gold);
		border-radius: var(--radius-full);
		box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
		transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.tier-benefits {
		display: flex;
		gap: 12px;
	}

	.benefit-tag {
		font-size: 0.75rem;
		color: var(--color-text-primary);
		background: rgba(255, 255, 255, 0.05);
		padding: 4px 10px;
		border-radius: var(--radius-full);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
</style>
