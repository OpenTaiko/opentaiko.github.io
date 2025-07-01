<script>
    import { navigate } from 'svelte-routing';

    import DifficultyBlock from "../components/DifficultyBlock.svelte";
    import AudioPlayer from "../components/AudioPlayer.svelte";

    export let Rank;
    export let Title;
    export let Subtitle;
    export let Difficulties = [-1, -1, -1, -1, -1, -1, -1];
    export let AudioFilePath;
    export let Genre;
    export let MaxListPoints;
    export let UniqueId;

    let boxEl = null;
    
    $: AudioLink = `https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/${AudioFilePath}`;
    $: SongDetailsUrl = `/songinfo/${UniqueId}`;

    const MoveToSongInfo = (e) => {
        if (UniqueId === undefined) return;
        if (!e.target.closest('.song_bar_main_info'))
            window.open(SongDetailsUrl, '_blank');
    }
    
</script>

<div class="{Genre} song_bar {(UniqueId !== undefined) ? "song_bar_clickable" : ""}" on:click={MoveToSongInfo}>
    {#if Rank !== undefined}
    <div class="song_bar_rank">
        <span class="song_bar_rank_nb">#{Rank}</span>
        <span>Max List Points:</span>
        <span>{MaxListPoints}</span>
    </div>
    {/if}
    
    <div class="song_bar_main_info" bind:this={boxEl}>
        <AudioPlayer
            Title={Title}
            Subtitle={Subtitle}
            AudioLink={AudioLink}
        />
    </div>

    <div class="song_bar_push">

    </div>

    {#each Difficulties as diff, i}
        {#if diff >= 0}
        <DifficultyBlock
            Level={diff}
            Difficulty={i}
        />
        {/if}
    {/each}
</div>

<style>
    @keyframes flashy-glow {
        0% {
            box-shadow: 0 0 2px #0080ff, 0 0 4px #0080ff, 0 0 6px #0080ff;
        }
        50% {
            box-shadow: 0 0 5px #0080ff, 0 0 13px #0080ff, 0 0 20px #0080ff;
        }
        100% {
            box-shadow: 0 0 2px #0080ff, 0 0 4px #0080ff, 0 0 6px #0080ff;
        }
    }

    .song_bar_clickable:hover:not(:has(.song_bar_main_info:hover)) {
        outline: 2px solid #0080ff;
        animation: flashy-glow 1.4s ease-in-out infinite;
        cursor: pointer;
    }

    .song_bar {
        margin: 8px;
        padding: 1px 8px;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
    
    .song_bar_main_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .song_bar_rank {
        width: 150px;
        display: flex;
        flex-direction: column;
    }

    .song_bar_rank_nb {
        font-size: 4em;
    }

    .song_bar_push {
        flex: 1;
    }

    .ch1 {
        border: 2px solid #994314;
        color: black;
        background: linear-gradient(to bottom, #f76b20 0%, #f76b20 5%, 
        rgba(255, 200, 81, 0.7) 30%, rgba(255, 200, 81,0.7) 70%, #f76b20 95%), url('/image/genreBar/ch1.png');
        background-size: cover;
        background-position: center;
    }
    .ch2 {
        border: 2px solid #282c75;
        color: white;
        background: linear-gradient(to bottom, #474ed6 0%, #474ed6 5%, 
        rgba(4, 9, 87, 0.8) 30%, rgba(4, 9, 87, 0.8) 70%, #474ed6 95%), url('/image/genreBar/ch2.png');
        background-size: cover;
        background-position: center;
    }
    .ch3 {
        border: 2px solid #2c9684;
        color: black;
        background: linear-gradient(to bottom, #48f7da 0%, #48f7da 5%, 
        rgba(255,255,255, 0.6) 30%, rgba(255,255,255, 0.6) 70%, #48f7da 95%), url('/image/genreBar/ch3.png');
        background-size: cover;
        background-position: center;
    }
    .ch4 {
        border: 2px solid #85912a;
        color: black;
        background: linear-gradient(to bottom, #e5f748 0%, #e5f748 5%, 
        transparent 30%, transparent 70%, #e5f748 95%), url('/image/genreBar/ch4.png');
        background-size: cover;
        background-position: center;
    }
    .ch5 {
        border: 2px solid #6d1f1f;
        color: black;
        background: linear-gradient(to bottom, #f74848 0%, #f74848 5%, 
        transparent 30%, transparent 70%, #f74848 95%), url('/image/genreBar/ch5.png');
        background-size: cover;
        background-position: center;
    }
	.ch6 {
        border: 2px solid #1b5561;
        color: black;
        background: linear-gradient(to bottom, #47c1f5 0%, #47c1f5 5%, 
        transparent 30%, transparent 70%, #47c1f5 95%), url('/image/genreBar/ch6.png');
        background-size: cover;
        background-position: center;
    }
    .deceiver {
        border: 2px solid #2e0404;
        color: white;
        background: linear-gradient(to bottom, #700b0b 0%, #700b0b 5%, 
        rgba(128, 0, 0, 0.5) 30%, rgba(128, 0, 0, 0.5) 70%, #700b0b 95%), url('/image/genreBar/deceiver.png');
        background-size: cover;
        background-position: center;
    }
    .dashy {
        border: 2px solid #888888;
        color: black;
        background: linear-gradient(to bottom, #ffffff 0%, #ffffff 5%, 
        rgba(255, 255, 255, 0.5) 30%, rgba(255, 255, 255, 0.5) 70%, #ffffff 95%), url('/image/genreBar/dashy.png');
        background-size: cover;
        background-position: center;
    }
    .rainy {
        border: 2px solid #030f01;
        color: white;
        background: linear-gradient(to bottom, #092d02 0%, #092d02 5%, 
        rgba(0, 22, 13, 0.5) 30%, rgba(0, 22, 13, 0.5) 70%, #092d02 95%), url('/image/genreBar/rainy.png');
        background-size: cover;
        background-position: center;
    }
    .hq {
        border: 2px solid #696969;
        color: black;
        background: linear-gradient(to bottom, #999999 0%, #999999 5%, 
        rgba(229, 255, 244, 0.5) 30%, rgba(229, 255, 244, 0.5) 70%, #999999 95%), url('/image/genreBar/hq.png');
        background-size: cover;
        background-position: center;
    }
    .outfox {
        border: 2px solid #010444;
        color: white;
        background: linear-gradient(to bottom, #040a85 0%, #040a85 5%, 
        rgba(4, 9, 87, 0.5) 30%, rgba(4, 9, 87, 0.5) 70%, #040a85 95%), url('/image/genreBar/outfox.png');
        background-size: cover;
        background-position: center;
    }
    .touhou {
        border: 2px solid #180144;
        color: white;
        background: linear-gradient(to bottom, #6028aa 0%, #6028aa 5%, 
        rgba(111, 3, 126, 0.5) 30%, rgba(111, 3, 126, 0.5) 70%, #6028aa 95%), url('/image/genreBar/touhou.png');
        background-size: cover;
        background-position: center;
    }
    .kart {
        border: 2px solid #6d1f1f;
        color: black;
        background: linear-gradient(to bottom, pink 0%, pink 5%, 
        transparent 30%, transparent 70%, pink 95%), url('/image/genreBar/kart.png');
        background-size: cover;
        background-position: center;
    }
</style>