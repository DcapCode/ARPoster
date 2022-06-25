<script lang="ts">
	let buttonProps = {
		class: $$restProps.class,
		type: $$restProps.type
	};
</script>

<button on:click on:mouseover on:focus on:mouseenter on:mouseleave {...buttonProps}>
	<slot />
</button>

<style>
	button {
		border: none;
		color: white;
		border-radius: 0.5em;
		transition: all 0.3s;
		background: #202731;
	}

	button:active {
		color: #666;
		box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
	}

	.vsm {
		font-size: 10px;
		border-radius: 1em;
	}
	.lg {
		/* font-size: 2em; */
		padding: 0.7em 1.7em;
		font-size: 18px;
	}
	.mi {
		padding: 0.4em 0.7em;
		font-size: 14px;
	}

	.default {
		border: 1px solid white;
		color: white;
	}
	.red {
		border: 1px solid red;
		color: red;
	}
</style>
