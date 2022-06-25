<script lang="ts">
	import TopNavBar from '$lib/TopNavBar.svelte';
	import FooterNavBar from '$lib/FooterNavBar.svelte';
</script>

<svelte:head>
	<meta name="viewport" content="initial-scale=1.0; width=device-width" />
	<meta charset="utf-8" />
	<title>AR Poster</title>
</svelte:head>

<body>
	<div class="contentWrapper">
		<TopNavBar />
		<slot />
		<FooterNavBar />
	</div>
</body>

<style>
	@font-face {
		font-family: 'Montserrat';
		src: url('/Montserrat-Italic-VariableFont_wght.ttf'), url('/Montserrat-VariableFont_wght.ttf');
	}
	body {
		background-color: #202731;
		font-family: 'Montserrat';
		margin: 0;
	}
	.contentWrapper {
		display: flex;
		padding: 0;
		min-height: 100vh;
		flex-direction: column;
	}
</style>
