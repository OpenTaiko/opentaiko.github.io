<script>
    import { onMount } from "svelte";
    import SongBar from "../components/SongBar.svelte";
    import initSqlJs from "sql.js";

    let db;
    let rows = [];

    const loadDatabase = async () => {
        const sqlPromise = await initSqlJs({
            locateFile: file => `sql-wasm.wasm`
        });

        console.log(sqlPromise.locateFile());

        const dataPromise = fetch("hof.db3").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
        console.log(buf);
        console.log(SQL);
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
        }
    }

    let Fetching = false;
    let SongsInfo = {};
    $: SongCards = [];

    const GetSongsByGenre = (genre) => {return SongsInfo.filter(song => song["tjaGenreFolder"] === genre)}
    const GetSongByUniqueId = (uid) => {return SongsInfo.filter(song => song["uniqueId"] === uid)?.[0] ?? null}

    const FetchSongs = async () => {
        Fetching = true;

        let songs_text = (await fetch("https://raw.githubusercontent.com/OpenTaiko/OpenTaiko-Soundtrack/refs/heads/main/soundtrack_info.json"));
        let text = (await songs_text.text()).valueOf();
        SongsInfo = JSON.parse(text);

        Fetching = false;
    }

    const GetSongsByRank = async () => {
        SongCards = [];
        rows.forEach((row, idx) => {
            const song = GetSongByUniqueId(row[1]);
            let SInfo = {};
            if (song !== null) {
                SInfo = {
                    Rank: idx + 1,
                    Genre: GenreToCSS(song['tjaGenreFolder']),
                    Title: song["chartTitle"],
                    Subtitle: song["chartSubtitle"],
                    AudioFilePath: song['chartAudioFilePath'],
                    Difficulties: [
                        (row[2] === 0) ? song["chartDifficulties"]["Easy"] : -1,
                        (row[2] === 1) ? song["chartDifficulties"]["Normal"] : -1,
                        (row[2] === 2) ? song["chartDifficulties"]["Hard"] : -1,
                        (row[2] === 3) ? song["chartDifficulties"]["Oni"] : -1,
                        (row[2] === 4) ? song["chartDifficulties"]["Edit"] : -1,
                        -1,
                        -1
                    ],
                };
            }
            else {
                SInfo = {
                    Rank: idx + 1,
                    Genre: 'hq',
                    Title: `#${idx+1}. Not Found`,
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
                };
            }

            console.log(SInfo);

            SongCards.push(SInfo);
        });
    }

    onMount(async () => {
        await FetchSongs();

        await loadDatabase();

        GetSongsByRank();

        console.log(rows);
    });


    

</script>

<div class="bg_optk"></div>
<h1 style="color:white;">Hall of Fame</h1>

<div id="songs">
    {#if Fetching === true}
        <h1 style="text-align: center; color:white;">Fetching Songs... Please wait.</h1>
        <img src="image/loading.gif" alt="Loading" style="display:block; margin-left:auto; margin-right:auto;">
    {:else}
        {#each SongCards as Card}
            {#key Card.AudioFilePath}
                <SongBar 
                    Rank={Card.Rank}
                    Title={Card.Title}
                    Subtitle={Card.Subtitle}
                    Difficulties={Card.Difficulties}
                    AudioFilePath={Card.AudioFilePath}
                    Genre={Card.Genre}
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

</style>