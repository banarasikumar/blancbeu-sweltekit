<script lang="ts">
	import { adminUser } from '$lib/stores/adminAuth';
	import {
		allBookings,
		allUsers,
		bookingCount,
		pendingCount,
		userCount
	} from '$lib/stores/adminData';
	import { goto } from '$app/navigation';
	import { showToast } from '$lib/stores/toast';
	import {
		CalendarCheck,
		Users,
		Clock,
		Star,
		Plus,
		UserPlus,
		Megaphone,
		BarChart3
	} from 'lucide-svelte';

	let userName = $derived(($adminUser?.displayName || 'Admin').split(' ')[0]);

	const stats = $derived([
		{
			label: 'Total Bookings',
			value: $bookingCount,
			icon: CalendarCheck,
			bg: 'var(--admin-accent-light)', // Gold tint
			color: 'var(--admin-accent)', // Gold
			action: () => goto('/admin/bookings')
		},
		{
			label: 'Active Users',
			value: $userCount,
			icon: Users,
			bg: 'var(--admin-green-light)',
			color: 'var(--admin-green)',
			action: () => goto('/admin/users')
		},
		{
			label: 'Pending Appts',
			value: $pendingCount,
			icon: Clock,
			bg: 'var(--admin-orange-light)',
			color: 'var(--admin-orange)',
			action: () => goto('/admin/bookings')
		},
		{
			label: 'Avg Rating',
			value: '4.9',
			icon: Star,
			bg: 'var(--admin-purple-light)',
			color: 'var(--admin-purple)',
			action: () => {}
		}
	]);

	const actions = [
		{
			label: 'Service',
			icon: Plus,
			bg: 'var(--admin-accent)', // Gold
			handler: () => showToast('Add Service — coming soon!', 'success')
		},
		{
			label: 'Staff',
			icon: UserPlus,
			bg: 'var(--admin-green)',
			handler: () => showToast('Add Staff — coming soon!', 'success')
		},
		{
			label: 'Notify',
			icon: Megaphone,
			bg: 'var(--admin-indigo)',
			handler: () => showToast('Notifications — coming soon!', 'success')
		},
		{
			label: 'Reports',
			icon: BarChart3,
			bg: 'var(--admin-pink)',
			handler: () => showToast('Reports — coming soon!', 'success')
		}
	];
</script>

<!-- Hero Section -->
<div class="admin-hero">
	<span class="admin-hero-badge">BLANCBEU SALON</span>
	<h1>Hello, {userName}</h1>
	<p>Overview for today.</p>
</div>

<!-- Stats Grid -->
<div style="margin-bottom: 32px;">
	<h3 class="admin-section-title">Overview</h3>
	<div class="admin-stats-grid">
		{#each stats as stat}
			<button class="admin-stat-card" onclick={stat.action}>
				<div class="admin-stat-icon" style="background: {stat.bg}; color: {stat.color};">
					<stat.icon size={20} />
				</div>
				<div class="admin-stat-value">{stat.value}</div>
				<div class="admin-stat-label">{stat.label}</div>
			</button>
		{/each}
	</div>
</div>

<!-- Quick Actions -->
<div>
	<h3 class="admin-section-title">Quick Actions</h3>
	<div class="admin-actions-grid">
		{#each actions as action}
			<button class="admin-action-btn" onclick={action.handler}>
				<div class="admin-action-icon" style="background: {action.bg};">
					<action.icon size={20} color="#000" />
				</div>
				<span>{action.label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	/* Stat card button reset */
	.admin-stat-card {
		text-align: left;
		cursor: pointer;
		border: none;
		font-family: inherit;
	}
</style>
