<script lang="ts">
	import { Check } from 'lucide-svelte';

	const tiers = [
		{
			name: 'Gold',
			price: '₹2,999',
			period: '/ year',
			color: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)',
			benefits: [
				'10% off on all services',
				'Priority Booking',
				'Birthday Special Gift',
				'Quarterly Hair Spa'
			]
		},
		{
			name: 'Platinum',
			price: '₹5,999',
			period: '/ year',
			color: 'linear-gradient(135deg, #E5E4E2 0%, #BCC6CC 100%)', // Platinum/Silverish
			benefits: [
				'20% off on all services',
				'Priority Booking & Lounge Access',
				'Birthday & Anniversary Gifts',
				'Bi-monthly Hair Spa',
				'Free Consultation'
			],
			featured: true
		},
		{
			name: 'Diamond',
			price: '₹9,999',
			period: '/ year',
			color: 'linear-gradient(135deg, #b9f2ff 0%, #00d2ff 100%)', // Diamond/Blueish
			benefits: [
				'30% off on all services',
				'VVIP Lounge Access',
				'Exclusive Event Invites',
				'Monthly Hair Spa & Facial',
				'Personal Stylist Assigned',
				'Free Home Service'
			]
		}
	];
</script>

<section class="membership-section container">
	<div class="section-header">
		<h2>Membership Privileges</h2>
		<p>Elevate your experience with our exclusive tiers</p>
	</div>

	<div class="tiers-grid">
		{#each tiers as tier}
			<div
				class="tier-card {tier.featured ? 'featured' : ''}"
				style="--tier-gradient: {tier.color}"
			>
				<div class="card-header">
					<h3>{tier.name}</h3>
					<div class="price">
						<span class="amount">{tier.price}</span>
						<span class="period">{tier.period}</span>
					</div>
				</div>

				<div class="card-body">
					<ul class="benefits-list">
						{#each tier.benefits as benefit}
							<li>
								<span class="icon-check"><Check size={16} /></span>
								{benefit}
							</li>
						{/each}
					</ul>
					<button class="join-btn">Join {tier.name}</button>
				</div>
			</div>
		{/each}
	</div>
</section>

<style>
	.membership-section {
		padding-top: 60px;
		padding-bottom: 60px;
	}

	.section-header {
		text-align: center;
		margin-bottom: 40px;
	}

	.section-header h2 {
		font-size: 2rem;
		background: var(--gradient-gold);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		display: inline-block;
		margin-bottom: 8px;
		font-family: var(--font-heading);
	}

	.section-header p {
		color: var(--color-text-secondary);
	}

	.tiers-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 30px;
		align-items: center; /* Center vertically for featured card pop */
	}

	.tier-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		padding: 30px;
		position: relative;
		overflow: hidden;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.tier-card:hover {
		transform: translateY(-10px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.tier-card.featured {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--color-accent-gold);
		transform: scale(1.05); /* Slightly bigger */
		box-shadow: 0 10px 30px rgba(212, 175, 55, 0.1);
		z-index: 2;
	}

	.tier-card.featured:hover {
		transform: scale(1.05) translateY(-5px);
	}

	/* Top gradient bar */
	.tier-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 6px;
		background: var(--tier-gradient);
	}

	.card-header {
		text-align: center;
		margin-bottom: 30px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		padding-bottom: 20px;
	}

	.card-header h3 {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		margin-bottom: 10px;
		background: var(--tier-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.price .amount {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.price .period {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.benefits-list {
		list-style: none;
		padding: 0;
		margin: 0 0 30px 0;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.benefits-list li {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		color: var(--color-text-secondary);
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.icon-check {
		color: var(--color-accent-gold); /* Gold checkmarks for all */
		flex-shrink: 0;
		margin-top: 2px;
	}

	.join-btn {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--color-text-primary);
		border: 1px solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.tier-card.featured .join-btn {
		background: var(--gradient-gold);
		color: #000;
		border: none;
	}

	.tier-card:hover .join-btn {
		background: var(--tier-gradient);
		color: #000;
		border-color: transparent;
	}
</style>
