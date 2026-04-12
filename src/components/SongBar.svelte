<script>
    import { navigate } from 'svelte-routing';

    import DifficultyBlock from "../components/DifficultyBlock.svelte";
    import AudioPlayer from "../components/AudioPlayer.svelte";
    import { GENRES } from "../lib/genres.js";

    export let Rank;
    export let Title;
    export let Subtitle;
    export let Difficulties = [-1, -1, -1, -1, -1, -1, -1];
    export let AudioFilePath;
    export let Genre;
    export let MaxListPoints;
    export let UniqueId;

    $: AudioLink = `https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/${AudioFilePath}`;
    $: SongDetailsUrl = `/songinfo/${UniqueId}`;

    $: genreData = GENRES.find(g => g.css === Genre);
    $: barStyle = genreData
        ? `--gc:${genreData.accent}; color:${genreData.text}; --overlay:${genreData.overlay}; --bar-image:url('/image/genreBar/${Genre}.png')`
        : `--gc:#888; color:white; --overlay:rgba(128,128,128,0.75); --bar-image:url('/image/genreBar/hq.png')`;

    const MoveToSongInfo = (e) => {
        if (UniqueId === undefined) return;
        const isControl = e.target.closest('button')
                       || e.target.closest('.slider')
                       || e.target.closest('.volume-slider');
        if (!isControl) window.open(SongDetailsUrl, '_blank');
    }

</script>

<div class="song_bar {Rank !== undefined ? 'hof' : ''} {UniqueId !== undefined ? 'song_bar_clickable' : ''}" style={barStyle} on:click={MoveToSongInfo}>
    {#if Rank !== undefined}
    <div class="song_bar_rank {Rank === 1 ? 'rank-gold' : Rank === 2 ? 'rank-silver' : Rank === 3 ? 'rank-bronze' : ''}">
        <span class="rank-nb">#{Rank}</span>
        <span class="rank-pts">{MaxListPoints} LP</span>
    </div>
    {/if}

    <div class="song_bar_main_info">
        <AudioPlayer
            Title={Title}
            Subtitle={Subtitle}
            AudioLink={AudioLink}
        />
    </div>

    {#if Rank !== undefined}
        <!-- HoF: difficulty wrapped in same card style as main_info -->
        <div class="hof_diff_card">
            {#each Difficulties as diff, i}
                {#if diff >= 0}
                <DifficultyBlock Level={diff} Difficulty={i} roundLeft={true} />
                {/if}
            {/each}
        </div>
    {:else}
        <!-- Regular: always 5 blocks (Easy–Edit); first one rounds left -->
        {#each Array(5) as _, i}
            <DifficultyBlock
                Level={Difficulties[i] ?? -1}
                Difficulty={i}
                ghost={(Difficulties[i] ?? -1) < 0}
                roundLeft={i === 0}
            />
        {/each}
    {/if}
</div>

<style>
    @keyframes flashy-glow {
        0%  { box-shadow: 0 0 0 3px rgba(0,145,255,0.80), 0 0 14px rgba(0,145,255,0.35); }
        50% { box-shadow: 0 0 0 3px rgba(0,145,255,1.00), 0 0 28px rgba(0,145,255,0.60); }
        100%{ box-shadow: 0 0 0 3px rgba(0,145,255,0.80), 0 0 14px rgba(0,145,255,0.35); }
    }

    /* show glow + pointer only when hovering outside the audio controls */
    .song_bar_clickable:hover:not(:has(button:hover)):not(:has(.slider:hover)):not(:has(.volume-slider:hover)) {
        animation: flashy-glow 1.4s ease-in-out infinite;
        cursor: pointer;
    }

    .song_bar {
        margin: 6px 0;
        padding: 0;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        box-shadow: 0 4px 18px rgba(0,0,0,0.45);
        background: var(--gc, #0d0d1a);
    }

    /* HoF bars: left border stripe is black instead of chapter color */
    .song_bar.hof {
        border-left-color: #111 !important;
    }

    .song_bar_main_info {
        flex: 1;
        min-width: 0;
        padding: 4px 8px;
        margin: 5px 4px;
        border: 2px solid var(--gc, #444);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        overflow: hidden;
    }

    .song_bar_rank {
        width: 110px;
        flex-shrink: 0;
        border-radius: 0 14px 14px 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 6px 10px 6px 18px;
        gap: 4px;
        background: #15151e;
    }

    .rank-nb {
        font-size: 2.4em;
        font-weight: 900;
        line-height: 1;
        color: #ffffff;
        text-shadow: 0 2px 6px rgba(0,0,0,0.6);
    }

    .rank-pts {
        font-size: 0.78em;
        font-weight: 500;
        color: rgba(255,255,255,0.55);
        letter-spacing: 0.03em;
    }

    .rank-bronze .rank-nb {
        font-size: 2.7em;
        color: #FFA726;
        text-shadow: 0 0 12px rgba(255, 167, 38, 0.85), 0 2px 4px rgba(0,0,0,0.5);
    }

    .rank-silver .rank-nb {
        font-size: 3em;
        color: #E8E8E8;
        text-shadow: 0 0 12px rgba(230, 230, 230, 0.85), 0 2px 4px rgba(0,0,0,0.4);
    }

    .rank-gold .rank-nb {
        font-size: 3.4em;
        color: #FFD740;
        text-shadow: 0 0 16px rgba(255, 215, 0, 0.95), 0 0 32px rgba(255, 200, 0, 0.5), 0 2px 4px rgba(0,0,0,0.4);
    }

    /* ── Genre accent + left border — driven by inline --gc / --overlay / --bar-image ── */
    .song_bar {
        border-left: 8px solid var(--gc, #888);
    }

    /* ── HoF difficulty card — flex wrapper only, no border ── */
    .hof_diff_card {
        display: flex;
        align-items: stretch;
        overflow: hidden;
        flex-shrink: 0;
    }

    /* ── Background overlay — generic, driven by CSS variables ── */
    .song_bar_main_info {
        background: linear-gradient(var(--overlay, rgba(128,128,128,0.75)), var(--overlay, rgba(128,128,128,0.75))),
                    var(--bar-image, none) center/cover;
    }
</style>
