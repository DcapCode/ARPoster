<script context="module" lang="ts">
	const modalList: HTMLElement[] = [];
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { booleanStore } from '../stores/booleanStore';

	const dispatch = createEventDispatcher();

	const store = booleanStore(false);
	const { isOpen, open, close } = store;

	const keydown = (e: KeyboardEvent) => {
		e.stopPropagation();

		if (e.key === 'Escape') {
			dispatch('closed');
		}
	};

	const transitionend = (e: TransitionEvent) => {
		const node = e.target as HTMLElement;
		node.focus();
	};

	const modalAction = (node: HTMLElement) => {
		const returnFn = [];

		if (document.body.style.overflow !== 'hidden') {
			const original = document.body.style.overflow;
			document.body.style.overflow = 'hidden';

			returnFn.push(() => {
				document.body.style.overflow = original;
			});
		}

		node.addEventListener('keydown', keydown);
		node.addEventListener('transitionend', transitionend);
		node.focus();
		modalList.push(node);

		returnFn.push(() => {
			node.removeEventListener('keydown', keydown);
			node.removeEventListener('transitionend', transitionend);
			modalList.pop();
			dispatch('closed');
			//guard against empty array
			modalList[modalList.length - 1]?.focus();
		});

		return {
			destroy: () => returnFn.forEach((fn) => fn())
		};
	};
</script>

<slot name="trigger" {open}>
	<!-- fallback trigger to open the modal -->
	<button on:click={open}>Open</button>
</slot>

{#if $isOpen}
	<div
		class="modal"
		use:modalAction
		tabindex="0"
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 200 }}
	>
		<div class="backdrop" on:click={close} />

		<div class="content-wrapper">
			<slot name="header" {store}>
				<!-- fallback -->
				<div>
					<h1>Your Modal Heading Goes Here...</h1>
				</div>
			</slot>

			<div class="content">
				<slot name="content" {store} />
			</div>

			<slot name="footer" {store}>
				<!-- fallback -->
				<div>
					<h1>Your Modal Footer Goes Here...</h1>
					<button on:click={close}>Close</button>
				</div>
			</slot>
		</div>
	</div>
{/if}

<style>
	div.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 1;
	}
	div.modal:not(:focus-within) {
		transition: opacity 0.1ms;
		opacity: 0.99;
	}
	div.backdrop {
		background-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		width: 100%;
		height: 100%;
	}
	div.content-wrapper {
		z-index: 10;
		max-width: 70vw;
		border-radius: 0.3rem;
		background-color: #202731;
		overflow: hidden;
	}
	@media (max-width: 767px) {
		div.content-wrapper {
			max-width: 100vw;
		}
	}
	div.content {
		max-height: 50vh;
		overflow: auto;
	}
	h1 {
		opacity: 0.5;
	}
</style>
