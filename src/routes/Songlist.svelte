<script>
    import { onMount } from "svelte";

    import Button from "../components/Button.svelte";
    import SongBar from "../components/SongBar.svelte";

    const AvailableGenres = [
        {
            color1: "#ff8f53",
            color2: "#f76b20",
            textColor: "black",
            text: "OpenTaiko Chapter I",
            OnClick: () => FilterSongs("ch1", "01 OpenTaiko Chapter I")
        },
        {
            color1: "#575fff",
            color2: "#474ed6",
            textColor: "white",
            text: "OpenTaiko Chapter II",
            OnClick: () => FilterSongs("ch2", "02 OpenTaiko Chapter II")
        },
        {
            color1: "#6effe7",
            color2: "#48f7da",
            textColor: "black",
            text: "OpenTaiko Chapter III",
            OnClick: () => FilterSongs("ch3", "03 OpenTaiko Chapter III")
        },
        {
            color1: "#f3ff87",
            color2: "#e5f748",
            textColor: "black",
            text: "OpenTaiko Chapter IV",
            OnClick: () => FilterSongs("ch4", "04 OpenTaiko Chapter IV")
        },
        {
            color1: "#ff87ab",
            color2: "#f74848",
            textColor: "black",
            text: "OpenTaiko Chapter V",
            OnClick: () => FilterSongs("ch5", "05 OpenTaiko Chapter V")
        },
		{
            color1: "#a6daff",
            color2: "#8aceff",
            textColor: "black",
            text: "OpenTaiko Chapter VI",
            OnClick: () => FilterSongs("ch6", "06 OpenTaiko Chapter VI")
        },
        {
            color1: "#700b0b",
            color2: "#520808",
            textColor: "white",
            text: "Deceiver's Defiances",
            OnClick: () => FilterSongs("deceiver", "C10 Deceiver's Defiances")
        },
        {
            color1: "#ffffff",
            color2: "#bebebe",
            textColor: "black",
            text: "Dashy's Secrets",
            OnClick: () => FilterSongs("dashy", "C12 Dashy's Secrets")
        },
        {
            color1: "#0c3803",
            color2: "#092d02",
            textColor: "white",
            text: "Rainy Memories",
            OnClick: () => FilterSongs("rainy", "E01 Rainy Memories")
        },
        {
            color1: "#cccccc",
            color2: "#999999",
            textColor: "black",
            text: "OpenTaiko Headquarters",
            OnClick: () => FilterSongs("hq", "E02 OpenTaiko Headquarters")
        },
        {
            color1: "black",
            color2: "black",
            textColor: "white",
            text: "???",
            OnClick: () => window.location.replace('secret')
        },
    ];

    let Fetching = false;
    let SongsInfo = {};
    $: SongCards = [];

    const GetSongsByGenre = (genre) => {return SongsInfo.filter(song => song["tjaGenreFolder"] === genre)}

    const FetchSongs = async () => {
        Fetching = true;

        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"));
        let text = (await songs_text.text()).valueOf();
        SongsInfo = JSON.parse(text);

        Fetching = false;
    }

    const FilterSongs = async (genre, fil) => {
        SongCards = [];
        GetSongsByGenre(fil).forEach(song => {
            const SInfo = {
                Genre: genre,
                Title: song["chartTitle"],
                Subtitle: song["chartSubtitle"],
                AudioFilePath: song['chartAudioFilePath'],
                Difficulties: [
                    song["chartDifficulties"]["Easy"] ?? -1,
                    song["chartDifficulties"]["Normal"] ?? -1,
                    song["chartDifficulties"]["Hard"] ?? -1,
                    song["chartDifficulties"]["Oni"] ?? -1,
                    song["chartDifficulties"]["Edit"] ?? -1,
                    song["chartDifficulties"]["Tower"] ?? -1,
                    song["chartDifficulties"]["Dan"] ?? -1
                ],
                UniqueId: song["uniqueId"],
            };

            SongCards.push(SInfo);
        });

        //console.log(SongCards);
    }

    onMount(async () => {
        await FetchSongs();

        //console.log(SongsInfo);

        FilterSongs("ch6", "06 OpenTaiko Chapter VI");
    });


    

</script>

<div class="bg_optk"></div>
<h1 style="color:white;">Song List</h1>
<div class="buttons">
    {#each AvailableGenres as GBox}
        <Button
            color1={GBox.color1}
            color2={GBox.color2}
            textColor={GBox.textColor}
            text={GBox.text}
            OnClick={GBox.OnClick}
        />
    {/each}
</div>
<div id="songs">
    {#if Fetching === true}
        <h1 style="text-align: center; color:white;">Fetching Songs... Please wait.</h1>
        <img src="image/loading.gif" alt="Loading" style="display:block; margin-left:auto; margin-right:auto;">
    {:else}
        {#each SongCards as Card}
            {#key Card.AudioFilePath}
                <SongBar 
                    Title={Card.Title}
                    Subtitle={Card.Subtitle}
                    Difficulties={Card.Difficulties}
                    AudioFilePath={Card.AudioFilePath}
                    Genre={Card.Genre}
                    UniqueId={Card.UniqueId}
                />
            {/key}
        {/each}
    {/if}
</div>

<style>
    @keyframes slide {
        from {
            background-position-x: 0px;
        }
        to {
            background-position-x: -1920px;
        }
    }

    .bg_optk {
        float: right;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: -64px;
        z-index: -1;
        background-color: rgb(150, 150, 150);
        background-image: url("/image/bg_songs.png");
        background-blend-mode: multiply;
        background-size: cover;
        background-repeat: repeat-x;
        background-attachment: fixed;
        animation: slide 90s linear infinite;
    }

    #songs {
        text-align: left;
        margin: auto;
        padding: 0px 100px;
        padding-bottom: 64px;
        max-width: 900px;
    }

    .buttons {
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        vertical-align: middle;
        margin: 0px auto;
        padding: 0px auto;
    } 
</style>