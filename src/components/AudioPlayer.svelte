<script>
	export let Title;
	export let Subtitle;
	export let AudioLink;

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
</script>

<div class="player" class:paused>
	<audio
		src={AudioLink}
		bind:currentTime={time}
		bind:duration
		bind:paused
		bind:volume
		preload="none"
		on:ended={() => { time = 0; }}
	></audio>

	<!-- Column 1, Row 1: play button + metadata -->
	<div class="top-row">
		<button
			class="play"
			aria-label={paused ? 'play' : 'pause'}
			on:click={() => paused = !paused}
		></button>
		<div class="meta">
			<div class="title"><strong>{Title}</strong></div>
			{#if Subtitle}<div class="subtitle"><small>{Subtitle}</small></div>{/if}
		</div>
	</div>

	<!-- Column 1, Row 2: time slider -->
	<div
		class="time-row"
		on:pointerdown={e => {
			const slider = e.currentTarget.querySelector('.slider');
			if (!slider || !e.target.closest('.slider')) return;
			function seek(e) {
				const { left, width } = slider.getBoundingClientRect();
				let p = (e.clientX - left) / width;
				if (p < 0) p = 0;
				if (p > 1) p = 1;
				time = p * duration;
			}
			seek(e);
			window.addEventListener('pointermove', seek);
			window.addEventListener('pointerup', () => {
				window.removeEventListener('pointermove', seek);
			}, { once: true });
		}}
	>
		<span class="ts">{format(time)}</span>
		<div class="slider">
			<div class="progress" style="--p: {time / duration}"></div>
		</div>
		<span class="ts">{duration ? format(duration) : '--:--'}</span>
	</div>

	<!-- Column 2: volume (spans both rows) -->
	<div class="volume">
		<div class="volume-icon" aria-label={volume === 0 ? 'muted' : 'unmuted'}></div>
		<div
			class="volume-slider"
			on:pointerdown={e => {
				const div = e.currentTarget;
				function adjust(e) {
					const { left, width } = div.getBoundingClientRect();
					let p = (e.clientX - left) / width;
					if (p < 0) p = 0;
					if (p > 1) p = 1;
					volume = p;
				}
				adjust(e);
				window.addEventListener('pointermove', adjust);
				window.addEventListener('pointerup', () => {
					window.removeEventListener('pointermove', adjust);
				}, { once: true });
			}}
		>
			<div class="progress" style="--p: {volume}"></div>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		column-gap: 1.1em;
		row-gap: 0.45em;
		padding: 0.3em 0.5em;
		background: transparent;
		color: inherit;
		user-select: none;
		width: 100%;
		min-width: 0;
		box-sizing: border-box;
		overflow: hidden;
	}

	/* ── Column 1, Row 1 ── */
	.top-row {
		grid-column: 1;
		grid-row: 1;
		display: flex;
		align-items: center;
		gap: 0.5em;
		min-width: 0;
		overflow: hidden;
	}

	button.play {
		width: 1.9em;
		height: 1.9em;
		flex-shrink: 0;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-color: color-mix(in srgb, var(--gc, white) 22%, white);
		border-radius: 50%;
		border: none;
		cursor: pointer;
	}
	button.play:hover  { background-color: color-mix(in srgb, var(--gc, white) 38%, white); }
	button.play:active { background-color: color-mix(in srgb, var(--gc, white) 55%, white); }
	[aria-label="pause"] { background-image: url(/pause.svg); }
	[aria-label="play"]  { background-image: url(/play.svg); }

	.meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
	}
	.title, .subtitle {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
		line-height: 1.2;
	}
	.subtitle small {
		opacity: 0.7;
		font-size: 0.8em;
	}

	/* ── Column 1, Row 2 ── */
	.time-row {
		grid-column: 1;
		grid-row: 2;
		display: flex;
		align-items: center;
		gap: 0.3em;
	}
	.ts {
		font-size: 0.65em;
		opacity: 0.7;
		white-space: nowrap;
		flex-shrink: 0;
	}
	.slider {
		flex: 1;
		height: 7px;
		background: color-mix(in srgb, var(--gc, #888) 30%, #2a2a3a);
		border-radius: 7px;
		overflow: hidden;
		cursor: pointer;
		border: 1px solid color-mix(in srgb, var(--gc, #888) 60%, transparent);
		box-sizing: border-box;
	}
	.slider .progress {
		width: calc(var(--p) * 100%);
		height: 100%;
		background: color-mix(in srgb, var(--gc, white) 75%, white);
	}

	/* ── Column 2, spans both rows ── */
	.volume {
		grid-column: 2;
		grid-row: 1 / span 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.3em;
		padding: 0 0.2em;
	}
	.volume-icon {
		width: 1.1em;
		height: 1.1em;
		flex-shrink: 0;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-image: url(/volume.svg);
	}
	[aria-label="muted"] { background-image: url(/volume-muted.svg); }
	.volume-slider {
		width: 52px;
		height: 7px;
		background: color-mix(in srgb, var(--gc, #888) 30%, #2a2a3a);
		border-radius: 7px;
		overflow: hidden;
		cursor: pointer;
		border: 1px solid color-mix(in srgb, var(--gc, #888) 60%, transparent);
		box-sizing: border-box;
	}
	.volume-slider .progress {
		width: calc(var(--p) * 100%);
		height: 100%;
		background: color-mix(in srgb, var(--gc, white) 75%, white);
	}
</style>
