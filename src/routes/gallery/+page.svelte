<script lang="ts">
	import LazyImage from '$lib/components/ui/LazyImage.svelte';

	// Glob import all stock images
	const imagesGlob = import.meta.glob('$lib/assets/stock/*.{png,jpg,jpeg,webp}', {
		eager: true,
		query: { url: true }
	});

	// Convert to array of URLs
	const images = Object.values(imagesGlob).map((mod: any) => mod.default);
</script>

<div class="gallery-page container">
	<header class="page-header">
		<h1>Gallery</h1>
		<p>Moments of beauty</p>
	</header>

	<div class="masonry-grid">
		{#each images as src, i}
			<div class="grid-item">
				<LazyImage
					{src}
					alt="Gallery Image {i + 1}"
					width="100%"
					height="auto"
					className="gallery-img"
				/>
			</div>
		{/each}

		<!-- Fallback if no images found -->
		{#if images.length === 0}
			<p style="text-align: center; grid-column: 1 / -1; color: var(--color-text-secondary);">
				No images found in stock folder.
			</p>
		{/if}
	</div>
</div>

<style>
	.gallery-page {
		padding-top: 20px;
	}

	.page-header {
		text-align: center;
		margin-bottom: 24px;
	}

	.page-header h1 {
		font-size: 1.8rem;
		background: var(--gradient-gold);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.page-header p {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.masonry-grid {
		column-count: 2;
		column-gap: 12px;
	}

	.grid-item {
		break-inside: avoid;
		margin-bottom: 12px;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 1px solid rgba(var(--color-text-primary-rgb), 0.05);
	}

	/* Ensure LazyImage wrapper inherits height correctly in masonry */
	:global(.gallery-img) {
		display: block;
	}
</style>
