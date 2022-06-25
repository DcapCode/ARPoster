<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let multiple = false;
	export let accept: string;
	export let text: string;

	let props = {
		class: $$restProps.class
	};

	let dragging = false;

	const dispatch = createEventDispatcher();

	const startDragging = () => (dragging = true);
	const stopDragging = () => (dragging = false);

	export const getFilesFromDropEvent = ({ dataTransfer: { files, items } }) => {
		return files.length
			? [...files]
			: items.filter(({ kind }) => kind === 'file').map(({ getAsFile }) => getAsFile());
	};

	export const getFilesFromInputEvent = ({ target }) => {
		const files = target.files ? [...target.files] : [];
		target.value = '';
		return files;
	};

	const onFile = (getFilesFunction) => (event) => {
		stopDragging();
		const files: File[] = getFilesFunction(event);

		files.forEach((f) => {
			if (f.type !== accept) {
				return;
			}
		});

		if (files.length) {
			dispatch('input', { files: multiple ? files : files[0] });
		}
	};
</script>

<div {...props}>
	<label
		class:dragging
		on:drop|preventDefault={onFile(getFilesFromDropEvent)}
		on:dragover|preventDefault={startDragging}
		on:dragleave|preventDefault={stopDragging}
	>
		<slot {dragging}>
			<div>{text}</div>
		</slot>
		<input
			class="file-drop-input"
			type="file"
			{multiple}
			{accept}
			on:input={onFile(getFilesFromInputEvent)}
		/>
	</label>
</div>

<style>
	.file-drop-input {
		display: none;
	}
	.lg {
		border: 2px dotted white;
		margin-left: 25vw;
		max-width: 30vw;
	}
	.normal {
		border: 2px dotted white;
	}
</style>
