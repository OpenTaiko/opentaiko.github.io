<script>
	import { Router, Link, Route } from "svelte-routing";
	import { _ } from "svelte-i18n";
	import Home from "./routes/Home.svelte";
	import Download from "./routes/Download.svelte";
	import Songlist from "./routes/Songlist.svelte";
	import Towers from "./routes/Towers.svelte";
	import Songinfo from "./routes/Songinfo.svelte";
	import PlayerInfo from "./routes/PlayerInfo.svelte";
	import Secret from "./routes/Secret.svelte";
	import HoF from "./routes/HoF.svelte";
	import Leaderboards from "./routes/Leaderboards.svelte";
	import Artistinfo from "./routes/Artistinfo.svelte";
	import Artists from "./routes/Artists.svelte";

	/* Special/Event Pages */
	import Karting from "./routes/special/Karting.svelte";

	import Footer from "./components/Footer.svelte";
	import LangSelector from "./components/LangSelector.svelte";

	export let url = "";

	// each nav item and the paths it stays lit on
	const NAV = [
		{ to: "/download", key: "nav.download", paths: ["/download"] },
		{ to: "/songlist", key: "nav.songlist", paths: ["/songlist", "/songinfo"] },
		{ to: "/towers", key: "nav.towers", paths: ["/towers"] },
		{ to: "/artists", key: "nav.artists", paths: ["/artists", "/artistinfo"] },
		{ to: "/hof", key: "nav.hof", paths: ["/hof", "/leaderboards", "/playerinfo"] },
	];
	const lit = (paths) => ({ location }) =>
		({ class: paths.some(p => location.pathname.startsWith(p)) ? "on" : "" });
</script>

<!-- the pagoda's cloud bank (story/bg/beanstalk/cloud.png) drifting along the bottom of the sky -->
<div class="sky-clouds" aria-hidden="true"><div class="cloud-track"></div></div>

<Router {url}>
	<header>
		<div class="header-inner">
			<Link to="/" class="brand" aria-label={$_('nav.home')}>
				<img src="/image/skin/logo/wordmark.png" alt="OpenTaiko" />
			</Link>
			<nav>
				{#each NAV as item}
					<Link to={item.to} getProps={lit(item.paths)}>{$_(item.key)}</Link>
				{/each}
			</nav>
			<LangSelector />
		</div>
	</header>
	<div class="content">
		<Route path="/">
			<Home />
		</Route>
		<Route path="/download">
			<Download />
		</Route>
		<Route path="/songlist">
			<Songlist />
		</Route>
		<Route path="/towers">
			<Towers />
		</Route>
		<Route path="/secret">
			<Secret />
		</Route>
		<Route path="/hof">
			<HoF />
		</Route>
		<Route path="/leaderboards">
			<Leaderboards />
		</Route>
		<Route path="/songinfo/:UniqueId" let:params>
			<Songinfo UniqueId={params.UniqueId}/>
		</Route>
		<Route path="/playerinfo/:Player" let:params>
			<PlayerInfo Player={params.Player}/>
		</Route>
		<Route path="/artistinfo/:ArtistId" let:params>
			<Artistinfo ArtistId={params.ArtistId}/>
		</Route>
		<Route path="/artists">
			<Artists />
		</Route>

		<!-- Special/Event Pages -->
		<Route path="/special/karting">
			<Karting />
		</Route>
		<Route path="/special/optk_k.html">
			<!-- Redirect old URL -->
			<script>window.location.replace("/special/karting")</script>
		</Route>
	</div>
	<Footer />
</Router>

<style>
	/* The strip is 720 × 411 and tiles seamlessly; drawn 300 px tall it repeats every 525.55 px.
	   The pagoda scrolls it at -40 px/s drawn at scale 2, i.e. one tile every 36 s; it moves by
	   transform (composited) rather than by an animated background-position (repainted). */
	.sky-clouds {
		position: fixed;
		left: 0;
		right: 0;
		bottom: var(--footer-h);
		height: 300px;
		overflow: hidden;
		z-index: -1;
		pointer-events: none;
	}
	.cloud-track {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: calc(100% + 525.55px);
		background: url(/image/skin/sky/cloud.png) repeat-x 0 100% / 525.55px 300px;
		animation: cloud-drift 36s linear infinite;
		will-change: transform;
	}
	@keyframes cloud-drift {
		from { transform: translateX(0); }
		to { transform: translateX(-525.55px); }
	}
	@media (prefers-reduced-motion: reduce) {
		.cloud-track { animation: none; }
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		min-height: var(--header-h);
		z-index: 10;
		background: linear-gradient(180deg, #1d75ce, #2a86da);
		border-bottom: 2px solid rgba(13, 36, 64, 0.35);
		box-shadow: 0 4px 14px rgba(13, 36, 64, 0.18);
	}
	.header-inner {
		max-width: 1180px;
		margin: 0 auto;
		padding: 8px 24px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		gap: 22px;
		min-height: var(--header-h);
	}
	header :global(.brand) {
		display: flex;
		flex: none;
	}
	header :global(.brand img) {
		height: 34px;
		display: block;
		filter: drop-shadow(0 2px 0 rgba(13, 36, 64, 0.3));
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		align-self: stretch;
		flex: 1;
		min-width: 0;
		margin: -8px 0;
		font-size: 15px;
		font-weight: 500;
	}
	/* each item is a full-height tab: hover lights the tab and draws a white underline on the
	   header's bottom edge, where the current page's yellow one sits */
	nav :global(a) {
		display: flex;
		align-items: center;
		color: rgba(255, 255, 255, 0.88);
		text-decoration: none;
		padding: 3px 12px 0;
		border-bottom: 3px solid transparent;
		white-space: nowrap;
		transition: background-color 0.15s, color 0.15s, border-color 0.15s;
	}
	nav :global(a:hover), nav :global(a:focus-visible) {
		color: #ffffff;
		background-color: rgba(255, 255, 255, 0.12);
		border-bottom-color: rgba(255, 255, 255, 0.7);
		outline: none;
	}
	nav :global(a.on) {
		color: #ffffff;
		border-bottom-color: var(--sun);
	}

	.content {
		margin-top: calc(var(--header-h) + 2px);
		padding: 12px 0 calc(var(--footer-h) + 48px);
	}

	@media (max-width: 760px) {
		.header-inner { flex-wrap: wrap; gap: 8px 14px; padding: 8px 16px; }
		nav { order: 3; flex-basis: 100%; margin: 0 -16px -8px; font-size: 14px; }
		nav :global(a) { padding: 8px 10px 5px; }
		.content { margin-top: 104px; }
	}
</style>
