<script lang="ts">
</script>

<section class="about-section container section-padding" id="about">
	<div class="section-header">
		<h2 class="section-title">
			<span class="title-decoration">✨</span>
			About Blancbeu
			<span class="title-decoration">✨</span>
		</h2>
		<p class="section-subtitle">Where Beauty Meets Excellence</p>
	</div>

	<!-- Premium Badge -->
	<div class="premium-badge">
		<span class="badge-icon">👑</span>
		<span class="badge-text">Ranchi's Newest & Most Premium Beauty Destination</span>
	</div>

	<div class="cards-grid">
		<!-- Story Card -->
		<div class="info-card">
			<div class="card-icon">🏆</div>
			<h3>Our Story</h3>
			<p>
				<span class="highlight-gold">Blancbeu Family Beauty Salon</span> —
				<span class="highlight-shimmer">Ranchi's newest premium destination</span> for beauty &
				wellness. We've set a <span class="highlight-white">new standard of excellence</span> with world-class
				care, luxury products, and unmatched service.
			</p>
		</div>

		<!-- Promise Card -->
		<div class="info-card">
			<div class="card-icon">💎</div>
			<h3>Our Promise</h3>
			<p>
				You deserve to feel <span class="highlight-shimmer">special & extraordinary</span>. We
				transform how you feel with <span class="highlight-white">luxurious treatments</span>
				in a relaxing sanctuary. <span class="highlight-gold">You're family here</span> — your glow is
				our pride.
			</p>
		</div>
	</div>

	<div class="highlights-pills">
		<div class="pill premium">
			<span>🥇</span> Top Rated in Ranchi
		</div>
		<div class="pill">
			<span>👩‍🎨</span> Expert Stylists
		</div>
		<div class="pill">
			<span>💫</span> Luxury Products
		</div>
		<div class="pill">
			<span>🎯</span> VIP Experience
		</div>
	</div>

	<div class="address-card">
		<div class="address-icon">📍</div>
		<address>
			<strong>Blancbeu Family Beauty Salon</strong><br />
			4th Floor, Victory Mall, Rangrej Gali, Saraswati Market,<br />
			Upper Bazar, Ranchi, Jharkhand 834001, India
		</address>
	</div>
</section>

<style>
	.section-padding {
		padding-top: 60px;
		padding-bottom: 60px;
	}
	.section-header {
		text-align: center;
		margin-bottom: 30px;
	}
	.section-title {
		font-size: 2rem;
		margin-bottom: 8px;
		color: var(--color-text-primary);
		display: inline-flex;
		justify-content: center;
		gap: 10px;
	}
	.section-subtitle {
		color: var(--color-text-secondary);
	}

	.premium-badge {
		background: linear-gradient(90deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.2));
		border: 1px solid var(--color-accent-gold);
		border-radius: var(--radius-full);
		padding: 10px 20px;
		text-align: center;
		margin: 0 auto 40px;
		max-width: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-weight: 600;
		color: var(--color-accent-gold);
		font-size: 0.9rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
		margin-bottom: 40px;
	}

	.info-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-lg);
		padding: 30px;
		text-align: center;
		backdrop-filter: blur(10px);
	}

	.card-icon {
		font-size: 3rem;
		margin-bottom: 20px;
	}

	.info-card h3 {
		font-size: 1.5rem;
		margin-bottom: 15px;
		color: var(--color-text-primary);
	}

	.info-card p {
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.highlight-gold {
		color: var(--color-accent-gold);
		font-weight: 600;
	}
	.highlight-white {
		color: white;
		font-weight: 600;
	}
	.highlight-shimmer {
		background: linear-gradient(90deg, #fff, #999, #fff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		font-weight: 700;
		background-size: 200% auto;
		animation: shimmer 3s linear infinite;
	}

	@keyframes shimmer {
		to {
			background-position: 200% center;
		}
	}

	.highlights-pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
		margin-bottom: 40px;
	}

	.pill {
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-full);
		padding: 8px 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-text-primary);
		font-size: 0.9rem;
	}

	.pill.premium {
		background: rgba(212, 175, 55, 0.1);
		border: 1px solid rgba(212, 175, 55, 0.3);
		color: var(--color-accent-gold);
	}

	.address-card {
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--radius-md);
		padding: 20px;
		display: flex;
		align-items: center;
		gap: 15px;
		max-width: 500px;
		margin: 0 auto;
	}

	.address-icon {
		font-size: 2rem;
	}

	address {
		font-style: normal;
		color: var(--color-text-secondary);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	address strong {
		color: var(--color-text-primary);
		display: block;
		margin-bottom: 4px;
	}
</style>
