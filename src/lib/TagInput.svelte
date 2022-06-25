<script lang="ts">
	import { isBlankOrEmpty } from '$lib/utils/ValidatorUtils';
	import { fade } from 'svelte/transition';
	import Button from '$lib/Button.svelte';
	import { onMount } from 'svelte';

	const error = {
		Name: '',
		Value: '',
		Empty: '',
		Exists: '',
		TagSize: ''
	};

	let name;
	let value;

	export let tagsByteSize = 0;
	export let tags;

	const removeError = (event) => {
		event.target.classList.remove('error');
		error[event.target.name] = '';
		error.Empty = '';
		if (event.target.name === 'Name') {
			error.Exists = '';
		}
	};

	const calculateTagSize = () => {
		console.log('calculating tagsize', tags);
		tagsByteSize = 0;
		$tags.forEach((tag) => {
			tagsByteSize += new Blob([tag.name]).size;
			tagsByteSize += new Blob([tag.value]).size;
		});
	};

	const handleSubmit = () => {
		let errorFlag = false;
		// findIndex returns -1 if a match is not found
		let tagExists = $tags.findIndex((item) => item.name === name) !== -1;

		if (isBlankOrEmpty(name) || isBlankOrEmpty(value) || tagExists) {
			if (!isBlankOrEmpty(name) && isBlankOrEmpty(value)) {
				error.Value = 'Tag value is missing';
			} else if (isBlankOrEmpty(name) && !isBlankOrEmpty(value)) {
				error.Name = 'Tag name is missing';
			} else if (isBlankOrEmpty(name) && isBlankOrEmpty(value)) {
				error.Empty = 'Cant add empty tag';
			}
			if (tagsByteSize > 2048) {
				error.TagSize = 'Size of the tags may not exceed 2048 bytes';
			}
			if (tagExists) {
				error.Exists = 'Tag with that name already exists';
			}
			errorFlag = true;
		}

		if (!errorFlag) {
			tags.create(name, value);
			calculateTagSize();
			name = '';
			value = '';
		}
	};

	onMount(() => {
		calculateTagSize();
	});
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input
		class="name-input {error.Name || error.Empty || error.Exists || error.TagSize ? 'error' : ''}"
		type="text"
		bind:value={name}
		placeholder="Name"
		list="items"
		name="Name"
		on:input={removeError}
	/>

	<input
		class="value-input {error.Value || error.Empty || error.TagSize ? 'error' : ''}"
		type="text"
		bind:value
		placeholder="Value"
		name="Value"
		on:input={removeError}
	/>
	{#if error.Value || error.Name || error.Empty || error.Exists || error.TagSize}
		<p in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
			<small style="color: red">{error.Empty.length === 0 ? error.Value : ''}</small>
			<small style="color: red">{error.Empty.length === 0 ? error.Name : ''}</small>
			<small style="color: red">{error.Empty}</small>
			<br />
			<small style="color: red">{error.Empty.length === 0 ? error.Exists : ''}</small>
			<br />
			<small style="color: red">{error.Empty.length === 0 ? error.TagSize : ''}</small>
		</p>
	{/if}
	<div class="add-button">
		<Button class="mi default" type="submit">Add tag</Button>
	</div>
</form>

{#if $tags.length > 0}
	<section>
		<div class="tag-info" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
			<p>The total size of the tags (names and values) may not exceed 2048 bytes</p>
			<p>Tags size: <b>{tagsByteSize}</b> bytes</p>
		</div>
		<div>
			{#each $tags as tag (tag.name)}
				<div in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
					{tag.name} :
					{tag.value}
					<Button
						class="vsm red"
						on:click={(event) => {
							event.preventDefault();
							tags.delete(tag.name);
							calculateTagSize();
						}}>x</Button
					>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	form {
		color: white;
		border-radius: 5px;
	}
	form input {
		font-size: 1.1rem;
		color: inherit;
		font-family: inherit;
		background: none;
		border: 1px solid white;
	}
	.name-input {
		border-bottom-left-radius: 10px;
		border-top-left-radius: 10px;
	}
	.value-input {
		border-bottom-right-radius: 10px;
		border-top-right-radius: 10px;
	}
	form input:focus {
		box-shadow: 0 0 7px white;
		transition: all 0.3s ease-in-out;
	}
	.add-button {
		margin-top: 10px;
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
	.tag-info {
		font-size: 12px;
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
