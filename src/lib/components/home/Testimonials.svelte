<script lang="ts">
	const testimonials = [
		{
			stars: '⭐⭐⭐⭐⭐',
			text: 'Blancbeu gave me the best haircut ever! The professionalism and care are unmatched. Highly recommended!',
			author: 'Sarah Johnson',
			label: 'Premium Member'
		},
		{
			stars: '⭐⭐⭐⭐⭐',
			text: 'The bridal makeup service was absolutely stunning. I felt like a queen on my special day!',
			author: 'Priya Patel',
			label: 'Bridal Customer'
		},
		{
			stars: '⭐⭐⭐⭐⭐',
			text: 'Spa treatments are heavenly! I always leave feeling completely rejuvenated and refreshed.',
			author: 'Anjali Sharma',
			label: 'Regular Customer'
		},
		{
			stars: '⭐⭐⭐⭐⭐',
			text: "Best facial treatment I've ever had. The staff is so knowledgeable and friendly!",
			author: 'Meera Singh',
			label: 'Skincare Enthusiast'
		}
	];

	let scrollContainer: HTMLElement;

	const scroll = (direction: number) => {
		if (scrollContainer) {
			const scrollAmount = 300;
			scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
		}
	};
</script>

<section class="reviews-section container section-padding" id="reviews">
	<div class="section-header">
		<h2 class="section-title">
			<span class="title-decoration">⭐</span>
			Customer Testimonials
			<span class="title-decoration">⭐</span>
		</h2>
		<p class="section-subtitle">Hear from our satisfied clients</p>
	</div>

	<div class="carousel-wrapper">
		<button class="nav-btn prev" on:click={() => scroll(-1)}>❮</button>

		<div class="testimonial-carousel" bind:this={scrollContainer}>
			{#each testimonials as review}
				<div class="review-card">
					<div class="stars">{review.stars}</div>
					<p class="text">"{review.text}"</p>
					<div class="author-block">
						<strong>{review.author}</strong>
						<span class="label">{review.label}</span>
					</div>
				</div>
			{/each}
		</div>

		<button class="nav-btn next" on:click={() => scroll(1)}>❯</button>
	</div>
</section>

<style>
	.section-padding {
		padding-top: 60px;
		padding-bottom: 60px;
	}
	.section-header {
		text-align: center;
		margin-bottom: 40px;
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

	.carousel-wrapper {
		position: relative;
	}

	.testimonial-carousel {
		display: flex;
		gap: 20px;
		overflow-x: auto;
		padding: 10px 0 20px 0;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}
	.testimonial-carousel::-webkit-scrollbar {
		display: none;
	}

	.review-card {
		flex: 0 0 300px;
		background: var(--color-bg-secondary);
		border-radius: var(--radius-lg);
		padding: 30px;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.05);
		scroll-snap-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		backdrop-filter: blur(10px);
	}

	.stars {
		margin-bottom: 15px;
		font-size: 1.2rem;
	}

	.text {
		color: var(--color-text-primary);
		line-height: 1.6;
		font-style: italic;
		margin-bottom: 20px;
		flex-grow: 1;
	}

	.author-block {
		display: flex;
		flex-direction: column;
		padding-top: 15px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.author-block strong {
		color: var(--color-accent-gold);
		font-size: 1rem;
		margin-bottom: 4px;
	}
	.label {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		border: none;
		cursor: pointer;
		z-index: 2;
	}
	.prev {
		left: -15px;
	}
	.next {
		right: -15px;
	}

	@media (max-width: 768px) {
		.nav-btn {
			display: none;
		}
		.review-card {
			flex: 0 0 85%;
		}
	}
</style>
