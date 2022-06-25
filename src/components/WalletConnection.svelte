<script lang="ts">
	import { onMount } from 'svelte';
	import FileDrop from './FileDrop.svelte';
	import Arweave from 'arweave';
	import { fade } from 'svelte/transition';
	import { updateWalletBalance, walletConnected } from '../stores/walletStore';

	let key: string;
	let errorText: string;

	let showErrorModal = false;

	onMount(() => {
		key = sessionStorage.getItem('wallet_address');
		if (key) {
			walletConnected.update(() => true);
		}
	});

	let fileReader: FileReader;
	//TODO: Change this to live version
	const arweave = Arweave.init({
		host: 'localhost',
		port: 1984,
		protocol: 'http'
	});

	const handleFileChosen = (e: CustomEvent) => {
		fileReader = new FileReader();
		fileReader.onloadend = LoadWallet;
		fileReader.readAsText(e.detail.files);
	};

	const disconnectWallet = () => {
		sessionStorage.clear();
		key = null;
		walletConnected.update(() => false);
	};

	const LoadWallet = async () => {
		const content = fileReader.result as string;
		try {
			const wallet_file = JSON.parse(content);
			await arweave.wallets.jwkToAddress(wallet_file).then((address) => {
				sessionStorage.setItem('wallet_address', address);
				key = sessionStorage.getItem('wallet_address');
			});
			sessionStorage.setItem('arweaveWallet', content);
			updateWalletBalance();
			walletConnected.update(() => true);
		} catch (err) {
			errorText = 'Incorrect wallet file';
			showErrorModal = true;
		}
	};
</script>

<div>
	{#if $walletConnected}
		<div
			class="disconnect-wallet-container"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 200 }}
		>
			<div class="wallet-adress-box">
				<input type="text" class="wallet-adress-box-input" disabled value={key} />
				<button class="wallet-address-button" type="submit" on:click={disconnectWallet}
					>Disconnect</button
				>
			</div>
		</div>
	{:else}
		<div class="file-drop-container" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
			<FileDrop
				class="normal"
				multiple={false}
				accept="application/json"
				on:input={handleFileChosen}
				text="Drag &amp; drop your Arweave key or click to browse."
			/>
		</div>
		<div>
			<small
				>Don't got a wallet? Get one here <a href="https://www.arweave.org/" target="_blank"
					>Arweave.org</a
				></small
			>
		</div>
	{/if}
	{#if showErrorModal}
		<!-- <WalletErrorModal bind:errorText /> -->
	{/if}
</div>

<style>
	.wallet-adress-box {
		position: relative;
		width: 300px;
	}
	.wallet-adress-box-input {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 100px;
		padding: 10px 100px 10px 20px;
		line-height: 1;
		box-sizing: border-box;
		outline: none;
		background: transparent;
	}
	.wallet-address-button {
		position: absolute;
		right: 3px;
		top: 3px;
		bottom: 3px;
		border: 0;
		background: #e8646c;
		color: #fff;
		outline: none;
		margin: 0;
		padding: 0 10px;
		border-radius: 100px;
		z-index: 2;
	}
</style>
