<script lang="ts">
	import { isBlank, isEmpty } from '$lib/utils/ValidatorUtils';
	import TagInput from '$lib/TagInput.svelte';
	import { createArweavePost, getPostCost } from '$lib/utils/ArweaveUtils';
	import Button from '$lib/Button.svelte';
	import { tags } from '../stores/tagStore';
	import InputError from '$lib/InputError.svelte';
	import PostCost from '$lib/PostCost.svelte';
	import WalletBalance from '$lib/WalletBalance.svelte';
	import { walletBalance } from '../stores/walletStore';
	import ResultModal from '$lib/ResultModal.svelte';
	import { showModal, showResultModal } from '../stores/resultModalStore';
	import { loading } from '../stores/loadingStore';
	import Loading from '$lib/Loading.svelte';

	let content: string;
	let tagSize = 0;
	let contentByteSize = 0;
	let postCost = 0;
	let timeout = null;
	let loadCost = false;

	const error = {
		Content: '',
		Wallet: '',
		Balance: ''
	};

	const removeError = async (event) => {
		event.target.classList.remove('error');
		error[event.target.name] = '';
	};

	const handleSubmit = async () => {
		loading.setLoading(true);
		let errorFlag = false;
		if (isBlank(content) || isEmpty(content)) {
			error.Content = 'Content is required';
			errorFlag = true;
		}
		if (!sessionStorage.getItem('wallet_address')) {
			error.Wallet = 'No wallet is connected';
			errorFlag = true;
		}
		if (postCost > $walletBalance) {
			error.Balance = 'Not enought tokens in wallet';
			errorFlag = true;
		}

		if (!errorFlag) {
			contentByteSize = new Blob([content]).size;
			const response = await createArweavePost(content, tags);

			if (response.status === 200) {
				showResultModal('Post success!', 'Transaction ID :' + response.id);
			} else {
				showResultModal('Something went wrong', 'Arweave error: ' + response.statusText);
			}
		}

		error.Wallet = '';
		loading.setLoading(false);
	};

	const calculatePostCost = async () => {
		loadCost = true;
		clearTimeout(timeout);
		timeout = setTimeout(async () => {
			contentByteSize = new Blob([content]).size;
			await getPostCost(contentByteSize).then((result) => {
				postCost = +result / 1000000000000;
				loadCost = false;
			});
		}, 1000);
	};
</script>

<div class="content-container">
	<div class="content">
		<form>
			<div>
				<h2>Text poster</h2>
			</div>
			<div>
				<textarea
					class="post-content {error.Content ? 'error' : ''}"
					type="text"
					id="post"
					name="Content"
					on:input={removeError}
					bind:value={content}
					on:keyup={calculatePostCost}
				/>
				<InputError error={error.Content} />
			</div>
			<div>
				<h2>Tags</h2>
				<TagInput bind:tagsByteSize={tagSize} {tags} />
			</div>
			<div class="line-spacer">
				<PostCost bind:postCost bind:loadCost />
				<p><small> Content size: <b>{contentByteSize} </b>bytes</small></p>
			</div>
			<div class="line-spacer-bottom">
				<WalletBalance />
			</div>
			<div class="submit-wrapper">
				<InputError error={error.Balance} />
				<InputError error={error.Wallet} />
				<Button class="lg default" type="button" on:click={() => handleSubmit()}>
					Post to permaweb
				</Button>
			</div>
		</form>
	</div>
</div>

<Loading />

{#if $showModal}
	<ResultModal />
{/if}

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
	.submit-wrapper {
		margin-top: 3vh;
	}
	.post-content {
		border-radius: 10px;
		background-color: #202731;
		color: white;
	}
	.post-content {
		min-width: 60vw;
		max-width: 80vw;
		min-height: 30vh;
	}
	.post-content:focus {
		box-shadow: 0 0 7px white;
		transition: all 0.3s ease-in-out;
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
	.error {
		outline: none !important;
		border: 1px solid red;
		box-shadow: 0 0 5px red;
		animation: kf_shake 0.4s 1 linear;
		-webkit-animation: kf_shake 0.4s 1 linear;
		-moz-animation: kf_shake 0.4s 1 linear;
		-o-animation: kf_shake 0.4s 1 linear;
	}
	@keyframes kf_shake {
		0% {
			-webkit-transform: translate(30px);
		}
		20% {
			-webkit-transform: translate(-30px);
		}
		40% {
			-webkit-transform: translate(15px);
		}
		60% {
			-webkit-transform: translate(-15px);
		}
		80% {
			-webkit-transform: translate(8px);
		}
		100% {
			-webkit-transform: translate(0px);
		}
	}
	@-webkit-keyframes kf_shake {
		0% {
			-webkit-transform: translate(30px);
		}
		20% {
			-webkit-transform: translate(-30px);
		}
		40% {
			-webkit-transform: translate(15px);
		}
		60% {
			-webkit-transform: translate(-15px);
		}
		80% {
			-webkit-transform: translate(8px);
		}
		100% {
			-webkit-transform: translate(0px);
		}
	}
	@-moz-keyframes kf_shake {
		0% {
			-moz-transform: translate(30px);
		}
		20% {
			-moz-transform: translate(-30px);
		}
		40% {
			-moz-transform: translate(15px);
		}
		60% {
			-moz-transform: translate(-15px);
		}
		80% {
			-moz-transform: translate(8px);
		}
		100% {
			-moz-transform: translate(0px);
		}
	}
	@-o-keyframes kf_shake {
		0% {
			-o-transform: translate(30px);
		}
		20% {
			-o-transform: translate(-30px);
		}
		40% {
			-o-transform: translate(15px);
		}
		60% {
			-o-transform: translate(-15px);
		}
		80% {
			-o-transform: translate(8px);
		}
		100% {
			-o-origin-transform: translate(0px);
		}
	}
</style>
