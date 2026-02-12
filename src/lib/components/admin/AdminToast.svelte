<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { Check, X, LogOut } from 'lucide-svelte';
</script>

{#if $toasts.length > 0}
	<div class="admin-toast-container">
		{#each $toasts as toast (toast.id)}
			<div class="admin-toast">
				{#if toast.type === 'success'}
					<Check size={16} color="#34C759" />
				{:else if toast.type === 'error'}
					<X size={16} color="#FF3B30" />
				{:else if toast.type === 'logout'}
					<LogOut size={16} color="#FF9F0A" />
				{/if}
				<span>{toast.message}</span>
			</div>
		{/each}
	</div>
{/if}
