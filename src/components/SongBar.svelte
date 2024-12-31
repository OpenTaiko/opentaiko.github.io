<script>
    import DifficultyBlock from "../components/DifficultyBlock.svelte";
    import AudioPlayer from "../components/AudioPlayer.svelte";

    export let Rank;
    export let Title;
    export let Subtitle;
    export let Difficulties = [-1, -1, -1, -1, -1, -1, -1];
    export let AudioFilePath;
    export let Genre;

    $: AudioLink = `https://github.com/OpenTaiko/OpenTaiko-Soundtrack/raw/refs/heads/main/${AudioFilePath}`

</script>

<div class="{Genre} song_bar">
    {#if Rank !== undefined}
    <div class="song_bar_rank">
        <span class="song_bar_rank_nb">#{Rank}</span>
    </div>
    {/if}
    
    <div class="song_bar_main_info">
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
        background-color: #f74848;
        color: black;
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
</style>