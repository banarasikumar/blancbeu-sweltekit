<script lang="ts">
	import { onMount } from 'svelte';
	import imgFacial from '$lib/assets/stock/gallery_facial.webp';
	import imgMakeup from '$lib/assets/stock/gallery_makeup.webp';
	import imgHair from '$lib/assets/stock/gallery_hair.webp';
	import imgSpa from '$lib/assets/stock/gallery_spa.webp';

	// Additional gallery items (reusing images for demo as per legacy)
	const galleryItems = [
		{ src: imgFacial, title: 'Facial Treatments' },
		{ src: imgMakeup, title: 'Makeup Styling' },
		{ src: imgHair, title: 'Hair Coloring' },
		{ src: imgSpa, title: 'Spa & Nourish' },
		{ src: imgFacial, title: 'Advanced Facials' },
		{ src: imgMakeup, title: 'Bridal Makeup' },
		{ src: imgHair, title: 'Style & Cuts' },
		{ src: imgSpa, title: 'Relaxing Spa' }
	];

	let scrollContainer: HTMLElement;

	const scroll = (direction: number) => {
		if (scrollContainer) {
			const scrollAmount = 300;
			scrollContainer.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
		}
	};
</script>

<section class="gallery-section container section-padding" id="gallery">
	<div class="section-header">
		<h2 class="section-title">
			<span class="title-decoration">🌟</span>
			Gallery
			<span class="title-decoration">🌟</span>
		</h2>
		<p class="section-subtitle">Witness the transformation</p>
	</div>

	<div class="gallery-wrapper">
		<button class="gallery-scroll-btn left" on:click={() => scroll(-1)} aria-label="Scroll Left"
			>❮</button
		>

		<div class="gallery-grid" bind:this={scrollContainer}>
			{#each galleryItems as item}
				<div class="gallery-item">
					<img src={item.src} alt={item.title} loading="lazy" />
					<div class="gallery-overlay">
						<h3>{item.title}</h3>
					</div>
				</div>
			{/each}
		</div>

		<button class="gallery-scroll-btn right" on:click={() => scroll(1)} aria-label="Scroll Right"
			>❯</button
		>
	</div>

	<div class="view-btn-container">
		<a href="/gallery" class="view-gallery-btn">
			<span>View Gallery</span>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</a>
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
		align-items: center;
		gap: 10px;
	}

	.title-decoration {
		font-size: 1.5rem;
	}

	.section-subtitle {
		color: var(--color-text-secondary);
	}

	.gallery-wrapper {
		position: relative;
		margin-bottom: 40px;
	}

	.gallery-grid {
		display: flex;
		overflow-x: auto;
		gap: 16px;
		padding-bottom: 20px;
		scroll-snap-type: x mandatory;
		scrollbar-width: none; /* Firefox */
	}

	.gallery-grid::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}

	.gallery-item {
		flex: 0 0 280px;
		height: 350px;
		border-radius: var(--radius-md);
		overflow: hidden;
		position: relative;
		scroll-snap-align: center;
		cursor: pointer;
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.gallery-item:hover img {
		transform: scale(1.1);
	}

	.gallery-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 20px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
		color: white;
		transform: translateY(100%);
		transition: transform 0.3s ease;
	}

	.gallery-item:hover .gallery-overlay {
		transform: translateY(0);
	}

	.gallery-overlay h3 {
		font-size: 1.1rem;
		font-weight: 600;
	}

	.gallery-scroll-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 2;
		backdrop-filter: blur(4px);
		transition: all 0.2s;
	}

	.gallery-scroll-btn:hover {
		background: var(--color-accent-gold);
		color: black;
	}

	.gallery-scroll-btn.left {
		left: -20px;
	}

	.gallery-scroll-btn.right {
		right: -20px;
	}

	.view-btn-container {
		text-align: center;
	}

	.view-gallery-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 24px;
		background: transparent;
		border: 1px solid var(--color-accent-gold);
		color: var(--color-accent-gold);
		border-radius: var(--radius-full);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s;
	}

	.view-gallery-btn:hover {
		background: var(--color-accent-gold);
		color: black;
	}

	@media (max-width: 768px) {
		.gallery-scroll-btn {
			display: none;
		}

		.gallery-item {
			flex: 0 0 85%; /* Bigger on mobile */
		}
	}
</style>
