<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import Download from "./routes/Download.svelte";
	import Songlist from "./routes/Songlist.svelte";
	import Songinfo from "./routes/Songinfo.svelte";
	import Secret from "./routes/Secret.svelte";
	import HoF from "./routes/HoF.svelte";
	import Leaderboards from "./routes/Leaderboards.svelte";

	import Footer from "./components/Footer.svelte";

	export let url = "";
</script>

<Router {url}>
	<header>
		<h3><Link to="/">Home</Link></h3>
		<h3><Link to="/download">Download</Link></h3>
		<h3><Link to="/songlist">Songlist</Link></h3>
		<h3><Link to="/hof">Hall of Fame</Link></h3>
		<h3><a href="https://opentaiko.wiki.gg" target="_blank">Wiki</a></h3>
		<h3><a href="https://opentaiko.blogspot.com/" target="_blank">Blog</a></h3>
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
	</div>
	<Footer />
</Router>

<style>
	header {
		color: white;
		position: fixed;
		top: 0px;
		width: 100%;
		height: 64pt;

		background-image: linear-gradient(rgb(255, 102, 42), rgb(255, 133, 62));
		border-bottom: 4pt solid rgb(144, 32, 8);

		display: flex;
		flex-direction: row;
		justify-content: center;
		z-index: 1;
	}
	header h3 {
		margin: auto 10pt;
	}

	.content {
		margin: 68pt 0px;
		padding: 12pt 0px;
		padding-bottom: 76px;
	}
</style>