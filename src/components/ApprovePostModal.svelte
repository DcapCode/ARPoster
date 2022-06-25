<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let contentByteSize = 0;
	export let postCost = 0;
	export let walletBalance = 0;
	export const trigger = false;

	const validateBalance = () => {
		dispatch('postOk');
	};
</script>

<div class="content">
	<Modal on:closed={() => dispatch('closed')}>
		<div slot="trigger" let:open class="hidden">
			{trigger ?? open()}
		</div>
		<div slot="header">
			<h1>Sign Arweave post</h1>
		</div>
		<div slot="content">
			<div>
				<div class="info-spacer">
					<p>Post size : {contentByteSize} bytes</p>
				</div>

				<div class="info-spacer">
					<p>Price</p>
					<div>
						<p>Winston: {postCost}</p>
					</div>
					<div>
						<p>AR: {postCost / 1000000000000}</p>
					</div>
				</div>
				<p>Current wallet balance</p>
				<div>
					Winston: {walletBalance.toLocaleString('fullwide', { useGrouping: false })}
				</div>
				<div>
					AR: {walletBalance / 1000000000000}
				</div>
			</div>
		</div>
		<div slot="footer" let:store={{ close }}>
			<Button class="lg default" type="button" on:click={validateBalance}>Sign post</Button>
			<Button
				class="lg default"
				type="button"
				on:click={() => {
					close();
					dispatch('closed');
				}}>Cancel</Button
			>
		</div>
	</Modal>
</div>

<style>
	.info-spacer {
		border-bottom: 1px solid white;
	}
	.hidden {
		display: none;
	}
	.content {
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>
