<script>
    import { onMount } from "svelte";

    import Button from "../components/Button.svelte";
    import SongBar from "../components/SongBar.svelte";
    import { SONGLIST_GENRES } from "../lib/genres.js";

    const AvailableGenres = [
        ...SONGLIST_GENRES.map(g => ({
            color1:    g.btnPrimary,
            color2:    g.bg,
            textColor: g.text,
            text:      g.btnLabel ?? g.label,
            OnClick:   () => FilterSongs(g.css, g.folder),
        })),
        {
            color1: "black", color2: "black", textColor: "white",
            text: "???",
            OnClick: () => window.location.replace('secret'),
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

        if (navigator.language === "zh-CN") {
            SongsInfo = SongsInfo.filter(song => song["uniqueId"] != "losTPEtAlSwANDERRBHLiXoUNdsetSUnaN")
        }

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

        FilterSongs("ch7", "07 OpenTaiko Chapter VII");
    });

    const bg_optk_slide = (id) => {
        requestAnimationFrame(slide)
        function slide() {
            const pos = (performance.now() / 90000) * window.screen.width
            const bg = document.getElementById(id)
            if (bg != null)
                bg.style.backgroundPositionX = -pos + "px"
            requestAnimationFrame(slide)
        }
    }
</script>

<div id="bg_optk" onload={bg_optk_slide("bg_optk")}></div>
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
    #bg_optk {
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