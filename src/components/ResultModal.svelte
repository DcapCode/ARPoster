<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import Button from './Button.svelte';
	import { modalContent, modalHeader, resetModal } from '../stores/resultModalStore';

	const handleClose = (close: () => void) => {
		close();
		resetModal();
	};
</script>

<div class="content">
	<Modal on:closed={() => resetModal()}>
		<div slot="trigger" let:open class="hidden">
			{open()}
		</div>
		<div slot="header">
			<h1>{$modalHeader}</h1>
		</div>
		<div slot="content">
			<div>
				<div class="info-spacer">
					<p>{$modalContent}</p>
				</div>
			</div>
		</div>
		<div slot="footer" let:store={{ close }}>
			<Button class="lg default" type="button" on:click={() => handleClose(close)}>Close</Button>
		</div>
	</Modal>
</div>

<style>
	.content {
		align-items: center;
		text-align: center;
		color: white;
	}
	.info-spacer {
		border-bottom: 1px solid white;
	}
	.hidden {
		display: none;
	}
</style>
