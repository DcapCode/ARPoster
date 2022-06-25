<script lang="ts">
	import InputError from '$lib/InputError.svelte';
	import TagInput from '$lib/TagInput.svelte';
	import Button from '$lib/Button.svelte';
	import FileDrop from '$lib/FileDrop.svelte';
	import { tags } from '../stores/imageTagStore';
	import { createArweavePost, getPostCost } from '$lib/utils/ArweaveUtils';
	import { updateWalletBalance, walletBalance } from '../stores/walletStore';
	import ResultModal from '$lib/ResultModal.svelte';
	import WalletBalance from '$lib/WalletBalance.svelte';
	import PostCost from '$lib/PostCost.svelte';

	import { showModal, showResultModal } from '../stores/resultModalStore';
	import Loading from '$lib/Loading.svelte';
	import { loading } from '../stores/loadingStore';

	let fileReader: FileReader;
	let fileName: string;

	let tagByteSize = 0;
	let contentByteSize = 0;
	let image: Buffer;
	let postCost = 0;
	let loadCost = false;

	let error = {
		Wallet: '',
		NoFile: '',
		WrongFileType: '',
		Balance: ''
	};

	const handleFileChosen = (e: CustomEvent) => {
		let errorKey = false;

		error.NoFile = '';
		error.WrongFileType = '';

		if (e.detail.files.type != 'image/png') {
			error.WrongFileType = 'Incorrect file type, must be png';
			errorKey = true;
		}

		if (!errorKey) {
			loading.setLoading(true);
			loadCost = true;
			fileName = e.detail.files.name;
			fileReader = new FileReader();
			fileReader.onloadend = loadImage;
			fileReader.readAsArrayBuffer(e.detail.files);
		}
	};

	const loadImage = async () => {
		image = fileReader.result as Buffer;
		contentByteSize = new Blob([image]).size;
		await getPostCost(contentByteSize).then((result) => {
			postCost = +result / 1000000000000;
			loadCost = false;
		});
		loading.setLoading(false);
	};

	const handleSubmit = async () => {
		let errorKey = false;
		if (!sessionStorage.getItem('wallet_address')) {
			error.Wallet = 'No wallet is connected';
			errorKey = true;
		}
		if (!fileName) {
			error.NoFile = 'No file has been selected';
			errorKey = true;
		}
		if (postCost > $walletBalance) {
			error.Balance = 'Not enought tokens in wallet';
			errorKey = true;
		}

		if (!errorKey) {
			const response = await createArweavePost(image, tags);

			if (response.status === 200) {
				updateWalletBalance();
				showResultModal('Post success!', 'Transaction ID :' + response.id);
			} else {
				showResultModal('Something went wrong', 'Arweave error: ' + response.statusText);
			}
		}

		error.Wallet = '';

		loading.setLoading(false);
	};
</script>

<div class="content-container">
	<div class="content">
		<h2>Image poster</h2>
		<div>
			<small>File must be png format</small>
			<FileDrop
				class="lg"
				multiple={false}
				accept="image/png"
				on:input={handleFileChosen}
				text="Drag &amp; drop image or click to browse"
			/>
			{#if fileName}
				<p>Selected image: <b>{fileName}</b></p>
			{/if}
			<InputError error={error.WrongFileType} />
		</div>
		<div class="spacer">
			<TagInput bind:tagsByteSize={tagByteSize} {tags} />
		</div>
		<div>
			<div class="line-spacer">
				<PostCost bind:postCost bind:loadCost />
				{#if fileName}
					<p><small> Image size: <b>{contentByteSize} </b>bytes</small></p>
				{/if}
			</div>
			<div class="line-spacer-bottom">
				<WalletBalance />
			</div>

			<div class="spacer">
				<InputError error={error.Wallet} />
				<InputError error={error.NoFile} />
				<InputError error={error.Balance} />
				<Button class="lg default" type="button" on:click={() => handleSubmit()}>
					Post to permaweb
				</Button>
			</div>
		</div>
	</div>
</div>
{#if $showModal}
	<ResultModal />
{/if}

<Loading />

<style>
	.content-container {
		padding: 0;
		margin: 0;
		display: flex;
		flex: 1 1 auto;
		align-items: center;
		justify-content: center;
	}
	.content {
		color: white;
		width: 80vw;
		min-height: 20vh;
		text-align: center;
	}
	.spacer {
		margin-top: 2vh;
	}

	.line-spacer {
		border-bottom: 1px solid white;
		border-top: 1px solid white;
		margin-top: 5px;
	}
	.line-spacer-bottom {
		border-bottom: 1px solid white;
		margin-top: 5px;
	}
</style>
