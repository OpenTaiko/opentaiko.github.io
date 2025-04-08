<script>
    import { onMount } from "svelte";
    import SongBar from "../components/SongBar.svelte";
    import TabArea from "../components/TabArea.svelte";
    import DiffTab from "../components/DiffTab.svelte";
    import initSqlJs from "sql.js";

    export let UniqueId;

    let db;
    let rows = [];

    const loadDatabase = async () => {
        const sqlPromise = await initSqlJs({
            locateFile: file => `/sql-wasm.wasm`
        });

        const dataPromise = fetch("/hof.db3").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        const db = new SQL.Database(new Uint8Array(buf));
        const result = db.exec("SELECT * FROM entries ORDER BY internalDifficultyIndex DESC");

        rows = result[0] ? result[0].values : [];
    };

    const GenreToCSS = (genre) => {
        switch (genre) {
            case '01 OpenTaiko Chapter I':
                return 'ch1';
            case '02 OpenTaiko Chapter II':
                return 'ch2';
            case '03 OpenTaiko Chapter III':
                return 'ch3';
            case '04 OpenTaiko Chapter IV':
                return 'ch4';
            case '05 OpenTaiko Chapter V':
                return 'ch5';
            case "C10 Deceiver's Defiances":
                return 'deceiver';
            case "C12 Dashy's Secrets":
                return 'dashy';
            case "E01 Rainy Memories":
                return 'rainy';
            case "E02 OpenTaiko Headquarters":
                return 'hq';
            case "C01 Project Outfox Serenity":
                return 'outfox';
            case "C02 Touhou Arrangements":
                return 'touhou';
            case "C03 OpenTaiko Karting":
                return 'kart';
        }
    }

    let Fetching = false;
    let SongsInfo = {};
    $: SongCard = {};

    const GetSongsByGenre = (genre) => {return SongsInfo.filter(song => song["tjaGenreFolder"] === genre)}
    const GetSongByUniqueId = (uid) => {return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null}

    const FetchSongs = async () => {
        Fetching = true;

        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"));
        let text = (await songs_text.text()).valueOf();
        SongsInfo = JSON.parse(text);

        Fetching = false;
    }

    const ComputeMaxListPoints = (rank) => {
        let base = 1000;
        let decreaseRatio = 0.95;
        return parseInt(base * Math.pow(decreaseRatio, rank - 1));
    }

    const GetSongInfo = async () => {
        SongCard = {};

        const song = GetSongByUniqueId(UniqueId);
        let SInfo = {};

        if (song !== null) {
            SInfo = {
                Rank: [
                    song["chartHoFRanks"]?.["Easy"] ?? -1,
                    song["chartHoFRanks"]?.["Normal"] ?? -1,
                    song["chartHoFRanks"]?.["Hard"] ?? -1,
                    song["chartHoFRanks"]?.["Oni"] ?? -1,
                    song["chartHoFRanks"]?.["Edit"] ?? -1,
                    -1,
                    -1
                ],
                UniqueId: UniqueId,
                Genre: GenreToCSS(song['tjaGenreFolder']),
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
                Charters: [
                    song["chartMakers"]["Easy"] ?? "",
                    song["chartMakers"]["Normal"] ?? "",
                    song["chartMakers"]["Hard"] ?? "",
                    song["chartMakers"]["Oni"] ?? "",
                    song["chartMakers"]["Edit"] ?? "",
                    song["chartMakers"]["Tower"] ?? "",
                    song["chartMakers"]["Dan"] ?? ""
                ],
            };
        }
        else {
            SInfo = {
                Rank: [
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1
                ],
                UniqueId: UniqueId,
                Genre: 'hq',
                Title: `Not Found`,
                Subtitle: "",
                AudioFilePath: "",
                Difficulties: [
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1,
                    -1
                ],
                Charters: [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ],
            };
        }

        SongCard = SInfo;
    }

    onMount(async () => {
        await FetchSongs();
        await loadDatabase();

        GetSongInfo();

        console.log(rows);
    });

    const GetTabs = () => {
        let _ret = [];
        const _diff = ["Easy","Normal","Hard","Extreme","Extra"];
        const _colors = ["#98fafa","#98fabe","#f7fa98","#fa98a1","#d198fa"];
        _diff.forEach((diffName, idx) => {
            if (SongCard.Difficulties !== undefined && SongCard.Difficulties[idx] >= 0) {
                const _tab = {
                    label: diffName,
                    value: idx + 1,
                    component: DiffTab,
                    color: _colors[idx],
                    props: {SongCard: SongCard, Difficulty:idx},
                };
                _ret.push(_tab);
            }
        });
        return _ret;
    }

    let tabs = [];
    $: if (SongCard) tabs = GetTabs();

</script>

<div class="bg_optk"></div>

<h1 style="color:white;">Song Info</h1>

<div id="songs">
    {#if Fetching === true}
        <h1 style="text-align: center; color:white;">Fetching Songs... Please wait.</h1>
        <img src="image/loading.gif" alt="Loading" style="display:block; margin-left:auto; margin-right:auto;">
    {:else}
        {#key SongCard.AudioFilePath}
            <SongBar 
                Title={SongCard.Title}
                Subtitle={SongCard.Subtitle}
                Difficulties={SongCard.Difficulties}
                AudioFilePath={SongCard.AudioFilePath}
                Genre={SongCard.Genre}
            />

            <TabArea items={tabs}/>
        {/key}
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