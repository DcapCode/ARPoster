<script lang="ts">
	import WalletConnection from '../components/WalletConnection.svelte';
	let isMobileNavOpen = false;
	const toggleMobileNav = () => (isMobileNavOpen = !isMobileNavOpen);

	const navItems = [
		{
			url: '/',
			label: 'Text'
		},
		{
			url: '/images',
			label: 'Images'
		}
	];
</script>

<header class="topSvg">
	<a href="/">AR Poster</a>
	<div class="menu-btn" class:open={isMobileNavOpen} on:click={toggleMobileNav}>
		<div class="menu-btn__lines" />
	</div>
	<ul class="menu-items" class:open={isMobileNavOpen}>
		<li>
			<WalletConnection />
		</li>
		{#each navItems as item}
			<li on:click={toggleMobileNav}>
				<a href={item.url} class="menu-item">{item.label}</a>
			</li>
		{/each}
	</ul>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		flex: 0 1;
		padding-bottom: 10vh;
		min-height: 25vh;
	}
	header a {
		font-size: 2rem;
		text-decoration: none;
		color: white;
		padding-top: 4vh;
		padding-left: 10vw;
	}
	.menu-items {
		list-style: none;
		align-items: center;
		display: flex;
		padding-right: 7vw;
		padding-bottom: 12vh;
	}
	.menu-items li a {
		font-size: 1rem;
		padding: 0.5em 1em;
		transition: background 0.3s ease-in-out, color 0.3s ease-in-out;
	}
	.topSvg {
		background-image: url('/layered-waves-top.svg');
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		width: 100%;
	}

	/* Hamburger Icon */
	.menu-btn {
		display: none;
		justify-content: center;
		align-items: center;
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		z-index: 1;
		padding-top: 5vh;
		padding-right: 10vw;
	}
	.menu-btn__lines,
	.menu-btn__lines::before,
	.menu-btn__lines::after {
		width: 1.5rem;
		height: 0.1rem;
		background-color: white;
		transition: all 0.5s ease-in-out;
	}
	.menu-btn__lines::before,
	.menu-btn__lines::after {
		content: '';
		position: absolute;
	}
	.menu-btn__lines::before {
		transform: translateY(-0.5rem);
	}
	.menu-btn__lines::after {
		transform: translateY(0.5rem);
	}
	.menu-btn.open .menu-btn__lines {
		transform: translateX(2rem);
		background-color: transparent;
	}
	.menu-btn.open .menu-btn__lines::before {
		transform: rotate(45deg) translate(-1.5rem, 1.5rem);
		background-color: #ffffff;
	}
	.menu-btn.open .menu-btn__lines::after {
		transform: rotate(-45deg) translate(-1.5rem, -1.5rem);
		background-color: #ffffff;
	}
	@media only screen and (max-width: 768px) {
		.menu-btn {
			display: flex;
		}
		.menu-items {
			flex-direction: column;
			justify-content: space-around;
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			height: 100vh;
			background-color: #202731;
			transform: translateX(100vw);
			transition: transform 0.3s ease-in-out;
			text-align: center;
		}
		.menu-items.open {
			transform: translateX(0);
		}
		.menu-items.open li {
			width: 100vw;
			height: 100%;
			padding-left: 2rem;
		}
		.menu-items.open li a {
			color: #ffffff;
			font-size: 5vh;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
		}
		.menu-items.open li a:hover {
			color: #111111;
		}
	}
</style>
