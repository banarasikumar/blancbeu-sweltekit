import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Store scroll positions per route
const scrollPositions = writable<Record<string, number>>({});

// Track visited routes in this session
const visitedRoutes = writable<Set<string>>(new Set());

/**
 * Helper to get the current scroll container
 */
function getScrollContainer(): HTMLElement | Window | null {
    if (!browser) return null;
    const mobileViewport = document.getElementById('mobile-viewport');
    return mobileViewport || window;
}

/**
 * Helper to get scroll Y position
 */
function getScrollY(container: HTMLElement | Window | null): number {
    if (!container) return 0;
    if (container instanceof Window) {
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    return (container as HTMLElement).scrollTop;
}

/**
 * Helper to scroll to position
 */
function scrollTo(container: HTMLElement | Window | null, top: number, behavior: ScrollBehavior = 'instant'): void {
    if (!container) return;
    container.scrollTo({ top, behavior });
}

/**
 * Save current scroll position for a route
 */
export function saveScrollPosition(route: string): void {
    const container = getScrollContainer();
    const scrollY = getScrollY(container);

    scrollPositions.update((positions) => ({
        ...positions,
        [route]: scrollY
    }));
}

/**
 * Restore scroll position for a route
 * Returns true if position was restored, false if this is first visit
 */
export function restoreScrollPosition(route: string): boolean {
    if (!browser) return false;

    const visited = get(visitedRoutes);
    const positions = get(scrollPositions);
    const container = getScrollContainer();

    // Mark as visited
    visitedRoutes.update((v) => {
        v.add(route);
        return v;
    });

    // Helper to force scroll
    const performScroll = (y: number) => {
        // 1. Try variable container
        if (container instanceof Window) {
            window.scrollTo(0, y);
            document.documentElement.scrollTop = y;
            document.body.scrollTop = y;
        } else if (container) {
            (container as HTMLElement).scrollTop = y;
        }

        // 2. Agressive Fallback: Scroll EVERYTHING if targeting 0 (reset)
        if (y === 0) {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            const appRoot = document.getElementById('app-root');
            if (appRoot) appRoot.scrollTop = 0;
        }
    };

    // If previously visited and has saved position, restore it
    if (visited.has(route) && positions[route] !== undefined) {
        const targetScroll = positions[route];
        console.log(`[Scroll] Restoring history for ${route}: ${targetScroll}`);

        // Immediate attempt
        performScroll(targetScroll);

        // Smart Restore: Check if we successfully scrolled. If not (likely due to short content), wait for resize.
        if (container instanceof HTMLElement) {
            const checkAndScroll = () => {
                const maxScroll = container.scrollHeight - container.clientHeight;
                if (maxScroll >= targetScroll) {
                    performScroll(targetScroll);
                    return true; // Done
                }
                return false; // Still too short
            };

            // initial check
            if (!checkAndScroll()) {
                console.log(`[Scroll] Content too short for ${targetScroll}, watching for resize...`);
                // Observe resize
                const observer = new ResizeObserver(() => {
                    if (checkAndScroll()) {
                        observer.disconnect();
                        console.log(`[Scroll] Resize detected, restored to ${targetScroll}`);
                    }
                });
                observer.observe(container.firstElementChild || container);

                // Cleanup after 2 seconds to save resources
                setTimeout(() => observer.disconnect(), 2000);
            }
        } else {
            // Fallback for Window (less common to have this issue if body grows, but good to handle)
            // Window doesn't have ResizeObserver on itself easily without checking body height
            setTimeout(() => performScroll(targetScroll), 100);
            setTimeout(() => performScroll(targetScroll), 300);
            setTimeout(() => performScroll(targetScroll), 600);
        }

        return true;
    }

    // Unvisited or no saved position: FORCE TOP
    console.log(`[Scroll] No history for ${route}, forcing top (0)`);
    performScroll(0);
    requestAnimationFrame(() => performScroll(0));
    // No need for resize observer when scrolling to 0, it always works.
    return false;
}

/**
 * Scroll to top smoothly (for clicking active tab)
 */
export function scrollToTop(): void {
    const container = getScrollContainer();
    scrollTo(container, 0, 'smooth');
}

/**
 * Check if a route has been visited this session
 */
export function hasVisitedRoute(route: string): boolean {
    return get(visitedRoutes).has(route);
}

/**
 * Clear all scroll positions (e.g., on logout)
 */
export function clearScrollPositions(): void {
    scrollPositions.set({});
    visitedRoutes.set(new Set());
}

export { scrollPositions, visitedRoutes };
