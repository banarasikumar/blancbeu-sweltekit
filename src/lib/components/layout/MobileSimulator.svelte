<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let isDesktop = $state(false);
	let mounted = $state(false);
	let cursorPosition = $state({ x: 0, y: 0 });
	let isTouching = $state(false);
	let isCursorVisible = $state(false);
	let isFullscreen = $state(false);
	let isHeightTooSmall = $state(false);
	let scrollContainer: HTMLDivElement;
	let activeScrollElement: HTMLElement | null = null;
	let startY = 0;
	let startX = 0;
	let startScrollTop = 0;
	let startScrollLeft = 0;
	let isHorizontalDrag = false;
	let dragLocked = false;
	let hasMoved = false;

	// Momentum Scrolling State
	let velocity = 0;
	let lastY = 0;
	let lastTimestamp = 0;
	let animationId: number | null = null;

	// Scale logic for 1220x2640 (iPhone 16 Pro Max) resolution using DPR 3
	// Logical viewport: 406x880
	const targetWidth = 406;
	const targetHeight = 880;
	let scaleFactor = $state(1);

	function updateScale() {
		if (typeof window === 'undefined') return;
		const availableHeight = window.innerHeight * 0.92; // Use more height
		scaleFactor = availableHeight / targetHeight;
		isDesktop = window.innerWidth >= 768;
		isHeightTooSmall = window.innerHeight < 500;
	}

	onMount(() => {
		updateScale();
		window.addEventListener('resize', updateScale);

		const mediaQuery = window.matchMedia('(min-width: 768px)');
		isDesktop = mediaQuery.matches; // Sync check
		mounted = true; // Mark as ready

		const handler = (e: MediaQueryListEvent) => {
			isDesktop = e.matches;
		};

		mediaQuery.addEventListener('change', handler);

		// Global mouseup listener to catch releases outside the frame
		const globalMouseUp = () => {
			if (isTouching) {
				isTouching = false;
				if (scrollContainer) {
					scrollContainer.style.pointerEvents = 'none';
				}
			}
		};
		window.addEventListener('mouseup', globalMouseUp);

		return () => {
			mediaQuery.removeEventListener('change', handler);
			window.removeEventListener('resize', updateScale);
			window.removeEventListener('mouseup', globalMouseUp);
			if (animationId) cancelAnimationFrame(animationId);
		};
	});

	function momentumScroll() {
		// Only apply momentum to vertical container for now
		if (!scrollContainer || isHorizontalDrag || Math.abs(velocity) < 0.2) {
			velocity = 0;
			if (animationId) cancelAnimationFrame(animationId);
			animationId = null;
			return;
		}

		scrollContainer.scrollTop -= velocity;
		// Increased friction (0.96) to make it less "strong"
		velocity *= 0.96;

		animationId = requestAnimationFrame(momentumScroll);
	}

	// Wheel scroll state for smooth interpolation
	let wheelTargetScrollTop = 0;
	let isWheelScrolling = false;
	let wheelAnimationId: number | null = null;

	function smoothWheelScroll() {
		if (!scrollContainer) {
			isWheelScrolling = false;
			wheelAnimationId = null;
			return;
		}

		const diff = wheelTargetScrollTop - scrollContainer.scrollTop;
		if (Math.abs(diff) < 1) {
			scrollContainer.scrollTop = wheelTargetScrollTop;
			isWheelScrolling = false;
			wheelAnimationId = null;
			return;
		}

		// Lerp towards target (smooth easing)
		scrollContainer.scrollTop += diff * 0.15;
		wheelAnimationId = requestAnimationFrame(smoothWheelScroll);
	}

	function handleWheel(e: WheelEvent) {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		velocity = 0;

		if (scrollContainer) {
			// Initialize target if not scrolling
			if (!isWheelScrolling) {
				wheelTargetScrollTop = scrollContainer.scrollTop;
			}

			// Update target
			wheelTargetScrollTop += e.deltaY * 0.5; // Reduce sensitivity

			// Clamp to valid range
			const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
			wheelTargetScrollTop = Math.max(0, Math.min(wheelTargetScrollTop, maxScroll));

			// Start smooth scroll animation if not already running
			if (!isWheelScrolling) {
				isWheelScrolling = true;
				requestAnimationFrame(smoothWheelScroll);
			}

			e.preventDefault();
		}
	}

	function findScrollableParent(el: HTMLElement | null, horizontal: boolean): HTMLElement | null {
		while (el && el !== scrollContainer.parentElement) {
			const style = window.getComputedStyle(el);
			if (horizontal) {
				if (
					el.scrollWidth > el.clientWidth &&
					(style.overflowX === 'auto' || style.overflowX === 'scroll')
				) {
					return el;
				}
			} else {
				if (
					el.scrollHeight > el.clientHeight &&
					(style.overflowY === 'auto' || style.overflowY === 'scroll')
				) {
					return el;
				}
			}
			el = el.parentElement;
		}

		// For horizontal, ONLY return if explicitly scrollable. Do not fallback to main container.
		if (horizontal) {
			if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
				const style = window.getComputedStyle(scrollContainer);
				if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
					return scrollContainer;
				}
			}
			return null;
		}

		return scrollContainer;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDesktop) return;
		isCursorVisible = true;
		cursorPosition = { x: e.clientX, y: e.clientY };

		if (isTouching && activeScrollElement) {
			const currentY = e.clientY;
			const currentX = e.clientX;
			const currentTimestamp = performance.now();

			const deltaY = (currentY - startY) / scaleFactor;
			const deltaX = (currentX - startX) / scaleFactor;

			// Increased threshold to 12 to prevent accidental micro-movements from blocking clicks
			if (!dragLocked && (Math.abs(deltaY) > 12 || Math.abs(deltaX) > 12)) {
				hasMoved = true;
				// Lock drag direction like mobile
				dragLocked = true;
				isHorizontalDrag = Math.abs(deltaX) > Math.abs(deltaY);

				// If we was dragging horizontally, re-find the horizontal parent
				if (isHorizontalDrag) {
					activeScrollElement = findScrollableParent(activeScrollElement, true);
				}
			}

			if (dragLocked && activeScrollElement) {
				if (isHorizontalDrag) {
					activeScrollElement.scrollLeft = startScrollLeft - deltaX;
				} else {
					activeScrollElement.scrollTop = startScrollTop - deltaY;
				}
			}

			// Track velocity for vertical momentum
			if (!isHorizontalDrag && lastTimestamp) {
				const timeDelta = currentTimestamp - lastTimestamp;
				if (timeDelta > 0) {
					const v = (currentY - lastY) / timeDelta / scaleFactor;
					const pixelsPerFrame = v * 16.6;
					velocity = velocity * 0.1 + pixelsPerFrame * 0.9;
				}
			}

			lastY = currentY;
			lastTimestamp = currentTimestamp;
		}
	}

	function handleMouseDown(e: MouseEvent) {
		// Cancel ANY ongoing scroll animations
		if (animationId) cancelAnimationFrame(animationId);
		if (wheelAnimationId) {
			cancelAnimationFrame(wheelAnimationId);
			wheelAnimationId = null;
			isWheelScrolling = false;
		}
		velocity = 0;

		// STRICT CHECK: Only allow interaction if starting INSIDE the simulator frame
		const targetNode = e.target as HTMLElement;
		if (!targetNode.closest('.simulator-frame')) {
			return;
		}

		isTouching = true;
		hasMoved = false;
		dragLocked = false;
		isHorizontalDrag = false;
		startY = e.clientY;
		startX = e.clientX;
		lastY = e.clientY;
		lastTimestamp = performance.now();

		// Enable pointer events temporarily to interact with content
		if (scrollContainer) {
			scrollContainer.style.pointerEvents = 'auto'; // Enable interaction

			// Find what we ARE clicking on
			const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
			activeScrollElement = target;

			if (target && scrollContainer.contains(target)) {
				// Manually forward the 'mousedown' since the original was consumed by the wrapper
				const event = new MouseEvent('mousedown', {
					bubbles: true,
					cancelable: true,
					view: window,
					screenX: e.screenX,
					screenY: e.screenY,
					clientX: e.clientX,
					clientY: e.clientY,
					button: e.button,
					buttons: e.buttons
				});
				target.dispatchEvent(event);
			}

			// Initial scroll setup logic
			let scrollParent = findScrollableParent(target, false);
			if (scrollParent) {
				startScrollTop = scrollParent.scrollTop;
				startScrollLeft = scrollParent.scrollLeft;
				activeScrollElement = scrollParent; // Track the SCROLLABLE parent for drag logic
			}
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (!isTouching) return; // Only run if we actually started a valid touch

		const currentTimestamp = performance.now();
		// Tighter time window (50ms) to ensure it only fires on active flick
		if (currentTimestamp - lastTimestamp < 50 && Math.abs(velocity) > 1) {
			velocity *= 1.25;
			momentumScroll();
		}

		// ALWAYS enable pointer events first so elementFromPoint works correctly
		if (scrollContainer) {
			scrollContainer.style.pointerEvents = 'auto';
		}

		// Handle Click Simulation - only if we didn't move significantly
		if (!hasMoved && scrollContainer) {
			const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;

			if (target && scrollContainer.contains(target)) {
				// Find the closest clickable element (a, button, etc.)
				const clickable =
					(target.closest('a, button, [role="button"], [onclick]') as HTMLElement) || target;

				// Immediate dispatch
				clickable.click();
			}
		}

		// Reset state immediately
		isTouching = false;

		// Re-disable interaction to kill hover effects (use requestAnimationFrame for next frame)
		requestAnimationFrame(() => {
			if (scrollContainer && !isTouching) {
				scrollContainer.style.pointerEvents = 'none';
			}
		});
	}

	// Prevent default drag behaviors and right click
	function handleDragStart(e: DragEvent) {
		e.preventDefault();
	}

	function handleContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	function handleMouseLeave() {
		isCursorVisible = false;
		handleMouseUp({ clientX: 0, clientY: 0 } as MouseEvent);
	}

	$effect(() => {
		if (typeof document !== 'undefined') {
			if (isDesktop) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	});

	// Track fullscreen state changes
	$effect(() => {
		if (typeof document !== 'undefined') {
			const handleFullscreenChange = () => {
				isFullscreen = !!document.fullscreenElement;
			};
			document.addEventListener('fullscreenchange', handleFullscreenChange);
			return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
		}
	});

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	}
</script>

{#if mounted}
	{#if isDesktop}
		{#if isHeightTooSmall}
			<!-- Height Too Small Message -->
			<div class="height-warning">
				<h2>Please Increase Window Height</h2>
			</div>
		{:else}
			<div
				class="simulator-wrapper"
				onmousemove={handleMouseMove}
				onmousedown={handleMouseDown}
				onmouseup={handleMouseUp}
				onmouseleave={handleMouseLeave}
				ondragstart={handleDragStart}
				role="presentation"
			>
				<!-- Custom Touch Cursor (Finger) -->
				<div
					class="touch_cursor"
					style="left: {cursorPosition.x}px; top: {cursorPosition.y}px; transform: translate(-50%, -50%); opacity: {isCursorVisible
						? 1
						: 0};"
					class:active={isTouching}
				></div>

				<div
					class="simulator-frame"
					style="width: {targetWidth}px; height: {targetHeight}px; transform: scale({scaleFactor});"
					oncontextmenu={handleContextMenu}
					onwheel={handleWheel}
					role="presentation"
				>
					<!-- Usable App Area (Full Height) -->
					<div class="safe-area-container">
						<div
							class="screen-content"
							bind:this={scrollContainer}
							class:dragging={isTouching}
							class:no-hover={true}
							id="mobile-viewport"
						>
							{@render children()}
						</div>
					</div>
				</div>

				<!-- Fullscreen Toggle Button -->
				<button
					class="fullscreen-btn"
					onclick={toggleFullscreen}
					title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
				>
					{#if isFullscreen}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="4 14 10 14 10 20"></polyline>
							<polyline points="20 10 14 10 14 4"></polyline>
							<line x1="14" y1="10" x2="21" y2="3"></line>
							<line x1="3" y1="21" x2="10" y2="14"></line>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<polyline points="15 3 21 3 21 9"></polyline>
							<polyline points="9 21 3 21 3 15"></polyline>
							<line x1="21" y1="3" x2="14" y2="10"></line>
							<line x1="3" y1="21" x2="10" y2="14"></line>
						</svg>
					{/if}
				</button>
			</div>
		{/if}
	{:else}
		{@render children()}
	{/if}
{:else}
	<!-- Blank or simple splash bg during mount to prevent desktop layout showing -->
	<div class="mount-placeholder"></div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		/* overflow: hidden;  <-- Removed to prevent scroll lock on mobile */
	}

	.height-warning {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #0a0a0a;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.warning-content {
		text-align: center;
		color: rgba(255, 255, 255, 0.8);
		padding: 40px;
	}

	.warning-content svg {
		color: #d4af37;
		margin-bottom: 20px;
	}

	.warning-content h2 {
		font-size: 1.5rem;
		margin-bottom: 12px;
		color: #d4af37;
	}

	.warning-content p {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.6);
		max-width: 300px;
		margin: 0 auto;
	}

	.simulator-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000; /* Dark background outside */
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: none !important; /* Force hide default cursor */
		overflow: hidden;
		z-index: 9999;
		user-select: none;
	}

	/* Dark Yellow BG option */
	.simulator-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at center,
			rgba(212, 175, 55, 0.05) 0%,
			rgba(0, 0, 0, 1) 100%
		);
		pointer-events: none;
	}

	.simulator-frame {
		position: absolute; /* Changed to absolute for centering within flex wrapper */
		transform-origin: center center;
		background: #000;
		border-radius: 40px;
		box-shadow:
			0 0 0 4px #1a1a1a,
			0 0 0 8px #0a0a0a,
			0 20px 50px rgba(0, 0, 0, 0.8),
			0 0 100px rgba(212, 175, 55, 0.1);
		overflow: hidden;
		border: 8px solid #000;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		cursor: none; /* Hide default cursor globally within the frame */
	}

	.safe-area-container {
		flex: 1;
		width: 100%;
		position: relative;
		overflow: hidden;
		/* Create a new stacking context for fixed elements to stick to THIS container */
		transform: translateZ(0);
	}

	.screen-content {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden; /* Hide potential scrollbars */
		background: var(--color-bg-primary, #050505); /* Theme-aware dark background */
		border-radius: 32px;
		/* Crucial: Disable pointer events by default to prevent hover effects */
		pointer-events: none;
		/* We manually toggle this to 'auto' during mousedown/touch in JS */
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* Enable Container Queries */
		container-type: inline-size;
		container-name: simulator-viewport;
	}

	.screen-content.dragging {
		cursor: none; /* Ensure it stays hidden while dragging */
	}

	/* Disable hover effects inside the frame */
	.screen-content.no-hover :global(*) {
		-webkit-tap-highlight-color: transparent; /* Remove mobile tap highlight */
		cursor: none !important; /* Ensure cursor is hidden */
	}

	.screen-content::-webkit-scrollbar {
		display: none;
	}

	.touch_cursor {
		position: fixed;
		width: 18px; /* Balanced size */
		height: 18px;
		background: rgba(255, 255, 255, 0.25); /* Subtle center */
		border: 1.5px solid rgba(255, 255, 255, 0.6); /* Balanced border */
		border-radius: 50%;
		pointer-events: none;
		z-index: 10000;
		backdrop-filter: blur(2px);
		box-shadow: 0 0 6px rgba(0, 0, 0, 0.2); /* Subtle shadow */
		transition:
			transform 0.1s,
			opacity 0.2s;
	}

	.touch_cursor.active {
		background: rgba(255, 255, 255, 0.4);
		transform: translate(-50%, -50%) scale(0.9) !important;
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
		border-color: rgba(255, 255, 255, 0.9);
	}

	.fullscreen-btn {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 44px;
		height: 44px;
		background: rgba(30, 30, 30, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10001;
		transition: all 0.2s ease;
		backdrop-filter: blur(8px);
	}

	.fullscreen-btn:hover {
		background: rgba(50, 50, 50, 0.95);
		color: rgba(255, 255, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	.fullscreen-btn:active {
		transform: scale(0.95);
	}

	.mount-placeholder {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000;
		z-index: 10000;
	}

	@media (max-width: 767px) {
		.simulator-wrapper {
			cursor: auto !important;
		}
	}
</style>
