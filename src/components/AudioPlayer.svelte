<script>
	export let Title;
    export let Subtitle;
	export let AudioLink;

	let time = 0;
	let duration = 0;
	let paused = true;
	let volume = 1;

	function format(time) {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
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
		on:ended={() => {
			time = 0;
		}}
	></audio>
	
	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
		on:click={() => paused = !paused}
	></button>

	<div class="info">
		<div class="description">
			<strong>{Title}</strong>
			<br/><small>{Subtitle}</small>
		</div>

		<div class="time">
			<span>{format(time)}</span>
			<div
				class="slider"
				on:pointerdown={e => {
					const div = e.currentTarget;
					
					function seek(e) {
						const { left, width } = div.getBoundingClientRect();

						let p = (e.clientX - left) / width;
						if (p < 0) p = 0;
						if (p > 1) p = 1;
						
						time = p * duration;
					}

					seek(e);

					window.addEventListener('pointermove', seek);

					window.addEventListener('pointerup', () => {
						window.removeEventListener('pointermove', seek);
					}, {
						once: true
					});
				}}
			>
				<div class="progress" style="--progress: {time / duration}%"></div>
			</div>
			<span>{duration ? format(duration) : '--:--'}</span>
		</div>
	</div>


	<div class="volume">
		<div class="volume-icon" aria-label={volume === 0 ? 'muted' : 'unmuted'}></div>
		<div
			class="volume-slider"
			on:pointerdown={e => {
				const div = e.currentTarget;
				
				function adjustVolume(e) {
					const { left, width } = div.getBoundingClientRect();

					let p = (e.clientX - left) / width;
					if (p < 0) p = 0;
					if (p > 1) p = 1;
					
					volume = p;
				}

				adjustVolume(e);

				window.addEventListener('pointermove', adjustVolume);

				window.addEventListener('pointerup', () => {
					window.removeEventListener('pointermove', adjustVolume);
				}, {
					once: true
				});
			}}
		>
			<div class="progress" style="--progress: {volume * 100}%"></div>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 1em 1.5em 1em 1em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: var(--fg-3);
		user-select: none;
		width: 450px;
		background-color: rgba(255,255,255,0.2);
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0,0,0,0.1));
	}

	.volume {
		width: 200px;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.volume-slider {
		width: 100px;
		height: 0.5em;
		background: rgba(255, 175, 175, 0.8);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.volume-slider .progress {
		width: calc(var(--progress));
		height: 100%;
		background: rgba(175, 175, 255, 0.8);
	}

	.volume-icon {
		width: 1em;
		height: 1em;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-image: url(/volume.svg);
	}

	[aria-label="muted"] {
		background-image: url(/volume-muted.svg);
	}
	
	button.play {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
        background-color: rgba(255, 255, 255, 0.8);
		border-radius: 50%;
	}

    button.play:hover {
        background-color: rgba(215, 215, 215, 0.8);
    }

    button.play:active {
        background-color: rgba(180, 180, 180, 0.8);
    }
	
	[aria-label="pause"] {
		background-image: url(/pause.svg);
	}

	[aria-label="play"] {
		background-image: url(/play.svg);
	}

	.info {
		overflow: hidden;
	}

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.5em;
		background: rgba(255,175,175,0.8);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: rgba(175,175,255,0.8);
	}
</style>