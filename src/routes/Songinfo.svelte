<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import SongBar from "../components/SongBar.svelte";
    import TabArea from "../components/TabArea.svelte";
    import DiffTab from "../components/DiffTab.svelte";
    import initSqlJs from "sql.js";
    import { genreToCSS } from "../lib/genres.js";

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

    const GenreToCSS = genreToCSS;

    let songArtists = [];

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
		if (rank <= 0) return 0;
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
        const params = new URLSearchParams(window.location.search);
        const d = params.get('d');
        if (d !== null) initialTab = Number(d);

        await FetchSongs();
        await loadDatabase();

        GetSongInfo();

        console.log(rows);

        // Load artist info for this song
        try {
            const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
            const artistsBuf = await fetch('/artists_info.db3').then(r => r.arrayBuffer());
            const artistsDb = new SQL.Database(new Uint8Array(artistsBuf));

            const sRes = artistsDb.exec(
                `SELECT artists FROM songs WHERE songUid = '${UniqueId}'`
            );
            if (sRes[0]?.values?.[0]?.[0]) {
                const artistIds = JSON.parse(sRes[0].values[0][0]);
                if (artistIds.length > 0) {
                    const ids = artistIds.join(',');
                    const aRes = artistsDb.exec(
                        `SELECT entryId, artist FROM artists WHERE entryId IN (${ids})`
                    );
                    if (aRes[0]) {
                        songArtists = aRes[0].values.map(([id, name]) => ({ id, name }));
                        // Preserve order from the JSON array
                        songArtists.sort((a, b) => artistIds.indexOf(a.id) - artistIds.indexOf(b.id));
                    }
                }
            }
            artistsDb.close();
        } catch (e) {
            console.error('Failed to load artist info:', e);
        }
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

    let initialTab = 1;

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

            {#if songArtists.length > 0}
            <div class="artists-section">
                <h3 class="artists-label">Artists</h3>
                <div class="artists-row">
                    {#each songArtists as a}
                    <Link to="/artistinfo/{a.id}" class="artist-chip">{a.name}</Link>
                    {/each}
                </div>
            </div>
            {/if}

            <TabArea items={tabs} activeTabValue={initialTab}/>
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


    .artists-section {
        margin: 8px 8px 0;
        padding: 10px 14px;
        background: rgba(255,255,255,0.12);
        border-radius: 4px;
    }

    .artists-label {
        margin: 0 0 8px;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(255,255,255,0.7);
    }

    .artists-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    :global(.artist-chip) {
        display: inline-block;
        padding: 5px 14px;
        border-radius: 20px;
        background: rgba(255,255,255,0.15);
        color: white;
        text-decoration: none;
        font-size: 0.9em;
        font-weight: 600;
        border: 1px solid rgba(255,255,255,0.3);
        transition: background 0.15s;
    }

    :global(.artist-chip:hover) {
        background: rgba(255,255,255,0.3);
    }

</style>