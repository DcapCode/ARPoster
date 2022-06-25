<script lang="ts">
	export let postCost;
	export let loadCost;
</script>

<p>Post cost:</p>
<div>
	<div>
		{#if !loadCost}
			<p>AR: {postCost}</p>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>

<style>
</style>
