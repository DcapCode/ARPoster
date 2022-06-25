<script>
	import { onMount } from 'svelte';

	import { updateWalletBalance, walletBalance, walletConnected } from '../stores/walletStore';

	onMount(() => {
		if (sessionStorage.getItem('wallet_address')) {
			updateWalletBalance();
		}
	});
</script>

<p>Current wallet balance</p>
<div>
	{#if $walletConnected}
		<div>
			<p>AR: {$walletBalance}</p>
		</div>
	{:else}
		<div>
			<p>No wallet connected</p>
		</div>
	{/if}
</div>

<style>
</style>
