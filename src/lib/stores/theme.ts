import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'gold' | 'glitch' | 'clean';

const getInitialTheme = (): Theme => {
    if (browser) {
        const stored = localStorage.getItem('theme') as Theme;
        if (stored) return stored;
        return 'gold'; // Default
    }
    return 'gold';
};

export const theme = writable<Theme>(getInitialTheme());

// Theme color map: solid hex colors that match the perceived header color
// These must match the actual visual appearance of the header bar in each theme
export const THEME_COLORS: Record<Theme, string> = {
    gold: '#000000',    // Black header (rgba(0,0,0,0.85) over #000)
    clean: '#F9F9F9',   // Light gray header (rgba(249,249,249,0.85) over #F9F9F9)
    glitch: '#E6E6FA'   // Lavender header (rgba(230,230,250,0.85) over #E6E6FA)
};

// Admin uses different header styles
export const ADMIN_THEME_COLORS: Record<Theme, string> = {
    gold: '#1C1C1E',    // Admin dark surface header
    clean: '#FFFFFF',    // White glass header over light bg
    glitch: '#F0F0FC'   // White glass header over lavender bg
};

if (browser) {
    theme.subscribe((value) => {
        localStorage.setItem('theme', value);

        // Remove old themes
        document.documentElement.removeAttribute('data-theme');

        // Apply new theme (except default gold which is :root)
        if (value !== 'gold') {
            document.documentElement.setAttribute('data-theme', value);
        }

        // Programmatically update theme-color meta tag for ALL browsers
        // Some browsers (Chrome Android, Safari) need DOM manipulation to react
        const isAdmin = window.location.pathname.startsWith('/admin');
        const color = isAdmin ? ADMIN_THEME_COLORS[value] : THEME_COLORS[value];

        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        } else {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.setAttribute('name', 'theme-color');
            metaThemeColor.setAttribute('content', color);
            document.head.appendChild(metaThemeColor);
        }

        // Also update Apple status bar style
        let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (appleStatusBar) {
            appleStatusBar.setAttribute('content', value === 'gold' ? 'black-translucent' : 'default');
        }
    });
}

export const toggleTheme = () => {
    theme.update(current => {
        if (current === 'gold') return 'glitch';
        if (current === 'glitch') return 'clean';
        return 'gold';
    });
};
