<script context="module">
	// only one preview plays at a time: starting one pauses the one before
	let current = null;
	export const claimPreview = (el) => {
		if (current && current !== el && !current.paused) current.pause();
		current = el;
	};
</script>

<script>
	// A song card's preview: the round play button, the title and artist, and while it plays
	// a seek bar and a volume slider under the title.
	import PlayButton from "./PlayButton.svelte";

	export let Title;
	export let Subtitle;
	export let AudioLink;

	let audio;
	let time = 0;
	let duration = 0;
	let paused = true;
	let volume = 1;

	function format(t) {
		if (isNaN(t)) return '...';
		const m = Math.floor(t / 60);
		const s = Math.floor(t % 60);
		return `${m}:${s < 10 ? `0${s}` : s}`;
	}

	const drag = (setter) => (e) => {
		const el = e.currentTarget;
		const apply = (ev) => {
			const { left, width } = el.getBoundingClientRect();
			setter(Math.max(0, Math.min(1, (ev.clientX - left) / width)));
		};
		apply(e);
		window.addEventListener('pointermove', apply);
		window.addEventListener('pointerup', () => window.removeEventListener('pointermove', apply), { once: true });
	};
</script>

<div class="player">
	<audio
		bind:this={audio}
		src={AudioLink}
		bind:currentTime={time}
		bind:duration
		bind:paused
		bind:volume
		preload="none"
		on:play={() => claimPreview(audio)}
		on:ended={() => { time = 0; }}
	></audio>

	<PlayButton playing={!paused} label={Title} on:click={() => paused ? audio.play().catch(() => {}) : audio.pause()} />

	<div class="meta">
		<div class="title ell" title={Title}>{Title}</div>
		{#if Subtitle}<div class="subtitle ell" title={Subtitle}>{Subtitle}</div>{/if}
		{#if !paused || time > 0}
			<div class="controls">
				<span class="ts">{format(time)}</span>
				<div class="slider" on:pointerdown|stopPropagation={drag(p => time = p * duration)}>
					<div class="progress" style="--p:{duration ? time / duration : 0}"></div>
				</div>
				<span class="ts">{duration ? format(duration) : '--:--'}</span>
				<svg class="vol-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18l-6-6H3a1 1 0 01-1-1v-4a1 1 0 011-1h3l6-6zM16 7.27V16.73c1.76-.76 3-2.48 3-4.73s-1.24-3.97-3-4.73z"/></svg>
				<div class="slider volume" on:pointerdown|stopPropagation={drag(p => volume = p)}>
					<div class="progress" style="--p:{volume}"></div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.player {
		display: flex;
		align-items: center;
		gap: 11px;
		min-width: 0;
		width: 100%;
		user-select: none;
	}
	.meta {
		flex: 1;
		min-width: 0;
		text-align: left;
	}
	.title {
		font-size: 17px;
		font-weight: 500;
		line-height: 1.25;
	}
	.subtitle {
		font-size: 12px;
		color: var(--ink-soft);
		line-height: 1.3;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 4px;
	}
	.ts {
		font-size: 11px;
		color: var(--ink-soft);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.slider {
		flex: 1;
		height: 7px;
		border-radius: 7px;
		background: #e3eef8;
		border: 1.5px solid var(--ink);
		overflow: hidden;
		cursor: pointer;
	}
	.slider.volume {
		flex: none;
		width: 52px;
	}
	.progress {
		width: calc(var(--p) * 100%);
		height: 100%;
		background: var(--sky-1);
	}
	.vol-icon {
		width: 15px;
		height: 15px;
		flex: none;
		fill: var(--ink-soft);
	}
</style>
