<script lang="ts">
	export let error;
</script>

{#if error}
	<p>
		<small style="color: red">{error}</small>
	</p>
{/if}

<style>
</style>
